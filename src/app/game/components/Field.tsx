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

  return (
    <div
      ref={setNodeRef}
      className={`w-8 h-8 grid place-items-center border ${
        isOver ? "border-green-500 border-2" : "border-black"
      }`}
    >
      {type}
    </div>
  );
};
