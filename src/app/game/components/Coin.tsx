import React from "react";
import { useDraggable } from "@dnd-kit/core";
import Hexagon from "./Hexagon";
import { cn } from "@/lib/utils";

export type CoinProps = {
  coin: { id: number; value: number };
  hasTurn: boolean;

  className?: string;
};

export const Coin: React.FC<CoinProps> = (props) => {
  const { coin } = props;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: coin.id,
      disabled: !props.hasTurn,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="touch-none w-1/5"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Hexagon
        className={cn(
          props.className,
          "fill-slate-400 text-white stroke-none max-h-16  mx-auto",
          isDragging ? "opacity-60" : "opacity-100"
        )}
      >
        <text
          className="pointer-events-none leading-none font-bold"
          fontSize="24px"
          x="51%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
          textRendering={"optimizeLegibility"}
          fill="currentColor"
          stroke="none"
        >
          {coin.value}
        </text>
      </Hexagon>
    </div>
  );
};
