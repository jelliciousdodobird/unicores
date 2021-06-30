// Web-scraping script for CSULB
// Notes: Generated JSON file shows "error" between different json objects containing an entire departments selection of courses.
const axios = require("axios");
const cheerio = require("cheerio");

const fs = require("fs");

// Automate by configuring year and semester (Spring, Summer, Fall, Winter)
const srcUrl =
  "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/index.html";
const mainUrl =
  "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/";

const DEFAULT_DATE = { m: 0, d: 1, y: 2021, str: "2021-01-01" };

const newTime = (time) => {
  const dateString = DEFAULT_DATE.str;
  const timeString = `T${time}:00`;
  const datetime = new Date(dateString + timeString);

  return datetime;
};

const fetchData = async () => {
  const urls = [];

  // Create/overwrite empty json file for results.
  fs.closeSync(fs.openSync("./scripts/schedule.json", "w"));

  return (
    axios
      .get(srcUrl)
      // First promise returns all subdirectories for each major
      .then((html) => {
        let $ = cheerio.load(html.data);
        $("div.indexList ul li").each((i, element) => {
          urls.push({
            subject: $(element).text(),
            subDirectory: mainUrl.concat($(element).find("a").attr("href")),
          });
        });

        return urls;
      })
      .then((urls) => {
        const promises = [];
        const schedule = [];

        // Create list of promises to iterate through and return html per subdirectory
        urls.forEach((subUrl, i) => {
          promises.push(
            axios
              .get(subUrl["subDirectory"])
              .catch((error) =>
                console.log(
                  "Error: Subdirectory " +
                    subUrl["subDirectory"] +
                    "cannot be returned."
                )
              )
          );
        });

        // Iterate through each promise and process returned htmls
        return axios
          .all(promises)
          .then((htmls) => {
            htmls.forEach((html, i) => {
              const departmentClasses = {
                major: "",
                courses: [],
              };

              let $ = cheerio.load(html.data);

              // Obtain details per department.
              departmentClasses.major = $("h2.departmentTitle").text();

              // Iterate through each course information (not classes) and save.
              $("div.courseBlock").each((i, element) => {
                const courseInfo = {
                  courseCode: "",
                  courseTitle: "",
                  session: "",
                  info: "",
                  units: "",
                  groups: [],
                };

                if ($(element).parent().find("h2").hasClass("sessionTitle")) {
                  courseInfo.session = $(element)
                    .parent()
                    .find("h2.sessionTitle")
                    .text();
                }

                courseInfo.courseCode = $(element)
                  .find(" div.courseHeader h4 span.courseCode")
                  .text()
                  .trim();

                courseInfo.courseTitle = $(element)
                  .find(" div.courseHeader h4 span.courseTitle")
                  .text()
                  .trim();

                courseInfo.info = $(element)
                  .find(" div.courseHeader span.courseInfo")
                  .text()
                  .trim();

                courseInfo.units = $(element)
                  .find(" div.courseHeader span.units")
                  .text()
                  .trim();

                // /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Iterate through each class and obtain "group" information.
                // Groups are "groups of classes" that are grouped together typically for requirments.
                // IE requiring a lab+sem together
                $(element)
                  .find(" table.sectionTable")
                  .each((j, jElement) => {
                    let group = { group: "", requirements: "", classes: [] };
                    if ($(jElement).prev().has("h5").text()) {
                      group.group = $(jElement).prev().find("h5").text();
                    }
                    if ($(jElement).prev().hasClass("groupMessage")) {
                      group.requirements = $(jElement).prev().find("p").text();
                    }

                    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Iterate through all classes in each group.
                    $(jElement)
                      .find("tbody tr:not(:first-child)")
                      .each((k, kElement) => {
                        // Defining individual class days
                        const days = $(kElement)
                          .children()
                          .eq(6)
                          .text()
                          .split(/ (?=M)|(?=W)|(?=Tu)|(?=Th)|(?=F)|(?=Sa) /u);

                        // Defining starttime and endtime in proper date format
                        const time = {
                          starttime: { date: "", hour: "", minute: "" },
                          endtime: { date: "", hour: "", minute: "" },
                        };

                        if (
                          ["PM", "AM"].some((el) =>
                            $(kElement).children().eq(7).text().includes(el)
                          )
                        ) {
                          let times = $(kElement)
                            .children()
                            .eq(7)
                            .text()
                            .split("-");

                          let AMPM = times[times.length - 1].includes("PM")
                            ? "PM"
                            : "AM";
                          let starttime = times[0].split(":");
                          let endtime = times[times.length - 1]
                            .replace(AMPM, "")
                            .split(":");

                          let SThour = parseInt(starttime[0], 10);
                          starttime.length > 1
                            ? (time.starttime.minute = starttime[1])
                            : (time.starttime.minute = "00");
                          let EThour = parseInt(endtime[0], 10);
                          endtime.length > 1
                            ? (time.endtime.minute = endtime[1])
                            : (time.endtime.minute = "00");

                          if (AMPM === "PM" && EThour !== 12) {
                            // If the start hour is greater than the end hour, then the start hour is AM and the end hour is PM.
                            // Therefore if the start hour is less than the end hour, then the start hour is in the same midday.
                            // This is under the assumption that no class is 12 hours long.
                            if (SThour < EThour) SThour = SThour + 12;
                            EThour = EThour + 12;
                          }

                          SThour < 10
                            ? (time.starttime.hour = "0" + SThour.toString())
                            : (time.starttime.hour = SThour.toString());
                          EThour < 10
                            ? (time.endtime.hour = "0" + EThour.toString())
                            : (time.endtime.hour = EThour.toString());

                          time.starttime.date = newTime(
                            time.starttime.hour + ":" + time.starttime.minute
                          );
                          time.endtime.date = newTime(
                            time.endtime.hour + ":" + time.endtime.minute
                          );
                        }

                        // Add all data
                        group.classes.push({
                          section: $(kElement).children().eq(0).text(),
                          classNum: $(kElement).children().eq(1).text(),
                          type: $(kElement).children().eq(5).text(),
                          days: days,
                          time: time,
                          openSeats: $(kElement)
                            .children()
                            .eq(8)
                            .find("div")
                            .hasClass("dot")
                            ? $(kElement)
                                .children()
                                .eq(8)
                                .find("div.dot")
                                .find("img")
                                .attr("title")
                            : "",
                          location: $(kElement).children().eq(9).text(),
                          instructor: $(kElement).children().eq(10).text(),
                          notes: $(kElement).children().eq(11).text(),
                        });
                      });

                    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    courseInfo.groups.push(group);
                  });
                departmentClasses.courses.push(courseInfo);
              });
              schedule.push(departmentClasses);
            });
            return schedule;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .then((schedule) => {
        // Save course schedule into json file.
        try {
          const data = JSON.stringify(schedule);
          fs.appendFileSync("./scripts/schedule.json", data);
        } catch (err) {
          console.log("Error writing into Json.");
        }
      })
      .catch((err) => {
        console.log("Script failed.");
        console.error(err);
      })
  );
};

// Run script.
fetchData()
  .then((result) => {
    console.log("Script finished successfully.");
  })
  .catch((err) => {
    console.log("Script failed.");
    console.error(err);
  });
