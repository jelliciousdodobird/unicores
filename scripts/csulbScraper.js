// Web-scraping script for CSULB
const axios = require("axios");
const cheerio = require("cheerio");

const fs = require("fs");

// Automate by configuring year and semester (Spring, Summer, Fall, Winter)
const srcUrl =
  "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/index.html";
const mainUrl =
  "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/";

const fetchData = async () => {
  const urls = [];

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
        let promises = [];

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
            // let schedules = [];
            // let rooms = new Map();

            htmls.forEach((html, i) => {
              const departmentClasses = {
                major: "",
                courses: [],
              };

              const courseInfo = {
                courseCode: "",
                courseTitle: "",
                info: "",
                units: "",
                groups: [],
              };

              // const group = { group: "", requirements: "", classes: [] };

              // const classInfo = {
              //   section: "",
              //   classNum: "",
              //   type: "",
              //   days: "",
              //   time: "",
              //   openSeats: "",
              //   location: "",
              //   instructor: "",
              //   notes: "",
              // };

              let $ = cheerio.load(html.data);

              departmentClasses.major = $("h2.departmentTitle").text();

              $("div.courseBlock").each((i, element) => {
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

                let group = { group: "", requirements: "", classes: [] };

                // console.log(JSON.stringify(courseInfo));

                // /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                $(element)
                  .find(" table.sectionTable")
                  .each((j, jElement) => {
                    if ($(jElement).prev().has("h5").text()) {
                      group.group = $(jElement).prev().find("h5").text();
                    }
                    if ($(jElement).prev().hasClass("groupMessage")) {
                      group.requirements = $(jElement).prev().find("p").text();
                    }

                    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    $(jElement)
                      .find("tbody tr:not(:first-child)")
                      .each((k, kElement) => {
                        // classInfo.section = $(kElement).children().eq(0).text();
                        // classInfo.classNum = $(kElement)
                        //   .children()
                        //   .eq(1)
                        //   .text();
                        // classInfo.type = $(kElement).children().eq(5).text();
                        // classInfo.days = $(kElement).children().eq(6).text();
                        // classInfo.time = $(kElement).children().eq(7).text();
                        // if ($(kElement).children().eq(8).has("div.dot")) {
                        //   classInfo.openSeats = $(kElement)
                        //     .children()
                        //     .eq(8)
                        //     .find("div.dot")
                        //     .find("img")
                        //     .data("title");
                        // }
                        // classInfo.location = $(kElement)
                        //   .children()
                        //   .eq(9)
                        //   .text();
                        // classInfo.instructor = $(kElement)
                        //   .children()
                        //   .eq(10)
                        //   .text();
                        // classInfo.notes = $(kElement).children().eq(11).text();
                        // console.log("oooooooooooooooooooooooooo");
                        // console.log(classInfo);
                        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");
                        // group.classes.push(classInfo);
                        // console.log(group);
                        group.classes.push({
                          section: $(kElement).children().eq(0).text(),
                          classNum: $(kElement).children().eq(1).text(),
                          type: $(kElement).children().eq(5).text(),
                          days: $(kElement).children().eq(6).text(),
                          time: $(kElement).children().eq(7).text(),
                          openSeats: $(kElement).children().eq(8).has("div.dot")
                            ? $(kElement)
                                .children()
                                .eq(8)
                                .find("div.dot")
                                .find("img")
                                .data("title")
                            : "",
                          location: $(kElement).children().eq(9).text(),
                          instructor: $(kElement).children().eq(10).text(),
                          notes: $(kElement).children().eq(11).text(),
                        });
                      });

                    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  });
                courseInfo.groups.push(group);
              });
              departmentClasses.courses.push(courseInfo);

              // /////////////////////////////////////////////////////////////////////////////////////////////////////////////

              try {
                fs.appendFileSync(
                  "./scripts/schedule.json",
                  JSON.stringify(departmentClasses)
                );
              } catch (err) {
                console.log(
                  "Error writing into Json " + departmentClasses.major
                );
              }
            });
            return "Successful.";
          })
          .catch((errors) => {
            console.log(errors);
          });
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      })
  );
};

fetchData().then((result) => {
  console.log(result);
});
