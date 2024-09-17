import React from "react";
import { useDraggable } from "@dnd-kit/core";

export type CoinProps = {
  coin: { id: number; value: number };
  hasTurn: boolean;
};

export const Coin: React.FC<CoinProps> = (props) => {
  const { coin, hasTurn } = props;

  console.log("Coin", coin, hasTurn);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: coin.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  //   const [{}, drag] = useDrag(
  //     () => ({
  //       type: "coin",
  //       item: { coin: props.coin },
  //       collect: (monitor) => ({
  //         isDragging: !!monitor.isDragging(),
  //       }),
  //       canDrag: hasTurn,

  //       Coin,
  //     }),
  //     []
  //   );

  return (
    <div
      className="w-8 h-8 grid place-items-center border border-black touch-none"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {coin.value}
    </div>
  );
};
