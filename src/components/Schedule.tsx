// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

// icons:
import {
  TiHeart,
  TiArrowSortedUp,
  TiLocation,
  TiZoomIn,
  TiZoomOut,
  TiUser,
} from "react-icons/ti";

// custom components:
import IconButton from "./IconButton";
import OneWeekCalendar from "./OneWeekCalendar";

const borderRadius = 15;

const ItemContainer = styled.div`
  position: relative;

  z-index: 0; // this is purely to solve the "border-radius and overflow hidden problem in safari"

  margin-bottom: 1rem;
  border-radius: ${borderRadius}px;

  overflow: hidden;
`;

const Header = styled.div`
  position: relative;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.surface.main};
  /* background-color: ${({ theme }) => theme.colors.background.light}; */

  width: 100%;
  height: 3rem;

  padding: 0 0.75rem;

  display: flex;
  align-items: center;
`;

const Label = styled.h2`
  font-weight: 600;

  height: 100%;

  display: flex;
  align-items: center;

  margin-left: 0.5rem;
`;

const MenuOptions = styled.span`
  /* background-color: red; */
  flex: 1;
  height: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Content = styled.div`
  padding-bottom: 1rem;

  color: ${({ theme }) => theme.colors.surface.main};
  background-color: ${({ theme }) => theme.colors.surface.main};
`;

const ResizeContainer = styled(motion.div)``;

const CollapseButton = styled(IconButton)`
  /* background-color: red; */
`;
const HeartSaveButton = styled(IconButton)`
  /* background-color: red; */
`;
const MapButton = styled(IconButton)``;

type ScheduleProps = {
  index: number;
  id: string;
  data: any;
  className?: string | undefined;
  cellHeight?: number;
};

const yAxisLockStyles = (
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => {
  if (!draggableStyle) return;

  const { transform } = draggableStyle;
  let activeTransform = {};
  if (transform) {
    activeTransform = {
      transform: `translate(0, ${transform.substring(
        transform.indexOf(",") + 1,
        transform.indexOf(")")
      )})`,
    };
  }
  return {
    ...draggableStyle,
    ...activeTransform,
  };
};

const Schedule = ({ id, data, index, cellHeight = 3 * 14 }: ScheduleProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expand, setExpand] = useState(true);
  const [minMode, setMinMode] = useState(true);
  const [saved, setSaved] = useState(true);
  const { height } = useResizeObserver({ ref: contentRef });

  const animationProps = {
    variants: {
      open: {
        height,
      },
      close: { height: 0 },
    },
    initial: "close",
    animate: expand ? "open" : "close",
  };

  const iconAnimationProps = {
    variants: {
      open: { rotate: 0 },
      close: { rotate: 180 },
    },
    initial: "close",
    animate: expand ? "open" : "close",
  };

  // const heartIconAnimProps = {
  //   variants: {
  //     saved: { backgroundColor: },
  //     unsaved: { rotate: 180 },
  //   },
  //   initial: "unsaved",
  //   animate: saved ? "open" : "close",
  // };

  const toggleExpand = () => setExpand((v) => !v);
  const toggleMinMode = () => setMinMode((v) => !v);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <ItemContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={yAxisLockStyles(provided.draggableProps.style)}
        >
          <Header {...provided.dragHandleProps}>
            <CollapseButton
              onClick={toggleExpand}
              icon={TiArrowSortedUp}
              iconAnimationProps={iconAnimationProps}
            />
            <Label>Schedule #{id}</Label>
            <MenuOptions>
              <MapButton
                icon={minMode ? TiZoomIn : TiZoomOut}
                onClick={toggleMinMode}
              />
              <HeartSaveButton icon={TiUser} />
              <MapButton icon={TiLocation} />
              <MapButton icon={TiHeart} />
            </MenuOptions>
          </Header>

          <ResizeContainer {...animationProps}>
            <Content ref={contentRef}>
              <OneWeekCalendar
                data={data}
                minMode={minMode}
                cellHeight={cellHeight}
              />
            </Content>
          </ResizeContainer>
        </ItemContainer>
      )}
    </Draggable>
  );
};

export default Schedule;
