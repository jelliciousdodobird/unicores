// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { DateTime } from "luxon";
import { useRef, useState } from "react";

import { formatTime, TimeFormat } from "../utils/date-time";
import { OWCEvent, INITIAL_MARKER, MarkerInfo } from "./OneWeekCalendar";

const Container = styled.div`
  position: absolute;
  left: 0;
  z-index: 99;

  padding: 0 5px;

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    padding: 0 2px;
  }

  width: 100%;
  ${({ span, startOffset }: { span: number; startOffset: number }) =>
    css`
      height: ${span + 1}px;
      top: ${startOffset - 1}px;
    `};

  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  overflow: hidden;
  z-index: 200;

  position: relative;
  padding: 0.5rem;
  /* border: 1px solid red; */
  height: 100%;

  background-color: ${({ theme }) => theme.colors.primary.lighter};
  border-left: 5px solid ${({ theme }) => theme.colors.primary.main};

  /* border-radius: 5px; */
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  &:hover {
    border-left: 5px solid ${({ theme }) => theme.colors.error.main};
  }
`;

const H3 = styled.p`
  color: ${({ theme }) => theme.colors.surface.main};
  font-weight: 600;
`;
const P = styled.p`
  color: ${({ theme }) => theme.colors.surface.main};
  /* font-weight: 600; */
`;

// ///////////////////////////////////////////////
// position: absolute;
// top: ${({ y }: { y: number }) => y}px;
/* background-color: ${(props. theme.colors.error.main}; */
const lineStyles = (props: any) => css`
  position: absolute;
  right: 5px;
  z-index: 100;
  height: 0;
  width: 5000px;
  opacity: 0.25;
  border-bottom: 1px dashed ${props.theme.colors.error.main};
`;

const TopLine = styled.div`
  ${lineStyles}
  top: 0;
`;

const BottomLine = styled.div`
  ${lineStyles}
  bottom: 0;
`;

export interface OWCEventItemProps {
  cellHeight?: number;
  startOffset: number;
  span: number;
  event: OWCEvent;
  timeFormat?: TimeFormat;
  lineGuides?: boolean;

  // setTimes: React.Dispatch<React.SetStateAction<Dots>>;
  setTimes: React.Dispatch<React.SetStateAction<MarkerInfo>>;
}

const OWCEventItem = ({
  cellHeight,
  startOffset,
  span,
  event,
  timeFormat = "24H",
  setTimes,
  lineGuides = false,
}: OWCEventItemProps) => {
  const [showTimes, setShowTimes] = useState(false);

  const formatTimeFunction =
    timeFormat === "24H"
      ? (time: DateTime) => formatTime(time, "24H")
      : (time: DateTime) => formatTime(time, "12H");

  const turnOnGuidelines = () => setShowTimes(true);
  const turnOffGuidelines = () => setShowTimes(false);

  return (
    <Container
      startOffset={startOffset}
      span={span}
      onMouseEnter={() => {
        turnOnGuidelines();
        setTimes({
          key: `${event.startTime.hour}:00`,
          startOffset,
          span,
        });
      }}
      onMouseLeave={() => {
        turnOffGuidelines();
        setTimes(INITIAL_MARKER);
      }}
    >
      {lineGuides && showTimes && <TopLine />}
      <Content>
        <H3>{`${event.courseCode} - ${event.section}`}</H3>
        <P>{`${formatTimeFunction(event.startTime)} - ${formatTimeFunction(
          event.endTime
        )}`}</P>{" "}
      </Content>
      {lineGuides && showTimes && <BottomLine />}
    </Container>
  );
};

export default OWCEventItem;
