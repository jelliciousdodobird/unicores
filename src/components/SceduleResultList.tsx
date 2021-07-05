// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// library:
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

// custom components
import Schedule from "./Schedule";
import { moveItem, shuffle } from "../utils/array-helper";

const ScheduleListContainer = styled.div`
  position: relative;
  margin: 1rem;
`;

type Result = {
  id: string;
  result: any[];
};

export type ScheduleResultListProps = {
  results: Result[];
};

const ScheduleResultList = ({ results }: ScheduleResultListProps) => {
  const [listState, setListState] = useState(results);

  useEffect(() => {
    setListState(results);
  }, [results]);

  const shuffleList = () => setListState((list) => shuffle(list));

  const reorderItems = (result: DropResult) => {
    if (!result.destination) return;

    if (result.destination.index === result.source.index) return;

    const reorderedList = moveItem(
      listState,
      result.source.index,
      result.destination.index
    );

    setListState(reorderedList);
  };

  return (
    <DragDropContext onDragEnd={reorderItems}>
      <Droppable droppableId="list">
        {(provided) => (
          <ScheduleListContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {listState.map((item, i) => (
              <Schedule
                key={item.id}
                index={i}
                id={item.id}
                data={item.result}
              />
            ))}
            {provided.placeholder}
          </ScheduleListContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ScheduleResultList;
