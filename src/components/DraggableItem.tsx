/****************************************************************
 * DEPRECATED DEPRECATED DEPRACATED DEPRACATED DEPRACATED
 * maybe be able to use this for grid lists tho
 ****************************************************************/

// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { motion } from "framer-motion";
import { ReactElement, useEffect } from "react";
import { useState, useRef } from "react";
import useResizeObserver from "use-resize-observer";

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
  background-color: red;
`;

const CollapseContainer = styled(motion.div)`
  border: 1px solid blue;
  overflow: hidden;
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
  totalListHeight: number;
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
  totalListHeight,
}: ItemProps) => {
  // const [height, setHeight] = useState(0);
  // const [siblingsTotalHeight, setSiblingsTotalHeight] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [collapse, setCollapse] = useState(false);
  // const [prevIndex, setPrevIndex] = useState(-1);
  const ref = useRef<HTMLLIElement>(null);
  const { height } = useResizeObserver({ ref });

  // useEffect(() => {
  //   // console.log("positions", ref.current?.offsetHeight);

  //   updatePositions(positionIndex, {
  //     height: ref.current?.offsetHeight || 0,
  //     top: ref.current?.offsetTop || 0,
  //   });
  // });

  // useEffect(() => {
  //   console.log("test2");
  //   setPrevIndex()
  // });

  useEffect(() => {
    console.log("test");
    // if (prevIndex !== positionIndex) {
    updatePositions(positionIndex, {
      height: ref.current?.offsetHeight || 0,
      top: ref.current?.offsetTop || 0,
    });
    // }
  }, [positionIndex]);

  useEffect(() => {
    console.log("height", height);
    // if (prevIndex !== positionIndex) {
    updatePositions(positionIndex, {
      height: height || 0,
      top: ref.current?.offsetTop || 0,
    });
    // }
  }, [height]);

  useEffect(() => {
    console.log("total height, must update all positions");
    // if (prevIndex !== positionIndex) {
    updatePositions(positionIndex, {
      height: ref.current?.offsetHeight || 0,
      top: ref.current?.offsetTop || 0,
    });
    // }
  }, [totalListHeight]);

  // useEffect(() => {
  //   console.log(`positions[${positionIndex}] changed`, width, height);
  // }, [width, height]);

  const animationProps = {
    variants: {
      open: { height: "auto" },
      close: { height: 35 },
    },
    initial: "open",
    animate: collapse ? "close" : "open",
  };

  return (
    <Container
      ref={ref}
      layout="position"
      drag="y"
      dragElastic={0.5}
      dragMomentum={false}
      // {...animationProps}
      animate={
        isDragging
          ? { zIndex: 1, scale: 1 }
          : { zIndex: 0, transition: { delay: 0.25 }, scale: 1 }
      }
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false);
        resetTrueDragIndex();
      }}
      onViewportBoxUpdate={(_viewportBox, delta) => {
        // console.log("hey", _viewportBox, delta);
        if (isDragging) updateOrder(positionIndex, delta.y.translate);
      }}
      className={className}
      dragConstraints={dragConstraints}
      transformTemplate={(transform, generatedTransform) => {
        const regExp = /\bscale\(([^)]+)\)/;
        const matches = regExp.exec(generatedTransform);
        // console.log("matches", matches);

        const i = generatedTransform.indexOf("scale");
        // console.log(positionIndex, transform);
        // console.log(generatedTransform);

        // return generatedTransform.slice(0, i) + "scale(1, 1)";
        if (matches) {
          if (matches[0] !== "scale(1, 1)") {
            return "translate3d(0px, 0px, 0px) scale(1, 1)";
          } else return generatedTransform;
        }
        return i !== -1
          ? generatedTransform.slice(0, i) + "scale(1, 1)"
          : generatedTransform;
      }}
    >
      {/* <CollapseButton onClick={() => setCollapse((v) => !v)}>
        {JSON.stringify(collapse, null, 2)}
      </CollapseButton> */}
      {/* <CollapseContainer {...animationProps}> */}
      {showCenterLine && <CenterLine />}
      {/* {!collapse && children} */}
      {children}
      {/* </CollapseContainer> */}
    </Container>
  );
};

export default DraggableItem;
