// styling:
import { css, jsx, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useState } from "react";
import Debug from "./components/Debug";

// routing
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

// navigation
import TopNavigationBar from "./components/TopNavigationBar";
import SideNavigationBar from "./components/SideNavigationBar";

// pages
import HomePage from "./pages/HomePage";

// temporary
import Test from "./pages/Test";

import ScheduleResultList from "./components/SceduleResultList";

import { fake_schedules_data } from "./utils/fake-data";
import { newTime, sanitizeTime } from "./utils/date-time";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || "",
  process.env.REACT_APP_SUPABASE_KEY || ""
);

const AppContainer = styled.div`
  overflow: hidden;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.background.main};

  display: flex;
  flex-flow: column nowrap;
`;
const PageContainer = styled.div`
  overflow: hidden;
  height: 100%;

  display: flex;
  flex-flow: row nowrap;
`;

const ContentContainer = styled.div`
  overflow: auto;
  width: 100%;
`;

type Result = {
  id: string;
  result: any[];
};

const App = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await queryFakeScheduleData();
      setLoading(false);
      setResults(data);
    };

    fetchData();
  }, []);

  const insertAllCourses = async () => {
    const allCoursesInFakeData = fake_schedules_data.flatMap((schedule) =>
      schedule.result.map((course) => course)
    );

    const coursesMapToDatabaseVariables = allCoursesInFakeData.map(
      (course) => ({
        course_code: course.courseCode,
        section: course.section,
        class_num: course.classNum,

        course_title: course.courseTitle,
        type: course.type,
        days: course.days,
        start_time: course.startTime,
        end_time: course.endTime,
        open_seats: course.openSeats,
        location: course.location,
        instructor: course.instructor,
        notes: course.notes,
      })
    );

    const { data, error } = await supabase
      .from("courses")
      .insert(coursesMapToDatabaseVariables);

    console.log(data);
    console.log(error);
  };

  const insertFakeSchedules = async () => {
    const schedules = fake_schedules_data.flatMap((schedule) =>
      schedule.result.map((course) => ({
        schedule_id: schedule.id,
        course_code: course.courseCode,
        section: course.section,
        class_num: course.classNum,
      }))
    );

    const { data, error } = await supabase
      .from("fake_schedule_results")
      .insert(schedules);

    console.log(data);
    console.log(error);
  };

  const queryFakeScheduleData = async () => {
    let { data, error } = await supabase
      .from(`fake_schedule_results`)
      .select("*, courses ( * )");

    return shapeDataToResultObject(data);
  };

  const shapeDataToResultObject = (data: any) => {
    const ids = [...new Set(data?.map((res: any) => res.schedule_id))];

    const fake_results = ids.map((id) => ({
      id,
      result: data
        ?.map((res: any) =>
          res.schedule_id === id
            ? {
                courseCode: res.courses.course_code,
                section: res.courses.section,
                classNum: res.courses.class_num,

                courseTitle: res.courses.course_title,
                type: res.courses.type,
                days: res.courses.days,
                openSeats: res.courses.open_seats,
                location: res.courses.location,
                instructor: res.courses.instructor,
                notes: res.courses.notes,

                startTime: sanitizeTime(res.courses.start_time),
                endTime: sanitizeTime(res.courses.end_time),
              }
            : null
        )
        .filter((val: any) => val !== null),
    })) as Result[];
    return fake_results;
  };

  return (
    <AppContainer>
      {/* <ScheduleResultList results={results} /> */}
      <BrowserRouter>
        <TopNavigationBar></TopNavigationBar>
        <PageContainer>
          <SideNavigationBar></SideNavigationBar>
          <ContentContainer>
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route
                path="/schedule"
                component={() => <ScheduleResultList results={results} />}
              />
              <Route path="/test" component={Test} />
            </Switch>
          </ContentContainer>
        </PageContainer>
        {/* <ScheduleResultList /> */}
      </BrowserRouter>
    </AppContainer>
  );
};

export default App;
