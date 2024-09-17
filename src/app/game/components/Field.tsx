import { FieldType } from "@/game/types";
import React from "react";

import { useDroppable } from "@dnd-kit/core";

export type FieldProps = {
  rowIdx: number;
  colIdx: number;

  type: FieldType;
};

export const Field: React.FC<FieldProps> = (props) => {
  const { rowIdx, colIdx, type } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: `${rowIdx}-${colIdx}`,
    data: { rowIdx, colIdx },
  });

  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-8 h-8 grid place-items-center border border-black"
      // draggable={true} // TODO check fror drop targets
      // onDragOver={(e) => {
      //   // TODO check fror drop targets
      //   e.preventDefault();
      // }}
      // onDrop={(e) => {
      //   props.onDropCoin(
      //     idx,
      //     idx2,
      //     parseInt(e.dataTransfer.getData("coinId"))
      //   );
      // }}
    >
      {type}
    </div>
  );
};
