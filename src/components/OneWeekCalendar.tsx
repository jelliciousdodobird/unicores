// styling:
import { css, jsx, Theme } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { useRef, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

// custom components:
import Debug from "./Debug";
import IconButton from "./IconButton";
import OWCEventItem from "./OWCEventItem";

// icons:
import { MdAccessTime } from "react-icons/md";

// utils:
import {
  newTime,
  TimeFormat,
  Weekday,
  WEEKDAY,
  WeekTypeHelper,
  WeekdayShorter,
  zero,
  WEEKDAY_LOOKUP,
  formatTime,
} from "../utils/date-time";
import { DateTime } from "luxon";

const TIME_LABEL_WIDTH = 60;
const DOT_SIZE = 5;
const ROUNDED_CORNER = 15;

const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.surface.main};
  width: 100%;
`;

const Grid = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.main};
  overflow: hidden;

  /* border: 1px solid ${({ theme }) => theme.colors.background.main};
  border-bottom-left-radius: ${ROUNDED_CORNER}px;
  border-bottom-right-radius: ${ROUNDED_CORNER}px; */

  display: grid;
  grid-template-columns: ${TIME_LABEL_WIDTH}px 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  /* gap: 1px 1px; */

  .h {
    border-right: none;
    background-color: ${({ theme }) => theme.colors.background.light};
  }

  .x {
  }

  .cell:nth-last-of-type(-n + 8) {
    border-right: none;
  }

  .cell:nth-of-type(8n) {
    border-right: none;
  }

  .cell:nth-of-type(8n + 1) {
    /* background-color: red; */
    /* z-index: 1000; */
  }
`;

const Cell = styled.div`
  position: relative;
  height: ${({ cellHeight }: { cellHeight: number }) => cellHeight}px;
  background-color: ${({ theme }) => theme.colors.surface.main};

  border-top: 1px solid ${({ theme }) => theme.colors.background.main};
  border-right: 1px solid ${({ theme }) => theme.colors.background.main};
`;

const DimensionWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimeFormatLabel = styled.p`
  position: absolute;
  top: 0;
  left: 0;

  margin: 1px 3px;
  z-index: 10;

  font-weight: 600;
  font-size: 0.7rem;
`;

const TimeFormatButton = styled(IconButton)`
  position: relative;
  background-color: #efefef;
  min-width: ${TIME_LABEL_WIDTH}px;

  height: 100%;
  width: 100%;

  span {
    svg {
      height: 1.2rem;
      width: 1.2rem;
      path {
        fill: ${({ theme }) => theme.colors.onBackground.main};
      }
    }
    p {
      margin-left: 5px;
      font-weight: 600;
      font-size: 0.9rem;
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;

const H = styled.h2`
  position: relative;

  background-color: transparent;

  height: 100%;

  text-transform: uppercase;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimeText = styled(motion.span)`
  position: absolute;
  top: 0;
  left: 0;

  transform: translateY(-55%); // this gets overwrited by framer motion

  white-space: nowrap;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.surface.darker};

  width: 90%;
  padding-right: 5px;

  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  justify-content: flex-end;
`;

const Guideline = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  height: 0;
  width: calc(100% - ${TIME_LABEL_WIDTH}px);
  pointer-events: none;

  border-bottom: 1px solid
    ${({ theme, hovered }: { hovered: boolean; theme?: Theme }) =>
      hovered ? theme?.colors.error.main : theme?.colors.primary.main};
`;

const HourMarker = styled.div`
  z-index: 9999;

  position: absolute;
  right: 0;

  ${({ startOffset, span }: { startOffset: number; span: number }) => css`
    top: ${startOffset - 1}px;
    height: ${span + 1}px;
  `}

  width: ${DOT_SIZE}px;
  background-color: ${({ theme }) => theme.colors.error.main};
  transform: translateX(${DOT_SIZE / 2}px);
