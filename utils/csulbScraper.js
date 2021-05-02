// Web-scraping script for CSULB
const axios = require("axios");
const cheerio = require("cheerio");

// Automate by configuring year and semester (Spring, Summer, Fall, Winter)
const srcUrl =
  "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/index.html";
const mainUrl =
  "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2021/By_Subject/";

const fetchData = async () => {
  let urls = [];

  return axios
    .get(srcUrl)
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

      urls.forEach((subUrl, i) => {
        promises.push(axios.get(subUrl["subDirectory"]).catch((error) => null));
      });

      return axios
        .all(promises)
        .then((htmls) => {
          let schedules = [];
          let rooms = new Map();

          htmls.forEach((html, i) => {
            let $ = cheerio.load(html.data);
            $("table.sectionTable tbody tr:not(:first-child)").each(
              (i, element) => {
                let times = $(element).children().eq(7).text().split("-");

                let start = times[0];
                let end = times[times.length - 1];

                let time = end.includes("PM")
                  ? "PM"
                  : end.includes("AM")
                  ? "AM"
                  : "N/A";

                if (time === "PM" || time === "AM") {
                  end = end.replace(time, "");
                }

                let locations = $(element).children().eq(9).text().split("-");

                let building = locations[0];
                let room = locations[locations.length - 1];

                if (!rooms.has(building)) {
                  rooms.set(building, new Set());
                } else {
                  let roomSet = rooms.get(building);
                  roomSet.add(room);
                }

                schedules.push({
                  major: $("h2.departmentTitle").text(),
                  sectionNumber: $(element).children().eq(0).text(),
                  classNumber: $(element).children().eq(1).text(),
                  type: $(element).children().eq(5).text(),
                  day: $(element)
                    .children()
                    .eq(6)
                    .text()
                    .split(/ (?=M)|(?=W)|(?=Tu)|(?=Th)|(?=F)|(?=Sa) /g),
                  startTime: start,
                  endTime: end,
                  time: time,
                  building: building,
                  room: room,
                  instructor: $(element).children().eq(10).text(),
                });

                // schedules.push({
                //   major: $("h2.departmentTitle").text(),
                //   sectionNumber: $(element)
                //     .children()
                //     .eq(0)
                //     .text(),
                //   classNumber: $(element)
                //     .children()
                //     .eq(1)
                //     .text(),
                //   type: $(element)
                //     .children()
                //     .eq(5)
                //     .text(),
                //   day: $(element)
                //     .children()
                //     .eq(6)
                //     .text(),
                //   time: $(element)
                //     .children()
                //     .eq(7)
                //     .text(),
                //   room: $(element)
                //     .children()
                //     .eq(9)
                //     .text(),
                //   instructor: $(element)
                //     .children()
                //     .eq(10)
                //     .text()
                // });
              }
            );
          });
          // console.log(schedules);
          return [schedules, rooms];
        })
        .catch((errors) => {
          console.log(errors);
        });
    })
    .then((sched) => {
      return sched;
    })
    .catch((error) => {
      console.log(error);
    });
};

fetchData().then((data) => {
  console.log(data);
});
