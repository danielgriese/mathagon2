import { GameStateLocal } from "@/game/types";
import React from "react";

export type BoardProps = {
  board: GameStateLocal["board"];
};

export const Board: React.FC<BoardProps> = (props) => {
  const { board } = props;
  return (
    <div className="flex items-center">
      {board.map((col, idx) => (
        <div key={idx} className="flex flex-col">
          {col.map((cell, idx2) => (
            <div
              key={idx2}
              className="w-8 h-8 grid place-items-center border border-black"
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
