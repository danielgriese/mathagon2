import { z } from "zod";

export const GetGameRequestSchema = z.object({
  gameId: z.string().optional(),

  // filter for lists
  userId: z.string().optional(),
});
