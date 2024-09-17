import { GameEvent } from "@/game/commands";

export type GameModel = {
  _id: string;

  // the game status (need for "rejected" | "canceled"?)
  status: "pending" | "running" | "completed";

  players: {
    _id: string;
    username: string; // copied from user, so no need to join
    status: "pending" | "accepted" | "rejected" | "canceled" | "collected"; // collected on an ended game
    // TODO other important fields like elo?
  }[];

  createdAt: Date;

  // events of game
  events: GameEvent[];
  // TODO all else
};