`;

/************************************************************************************************/

const HEADING = "h";
const EXTRA = "x";
const TIME = "tm";

const HOURS = [...Array(25).keys()].map((h, i) => {
  const time = newTime(`${zero(h)}${h}:00`);

  return {
    h: time,
    h24: h === 24 ? "24:00" : formatTime(time, "24H"),
    h12: formatTime(time, "12H", false, false),
    hourOnly24: h.toString(),
    key: `${h}:00`,
  };
});

const DAYS = [
  WEEKDAY.SUNDAY,
  WEEKDAY.MONDAY,
  WEEKDAY.TUESDAY,
  WEEKDAY.WEDNESDAY,
  WEEKDAY.THURSDAY,
  WEEKDAY.FRIDAY,
  WEEKDAY.SATURDAY,
];

const DAYS_LOOKUP = new Map<WeekdayShorter, WeekTypeHelper>();

// const Row = [HEADING, EXTRA, ...[...Array(25).keys()].map((hh) => `${hh}:00`)];

export type RowKey = "0";
export type ColumnKey = typeof TIME | WeekdayShorter;

const Row = [...Array(25).keys()].map((hh) => `${hh}:00`);
const Column: ColumnKey[] = [
  TIME,
  WEEKDAY.SUNDAY.SHORTER, // "s"
  WEEKDAY.MONDAY.SHORTER, // "m"
  WEEKDAY.TUESDAY.SHORTER, // "t"
  WEEKDAY.WEDNESDAY.SHORTER, // "w"
  WEEKDAY.THURSDAY.SHORTER, // "th"
  WEEKDAY.FRIDAY.SHORTER, // "f"
  WEEKDAY.SATURDAY.SHORTER, // "sa"
];

DAYS.forEach((value, i) =>
  DAYS_LOOKUP.set(Column[i + 1] as WeekdayShorter, value)
);

const DEFAULT_EDGE = { min: 0, max: Row.length - 1 };
const INVISIBLE_GUIDELINE = -40;
export const INITIAL_MARKER: MarkerInfo = {
  key: "",
  startOffset: 0,
  span: 0,
};

/************************************************************************************************/

export interface ClassSection extends OWCEvent {
  courseCode: string;
  courseTitle: string;
  section: string;
  classNum: string;
  type: string;
  openSeats: string;
  location: string;
  instructor: string;
  notes: string;
}

export interface OWCEvent {
  eventId: string;
  startTime: DateTime;
  endTime: DateTime;
  days: Weekday[];
  [propName: string]: any;
}

export interface OneWeekCalendarProps {
  // data: ClassSection[];
  data: OWCEvent[];
  cellHeight?: number;
  minMode?: boolean;
}

export type MarkerInfo = {
  key: string; // should be RowKey type
  startOffset: number;
  span: number;
};

/************************************************************************************************/

const OneWeekCalendar = ({
  data = [],
  cellHeight = 3 * 14, // 3rem
  minMode = false,
}: OneWeekCalendarProps) => {
  // STATE:
  const [eventsMap, setEventsMap] = useState<{ [key: string]: OWCEvent }>({});
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("24H");
  const [edge, setEdge] = useState(DEFAULT_EDGE);
  const [markerPosition, setMarkerPosition] =
    useState<MarkerInfo>(INITIAL_MARKER);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const y = useMotionValue(INVISIBLE_GUIDELINE);

  const isLaptop = useMediaQuery({
    query: `(max-width: 1000px)`,
  });

  const isMobile = useMediaQuery({
    query: `(max-width: 500px)`,
  });

  // DERIVED STATE:
  const appliedEdge = minMode ? { ...edge } : DEFAULT_EDGE;

  // USEEFFECTS:
  useEffect(() => {
    const determineTimeEdge = () => {
      let min = 0;
      let max = 0;

      const listOfTimes: DateTime[] = [];

      data.forEach((course, i) => {
        listOfTimes.push(course.startTime);
        listOfTimes.push(course.endTime);
      });

      listOfTimes.sort((a, b) => a.toSeconds() - b.toSeconds());

      const earliestTime = listOfTimes[0].toSeconds();
      const latestTime = listOfTimes[listOfTimes.length - 1].toSeconds();

      HOURS.forEach(({ h }, i) => {
        const hourStep = h.toSeconds();
        // const nextHourStep = addHours(h, 1).toSeconds();
        const nextHourStep = h.plus({ hours: 1 }).toSeconds();

        if (earliestTime >= hourStep && earliestTime < nextHourStep) min = i;
        if (latestTime >= hourStep && latestTime < nextHourStep)
          max = Math.min(i + 1, Row.length - 1);
      });
      return { min, max };
    };

    const mapEvents = () => {
      let eventMap = {};

      data.forEach((event) => {
        event.days.forEach((day) => {
          const key = getCoordinateKey(event.startTime, day);
          eventMap = { ...eventMap, [key]: event };
        });
      });

      return eventMap;
    };

    setEventsMap(mapEvents());

    setEdge(determineTimeEdge());
  }, [data]);

  // FUNCTIONS:
  const toggleTimeFormat = () =>
    setTimeFormat((v) => (v === "24H" ? "12H" : "24H"));

  const getCoordinateKey = (time: DateTime, day: Weekday) =>
    `${day}${time.hour}`;

  const calcCellOffset = (time: DateTime, hourTime: DateTime) =>
    time.diff(hourTime, "hours").hours * cellHeight;

  const hideGuideline = () => y.set(INVISIBLE_GUIDELINE);

  const updateGuidelinePosition = (e: React.MouseEvent) => {
    const container = gridRef.current?.getBoundingClientRect();
    if (!container || !e) return;

    const { y: offset, height } = container;
    const newPosition = Math.round(e.clientY - offset);

    if (newPosition < cellHeight || newPosition > height - cellHeight)
      hideGuideline();
    else y.set(newPosition);
  };

  // COMPONENT RENDERING FUNCTIONS:
  const renderEventItem = (rowkey: string, day: Weekday) => {
    const hourTime = HOURS.find((hh) => hh.key === rowkey);

    if (!hourTime) return;

    const event = eventsMap[getCoordinateKey(hourTime.h, day)];

    return (
      event && (
        <OWCEventItem
          event={event}
          startOffset={calcCellOffset(event.startTime, hourTime.h)}
          span={calcCellOffset(event.endTime, event.startTime)}
          setTimes={setMarkerPosition}
          timeFormat={timeFormat}
          // lineGuides
        />
      )
    );
  };

  const getHourMarkerComponents = (row: string, col: ColumnKey) => {
    return (
      col === TIME &&
      row === markerPosition.key && (
        <HourMarker
          startOffset={markerPosition.startOffset}
          span={markerPosition.span}
        />
      )
    );
  };

  const getTimeLabelComponents = (row: string, rowIndex: number) => {
    const hour = HOURS.find((h) => h.key === row);
    if (!hour) return;

    if (isMobile)
      return <TimeText>{timeFormat === "24H" ? hour.h24 : hour.h12}</TimeText>;

    const animationProps = {
      variants: {
        hidden: {
          x: -200,
          y: "-55%",
        },
        show: {
          x: 0,
          y: "-55%",
        },
      },
      initial: "hidden",
      animate: "show",
      exit: "hidden",
      transition: {
        type: "tween",
        duration: 0.25,
        delay: 0.02 * rowIndex,
      },
    };

    return (
      <AnimatePresence>
        {timeFormat === "24H" ? (
          <TimeText key={`${row}-1`} {...animationProps}>
            {hour.h24}
          </TimeText>
        ) : (
          <TimeText key={`${row}-2`} {...animationProps}>
            {hour.h12}
          </TimeText>
        )}
      </AnimatePresence>
    );
  };

  const getHeadingComponents = (col: ColumnKey) => {
    const day = WEEKDAY_LOOKUP[col];

    return col === TIME ? (
      <>
        <TimeFormatLabel>{timeFormat === "24H" ? 24 : 12}</TimeFormatLabel>
        <TimeFormatButton onClick={toggleTimeFormat} icon={MdAccessTime} />
      </>
    ) : (
      <H> {isMobile ? day.SHORTER : isLaptop ? day.SHORT : day.FULL}</H>
    );
  };

  return (
    <Container>
      <Guideline
        style={{ y }}
        transition={{ duration: 0 }}
        hovered={markerPosition.key !== ""}
      />
      <Grid
        ref={gridRef}
        onMouseMove={updateGuidelinePosition}
        onMouseLeave={hideGuideline}
      >
        {/* HEADING ROW*/}
        {Column.map((colkey) => (
          <Cell
            key={HEADING + colkey}
            cellHeight={cellHeight}
            className={`cell ${HEADING}`}
          >
            {getHeadingComponents(colkey)}
          </Cell>
        ))}

        {/* EXTRA ROW*/}
        {Column.map((colkey) => (
          <Cell
            key={EXTRA + colkey}
            cellHeight={cellHeight}
            className={`cell ${EXTRA}`}
          />
        ))}

        {/* DYNAMIC CELLS */}
        {Row.slice(appliedEdge.min, appliedEdge.max + 1).map((rowkey, i) =>
          Column.map((columnkey, j) => (
            <Cell
              key={rowkey + columnkey}
              cellHeight={cellHeight}
              className={`cell ${rowkey}`}
            >
              <DimensionWrapper>
                {columnkey === TIME
                  ? getTimeLabelComponents(rowkey, i)
                  : renderEventItem(rowkey, columnkey)}
                {getHourMarkerComponents(rowkey, columnkey)}
                {/* {i === 0 && j === 0 && markerPosition.key} */}
              </DimensionWrapper>
            </Cell>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default OneWeekCalendar;
