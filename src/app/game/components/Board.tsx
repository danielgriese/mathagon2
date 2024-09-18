import { GameStateLocal } from "@/game/types";
import React from "react";
import { Field } from "./Field";
import { HEXAGON_HEIGHT, HEXAGON_WIDTH } from "./Hexagon";

export type BoardProps = {
  board: GameStateLocal["board"];

  onDropCoin: (column: number, row: number, coinId: number) => void;
};

export const Board: React.FC<BoardProps> = (props) => {
  const { board } = props;

  return (
    <div className="max-w-full max-h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${7 * HEXAGON_WIDTH} ${9 * HEXAGON_HEIGHT}`}
        className="max-w-full max-h-full"
      >
        {board.map(
          (col, colIndex) =>
            col.map((field, rowIndex) => {
              return (
                <Field
                  key={`${colIndex}_${rowIndex}`}
                  type={field}
                  colIdx={colIndex}
                  rowIdx={rowIndex}
                  // this comes from state/store pre-calculated
                  // isDropTarget={props.dropTargets[colIndex][rowIndex]}
                />
              );
            })
          // <React.Fragment key={colIndex}>

          // </div>
        )}
      </svg>

      {/* {board.map((col, idx) => (
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
      ))} */}
    </div>
  );
};
