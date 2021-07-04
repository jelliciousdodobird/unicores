/****************************************************************
 * DEPRECATED DEPRECATED DEPRACATED DEPRACATED DEPRACATED
 * maybe be able to use this for grid lists tho
 ****************************************************************/
import { useState, useRef } from "react";
import ScheduleItem, { Position } from "../components/DraggableItem";
import { moveItem } from "../utils/array-helper";

const useReorderableList = (initialState: any[]) => {
  const [listState, setListState] = useState(initialState);
  const trueDragIndex = useRef(-1);
  const [positions, setPositions] = useState<Position[]>([]);
  // const positions = useRef<Position[]>([]).current;

  const isIntersected = (index: number, center: number) => {
    const item = positions[index];
    const topBound = item.top;
    const bottomBound = item.height + item.top;
    return center >= topBound && center <= bottomBound;
  };

  const updateListOrder = (i: number, targetIndex: number) =>
    setListState((list) => moveItem(list, i, targetIndex));

  const resetTrueDragIndex = () => (trueDragIndex.current = -1);

  const updatePositions = (i: number, offset: Position) =>
    setPositions((posList) => [
      ...posList.slice(0, i),
      offset,
      ...posList.slice(i + 1, posList.length),
    ]);
  // const updatePositions = (i: number, offset: Position) =>
  //   (positions[i] = offset);

  const updateOrder = (i: number, dragOffset: number) => {
    // console.log("cp", positions[i].height);

    const center = positions[i].top + positions[i].height / 2 + dragOffset;

    const prevIndex = Math.max(i - 1, 0);
    const nextIndex = Math.min(i + 1, positions.length - 1);

    let checkedIndex = i;
    if (dragOffset < 0) checkedIndex = prevIndex;
    else if (dragOffset > 0) checkedIndex = nextIndex;
    const targetIndex = isIntersected(checkedIndex, center) ? checkedIndex : i;

    const targetIndexHasChanged = i !== targetIndex;
    const noRapidReverseSwapDetected =
      trueDragIndex.current === -1 || i === trueDragIndex.current;

    // if the two conditions below fail
    // then any targetIndex that is generated can be disregarded
    // and the list should NOT update
    if (targetIndexHasChanged && noRapidReverseSwapDetected) {
      // the true dragging index is the one that is set here
      trueDragIndex.current = targetIndex;
      updateListOrder(i, targetIndex);
    }
  };

  // there is some potential to define the Item component here in this hook
  // so that we do not have to manually pass updatePositions, updateOrder, and resetTrueDragIndex
  // where the hook is used
  const Item = ScheduleItem;

  return {
    listState,
    setListState,
    positions,
    updatePositions,
    updateOrder,
    resetTrueDragIndex,
    Item,
  };
};

export default useReorderableList;
