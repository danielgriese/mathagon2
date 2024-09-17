import { after } from "node:test";
import { z } from "zod";

export const GetGameRequestSchema = z.object({
  gameId: z.string().optional(),

  // filter for lists
  userId: z.string().optional(),
});

export const GetEventsRequestSchema = z.object({
  gameId: z.string(),
  userId: z.string(),
  after: z.string().optional(), // id for after paging
});

export const CreateGameSchema = z.object({
  // optionally challenge specific other players
  challengeeIds: z.array(z.string()).optional(),

  // TODO other fields
});
