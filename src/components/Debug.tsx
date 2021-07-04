import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import { createPortal } from "react-dom";
import { useState } from "react";

const Container = styled(motion.div)`
  ${({ drag }: { drag: boolean }) =>
    drag
      ? css`
          overflow: auto;
          cursor: grab;
          position: fixed;
          top: 0;
          left: 0;

          z-index: 99999;

          /* padding: 15px; */

          background-color: black;
          max-height: 90%;
        `
      : null}

  button {
    /* position: absolute; */
    /* top: 0; */
    /* left: 0; */
    /* padding: 10px; */

    background-color: white;
    color: black;

    /* border-radius: 50%; */

    height: 25px;
    min-height: 25px;
    max-height: 25px;
    width: 25px;
    min-width: 25px;
    max-width: 25px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Pre = styled(motion.pre)`
  position: relative;
  font-size: 0.8rem;
  padding: 25px;
  color: white;
`;

export interface DebugProps {
  data: any;
  drag?: boolean;
}

const Debug = ({ data, drag = false }: DebugProps) => {
  const [minimize, setMinimize] = useState(false);

  const animProps = {
    variants: {
      open: {
        width: "auto",
        height: "auto",
      },
      close: { width: 25, height: 25, overflow: "hidden" },
    },
    initial: "open",
    animate: minimize ? "close" : "open",
    transition: { duration: 0.1 },
  };

  const element = (
    <Container drag={drag} dragMomentum={false} {...animProps}>
      {drag && <button onClick={() => setMinimize((v) => !v)}>-</button>}
      <Pre>{JSON.stringify(data, null, 2)}</Pre>
    </Container>
  );

  return drag
    ? createPortal(element, document.getElementById("root") as Element)
    : element;
};

export default Debug;
