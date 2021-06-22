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
                  info: "",
                  units: "",
                  groups: [],
                };

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
                        group.classes.push({
                          section: $(kElement).children().eq(0).text(),
                          classNum: $(kElement).children().eq(1).text(),
                          type: $(kElement).children().eq(5).text(),
                          days: $(kElement).children().eq(6).text(),
                          time: $(kElement).children().eq(7).text(),
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

              // /////////////////////////////////////////////////////////////////////////////////////////////////////////////

              // Save course schedule per department into json file.
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
          })
          .catch((err) => {
            console.log(err);
          });
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
