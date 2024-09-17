import { z } from "zod";

export const BaseCommandSchema = z.object({
  // type to be refined
  type: z.string(),

  // game the command is executed on
  gameId: z.string(),

  // the player exeucting the command
  playerId: z.string(),

  // payload extended by specific command
});

export interface BaseEvent {
  type: unknown;
  _id: string;
}
