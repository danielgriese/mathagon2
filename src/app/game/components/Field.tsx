import { FieldType } from "@/game/types";
import React from "react";

import { useDroppable } from "@dnd-kit/core";
import Hexagon, { HEXAGON_HEIGHT, HEXAGON_WIDTH } from "./Hexagon";
import clsx from "clsx";

export type FieldProps = {
  rowIdx: number;
  colIdx: number;

  type: FieldType;
  isDropTarget: boolean;
};

export const Field: React.FC<FieldProps> = (props) => {
  const { rowIdx, colIdx } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: `${rowIdx}-${colIdx}`,
    data: { rowIdx, colIdx },
  });

  return <DropField {...props} isOver={isOver} setNodeRef={setNodeRef} />;
};

export const DropField: React.FC<
  FieldProps & {
    isOver: boolean;
    setNodeRef: (element: HTMLElement | null) => void;
  }
> = React.memo(function DropField(props) {
  const { rowIdx, colIdx, type, isDropTarget, isOver, setNodeRef } = props;

  return (
    <Hexagon
      // @ts-expect-error HTML vs SVG element
      ref={setNodeRef}
      x={HEXAGON_WIDTH * 0.75 * colIdx}
      y={HEXAGON_HEIGHT * rowIdx + (Math.abs(colIdx - 4) * HEXAGON_HEIGHT) / 2}
      data-position={`${colIdx}_${rowIdx}`}
      width={HEXAGON_WIDTH}
      height={HEXAGON_HEIGHT}
      className={clsx(
        "pointer-events-auto transition-colors duration-[2000ms] ease-out stroke-none",
        isOver
          ? isDropTarget
            ? "fill-green-600"
            : "fill-red-600"
          : type !== null || isDropTarget
          ? "fill-slate-300"
          : "fill-slate-100"
      )}
    >
      {typeof type === "number" && (
        <text
          className="pointer-events-none font-semibold"
          fontSize="24px"
          x="51%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
          textRendering={"optimizeLegibility"}
          fill="currentColor"
          stroke="none"
        >
          {type}
        </text>
      )}
    </Hexagon>
  );
});
