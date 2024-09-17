import { GameStateLocal } from "@/game/types";
import React from "react";
import { Field } from "./Field";

export type BoardProps = {
  board: GameStateLocal["board"];

  onDropCoin: (column: number, row: number, coinId: number) => void;
};

export const Board: React.FC<BoardProps> = (props) => {
  const { board } = props;

  return (
    <div className="flex items-center">
      {board.map((col, idx) => (
        <div key={idx} className="flex flex-col">
          {col.map((cell, idx2) => (
            <Field
              key={`${idx}-${idx2}`}
              colIdx={idx}
              rowIdx={idx2}
              type={cell}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
