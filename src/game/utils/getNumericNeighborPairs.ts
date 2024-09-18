import { FieldType } from "../types";

export type NeighborTuple = [FieldType, FieldType];
export type NumericNeighborTuple = [number, number];

export function getNumericNeighborPairs(
  board: FieldType[][],
  column: number,
  row: number
  // TODO based on game mode?
): NumericNeighborTuple[] {
  const neighbors = [
    board[column]?.[row - 1], // up
    board[column]?.[row + 1], // down

    board[column + 1]?.[column < 4 ? row : row - 1], // up right
    board[column + 1]?.[column < 4 ? row + 1 : row], // down right

    board[column - 1]?.[column <= 4 ? row : row + 1], // down left
    board[column - 1]?.[column <= 4 ? row - 1 : row], // up left
  ];

  // combine every field with every other
  const neighborPairs: NeighborTuple[] = [];

  for (let index = 0; index < neighbors.length; index++) {
    const first = neighbors[index];

    for (let index2 = index + 1; index2 < neighbors.length; index2++) {
      const second = neighbors[index2];
      neighborPairs.push([first, second]);
    }
  }

  // no we only keep the ones, where both fields are numbers
  return neighborPairs.filter(
    (pair) => typeof pair[0] === "number" && typeof pair[1] === "number"
  ) as NumericNeighborTuple[];
}
