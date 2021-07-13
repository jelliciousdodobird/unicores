// Web-scraping script for CSULB
// Notes: Generated JSON file shows "error" between different json objects containing an entire departments selection of courses.
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import readline from "readline";
import { newTime } from "../src/utils/date-time";

const ARGS = yargs(process.argv.slice(2))
  .option("raw", {
    alias: "r",
    type: "boolean",
    description: "Outputs the raw data before post processing",
    default: false,
  })
  .option("post_process", {
    alias: "pp",
    type: "boolean",
    description: "Outputs the processed raw data",
    default: false,
  })
  .option("period", {
    alias: "p",
    type: "string",
    // requiresArg: 1,
    default: "fall",
    coerce: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(), // lowercases & normalizes argument value
  })
  .option("year", {
    alias: "y",
    type: "number",
    // requiresArg: 1,
    default: new Date().getFullYear(),
  })
  .option("output", {
    alias: "o",
    type: "string",
    // requiresArg: 1,
    default: null,
  })
  .parseSync();

console.log("CLI arguments:", ARGS);

/*************************************************************
 * FILE UTILITY FUNCTIONS
 *************************************************************/
const appendToFilename = (filename: string, str: string) => {
  const lastPeriodIndex = filename.lastIndexOf(".");

  const fileName = filename.slice(0, lastPeriodIndex);
  const filetype = filename.slice(lastPeriodIndex, filename.length + 1);

  return lastPeriodIndex === -1 ? filename : `${fileName}${str}${filetype}`;
};

const determineFilename = (appendStr: string) =>
  ARGS.output
    ? appendToFilename(ARGS.output || "", appendStr)
    : `${ARGS.period}-${ARGS.year}${appendStr}.json`;

const outputToFile = (data: any, filename: string) => {
  // // Create / overwrite empty json file for results.
  // fs.closeSync(fs.openSync("./scripts/schedule.json", "w"));
  try {
    const stringifiedData = JSON.stringify(data);
    const url = path.resolve(__dirname, filename);

    fs.writeFileSync(url, stringifiedData);
    // fs.appendFileSync(path.resolve(__dirname, filename), stringifiedData);

    return url;
  } catch (err) {
    console.log("Error writing into Json.");
    return "";
  }
};

const pauseForInput = (query: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};
// Automate by configuring year and semester (Spring, Summer, Fall, Winter)
// const srcUrl =
//   "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/index.html";
// const mainUrl =
//   "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/";

const mainUrl = `http://web.csulb.edu/depts/enrollment/registration/class_schedule/${ARGS.period}_${ARGS.year}/By_Subject/`;
const srcUrl = `${mainUrl}index.html`;

// !!!!! THESE TYPES ARE JUST SO THAT fetchData() WORKS WITH TYPESCRIPT
// !!!!! DO NOT USE ANYWHERE ELSE IN THIS FILE
type Raw_Class = {
  section: string;
  classNum: string;
  type: string;
  days: string[];
  time: {
    starttime: { date: string; hour: string; minute: string };
    endtime: { date: string; hour: string; minute: string };
  };
  openSeats: string;
  location: string;
  instructor: string;
  notes: string;
};

type Raw_Group = {
  group: string;
  requirements: string;
  classes: Raw_Class[];
};

type Raw_CourseInfo = {
  courseCode: string;
  courseTitle: string;
  session: string;
  info: string;
  units: string;
  groups: Raw_Group[];
};

// fetchData() NEEDS TO BE TYPED PROPERLY
// RIGHT NOW IT IS TYPED JUST SO "IT WORKS"
// BAD TYPESCRIPT PRACTICES HERE :(
// WILL FIX WHEN TIME PERMITS
const fetchData = async () => {
  const urls: any = [];

  return (
    axios
      .get(srcUrl)
      // First promise returns all subdirectories for each major
      .then((html) => {
        let $ = cheerio.load(html.data);
        $("div.indexList ul li").each((i, element) => {
          urls.push({
            subject: $(element).text(),
            subDirectory: mainUrl.concat(
              $(element).find("a").attr("href") || ""
            ),
          });
        });

        return urls;
      })
      .then((urls) => {
        const promises: any = [];
        const schedule: any = [];

        // Create list of promises to iterate through and return html per subdirectory
        urls.forEach((subUrl: any, i: number) => {
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
            htmls.forEach((html: any, i: number) => {
              const departmentClasses: {
                major: string;
                courses: Raw_CourseInfo[];
              } = {
                major: "",
                courses: [],
              };

              let $ = cheerio.load(html.data);

              // Obtain details per department.
              departmentClasses.major = $("h2.departmentTitle").text();

              // Iterate through each course information (not classes) and save.
              $("div.courseBlock").each((i, element) => {
                const courseInfo: Raw_CourseInfo = {
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
                    let group: Raw_Group = {
                      group: "",
                      requirements: "",
                      classes: [],
                    };

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

                          time.starttime.hour =
                            SThour < 10
                              ? "0" + SThour.toString()
                              : SThour.toString();

                          time.endtime.hour =
                            EThour < 10
                              ? "0" + EThour.toString()
                              : EThour.toString();

                          time.starttime.date = newTime(
                            time.starttime.hour + ":" + time.starttime.minute
                          ).toISO();
                          time.endtime.date = newTime(
                            time.endtime.hour + ":" + time.endtime.minute
                          ).toISO();
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
                                .attr("title") || ""
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
      .catch((err) => {
        console.log("Script failed.");
        console.error(err);
      })
  );
};

const postProcess = (data: any) => {
  return data.map((v: any, i: number) => "REPLACED ALL YOUR DATA " + i);
};

// Run script.
const runScript = async () => {
  console.log(`>>> Script started for:\n    ${srcUrl}`);

  let rawDataLocation = "";
  let processedDataLocation = "";

  console.log(">>> Scraping raw data...");
  const rawData = await fetchData();
  // const rawData = ["abc", "gdf", "t"];
  console.log(">>> Completed scraping data!");

  if (ARGS.raw)
    rawDataLocation = outputToFile(rawData, determineFilename("-RAW"));

  if (ARGS.post_process) {
    console.log(">>> Processing scraped data...");
    const processedData = postProcess(rawData);
    console.log(">>> Completed processing data!");
    processedDataLocation = outputToFile(
      processedData,
      determineFilename("-PP")
    );
  }

  if (!ARGS.raw && !ARGS.post_process) {
    console.log(
      "!!! Since neither --raw or --pp were passed, the raw scraped data will be printed to console."
    );

    await pauseForInput(">>> Press [ENTER] to continue.\n>>> ");
    console.log(rawData);
  }

  console.log(
    rawDataLocation && `>>> Raw scraped data saved in ${rawDataLocation}`
  );
  console.log(
    processedDataLocation &&
      `>>> Processed data saved in ${processedDataLocation}`
  );
};

runScript();
