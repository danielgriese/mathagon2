import { FieldPosition, FieldType } from "../types";

export function getNeighborFieldPositions(
  column: number,
  row: number
): FieldPosition[] {
  return [
    [column, row - 1], // up
    [column, row + 1], // down

    [column + 1, column < 4 ? row : row - 1], // up right
    [column + 1, column < 4 ? row + 1 : row], // down right

    [column - 1, column <= 4 ? row : row + 1], // down left
    [column - 1, column <= 4 ? row - 1 : row], // up left
  ];
}

export function getAvailableNeighborFieldPositions(
  board: FieldType[][],
  column: number,
  row: number
): FieldPosition[] {
  return getNeighborFieldPositions(column, row).filter(([column, row]) => {
    const field = board[column]?.[row];
    if (field === undefined || typeof field === "number") {
      // not a potential drop target neighbor
      return false;
    } else {
      return true;
    }
  });
}
