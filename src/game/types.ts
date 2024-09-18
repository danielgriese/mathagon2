export type GameState = {
  id: string;

  // current board layout
  board: FieldType[][];

  // the current available coins
  coins: { id: number; value: number }[];

  // the active players
  players: PlayerState[];
};

// app state extended with local fields
export type GameStateLocal = GameState & {
  gameEnded: boolean;

  // dropTargets: boolean[][];
  // TODO others, like marking which fields are new
};

export type PlayerState = {
  _id: string;
  username: string;

  score: number;
  multiplier: number;
  coins: { id: number; value: number }[];
  hasTurn: boolean;

  // for end game conditions
  hasMadeMove: boolean;
  nonMovedPasses: number;
  didFold: boolean;
};

export type FieldType = "2x" | "3x" | "+" | "-" | number | null; // others might come, like jokers

export type FieldPosition = [number, number];
