import { z } from "zod";

export const GetGameRequestSchema = z.object({
  gameId: z.string().optional(),

  // filter for lists
  userId: z.string().optional(),
});

export const CreateGameSchema = z.object({
  // optionally challenge specific other players
  challengeeIds: z.array(z.string()).optional(),

  // TODO other fields
});
