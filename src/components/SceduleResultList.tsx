// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useRef } from "react";

// custom hooks:
import useReorderableList from "../hooks/useReorderableList";
import { shuffle } from "../utils/array-helper";

// custom components
import DraggableItem from "./DraggableItem";

const ScheduleListContainer = styled.div`
  margin: 1rem;
  /* border: 1px solid ${({ theme }) => theme.colors.onBackground.main}; */
`;

const Item = styled(DraggableItem)`
  /* border: 1px solid black; */
  margin-bottom: 1rem;
  /* opacity: 0.5; */
`;

const ColorContainer = styled.div`
  background-color: ${({ c }: { c: string }) => c};
  border-radius: 5px;
  padding: 1rem;

  color: ${({ theme }) => theme.colors.surface.main};
  font-weight: bold;

  div {
    margin-top: 0.5rem;
    color: inherit;
  }
`;

const INITIAL_STATE = [
  {
    color: "#F4ABC4",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus commodo venenatis sem, ut fermentum turpis. Donec dolor augue, consequat eget mi a, facilisis aliquet risus. Suspendisse lobortis a est quis mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur ac imperdiet justo. Mauris ac risus eu turpis dapibus luctus. Praesent imperdiet finibus eleifend.",
  },
  {
    color: "#595B83",
    text: "Sed sodales turpis et massa tincidunt mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean finibus diam eu aliquam fringilla. Maecenas vel ante arcu. In et ipsum scelerisque, mollis urna eget, sollicitudin augue. Ut pretium venenatis molestie. Aliquam suscipit metus sed lacus auctor finibus. Proin eget nisi euismod, imperdiet dolor in, aliquam lorem. Nullam ut purus quis eros venenatis rutrum. Donec vitae varius tellus. Morbi interdum aliquet sem, a auctor eros molestie quis. Aliquam at hendrerit lectus, vitae dapibus augue. Etiam suscipit viverra posuere.",
  },
  {
    color: "#167D7F",
    text: "Morbi purus augue, porta ac dapibus vitae, porta quis mauris. Integer porttitor vitae eros vitae pharetra. In eu ante nec nisl auctor dictum. Morbi cursus enim eu fermentum ullamcorper. Vestibulum elementum elit sed tellus tempor cursus. Suspendisse ut justo sed purus mattis auctor at quis enim. Cras tempor ligula at erat iaculis tempus. Morbi felis mauris, varius eu mattis id, vehicula at felis. Curabitur eu sapien dolor.",
  },
  {
    color: "#060930",
    text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam cursus risus eget massa finibus convallis. Vestibulum id sollicitudin dolor, a volutpat tortor. Suspendisse consectetur neque at lorem sagittis, et semper leo scelerisque. Phasellus ac blandit mauris. Donec a erat eu sem luctus imperdiet.",
  },
  {
    color: "#321F28",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum venenatis accumsan. Maecenas venenatis dictum convallis. ",
  },
  {
    color: "#734046",
    text: "Donec a erat eu sem luctus imperdiet. Proin in elementum enim, sit amet imperdiet lacus. Cras accumsan, elit at vehicula elementum, tortor sapien feugiat tellus, ac dignissim quam ex quis felis. Ut augue sem, finibus non massa dignissim, finibus tincidunt erat. Sed tempus est lacus, finibus lacinia lacus bibendum a. Suspendisse potenti. Pellentesque blandit tellus nec placerat finibus. Proin et mollis ligula.",
  },
  {
    color: "#A05344",
    text: "Morbi purus augue, porta ac dapibus vitae, porta quis mauris. ",
  },
  {
    color: "#E79E4F",
    text: "Vivamus commodo venenatis sem, ut fermentum turpis. Donec dolor augue, consequat eget mi a, facilisis aliquet risus. Suspendisse lobortis a est quis mollis.",
  },
];

const ScheduleResultList = () => {
  const {
    listState,
    setListState,
    updatePositions,
    updateOrder,
    resetTrueDragIndex,
    // Item,
  } = useReorderableList(INITIAL_STATE);

  const shuffleList = () => setListState((list) => shuffle(list));

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <button type="button" onClick={shuffleList}>
        shuffle
      </button>
      <ScheduleListContainer ref={containerRef}>
        {listState.map((item, i) => (
          <Item
            key={item.color}
            positionIndex={i}
            updatePositions={updatePositions}
            updateOrder={updateOrder}
            resetTrueDragIndex={resetTrueDragIndex}
            dragConstraints={containerRef}
            // showCenterLine
          >
            <ColorContainer c={item.color}>
              {item.color}
              <div>{item.text}</div>
            </ColorContainer>
          </Item>
        ))}
      </ScheduleListContainer>
    </>
  );
};

export default ScheduleResultList;
