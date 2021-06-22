// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { motion } from "framer-motion";
import { ReactElement, useEffect } from "react";
import { useState, useRef } from "react";

const Container = styled(motion.li)`
  position: relative;
  overflow: hidden;
`;

const CenterLine = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: red;
`;

const CollapseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export interface Position {
  top: number;
  height: number;
}

type ItemProps = {
  positionIndex: number;
  updatePositions: (i: number, offset: Position) => void;
  updateOrder: (i: number, dragOffset: number) => void;
  resetTrueDragIndex: () => void;
  children: ReactElement;
  showCenterLine?: boolean;
  className?: string | undefined;
  dragConstraints?: React.RefObject<Element>;
};

const DraggableItem = ({
  positionIndex,
  updatePositions,
  updateOrder,
  resetTrueDragIndex,
  showCenterLine = false,
  children,
  className,
  dragConstraints,
}: ItemProps) => {
  // const [height, setHeight] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (ref.current) {
      updatePositions(positionIndex, {
        height: ref.current.offsetHeight,
        top: ref.current.offsetTop,
      });
    }
  });

  const animationProps = {
    variants: {
      open: { height: "250px" },
      close: { height: "35px" },
      dragging: { zIndex: 1 },
      notDragging: { zIndex: 0, transition: { delay: 0.25 } },
    },
    initial: "open",
    animate: collapse ? "close" : "open",
  };

  return (
    <Container
      ref={ref}
      layout
      drag="y"
      dragElastic={0.25}
      dragMomentum={false}
      // {...animationProps}
      animate={
        isDragging ? { zIndex: 1 } : { zIndex: 0, transition: { delay: 0.25 } }
      }
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false);
        resetTrueDragIndex();
      }}
      onViewportBoxUpdate={(_viewportBox, delta) => {
        if (isDragging) updateOrder(positionIndex, delta.y.translate);
      }}
      className={className}
      dragConstraints={dragConstraints}
    >
      {showCenterLine && <CenterLine />}
      {children}

      {/* <CollapseButton onClick={() => setCollapse((v) => !v)}>
        {JSON.stringify(collapse, null, 2)}
      </CollapseButton> */}
    </Container>
  );
};

export default DraggableItem;
