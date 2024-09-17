import connectDB from "@/db/connectDB";
import { GameModel } from "@/db/models/GameModel";
import { getRequester } from "@/utils/getRequester";
import { reqToParams } from "@/utils/reqToParams";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateGameSchema, GetGameRequestSchema } from "./schema";
import { createGame } from "@/services/createGame";
import { createContext } from "@/utils/createContext";
import { CommandsSchema } from "@/game/commands";
import { processCommand } from "@/game/processCommand";

// TODO: pick fields
export type GetGameResponse = { game: Omit<GameModel, "events"> | null };
export type ListGamesResponse = { games: Omit<GameModel, "events">[] };

export const GET = async (req: NextRequest) => {
  const { gameId, userId } = GetGameRequestSchema.parse(reqToParams(req));

  const db = await connectDB();

  // if we have an id, this is a lookup request
  if (gameId) {
    const game = await db.Game.findOne(
      {
        _id: gameId,
      },
      { projection: { events: 0 } }
    );

    const response: GetGameResponse = { game };
    return NextResponse.json(response);
  }

  if (userId) {
    // this will be a list request
    // TODO check user against token
    const games = await db.Game.find(
      {
        // game where the current user is a player
        "players._id": userId,
        status: { $ne: "completed" }, // TODO think how to do "collected" logic and how to keep games for later reference (archived?)
      },
      { projection: { events: 0 } }
    ).toArray();

    const response: ListGamesResponse = {
      games,
    };

    return NextResponse.json(response);
  }

  return NextResponse.json({});
};

// TODO pick reduced set of fields
export type CreateGameRequest = z.infer<typeof CreateGameSchema>;
export type CreateGameResponse = { gameId: string };

// post is used to create a new game
export const POST = async (req: NextRequest) => {
  const { userId } = await getRequester();
  const context = createContext(userId);

  const payload = CreateGameSchema.parse(await req.json());

  const { gameId } = await createGame(payload, context);

  return NextResponse.json({ gameId });
};

export type PutCommandResponse = Awaited<ReturnType<typeof processCommand>>;

// put is used to process a command from the user
export const PUT = async (req: NextRequest) => {
  const { userId } = await getRequester();
  const context = createContext(userId);

  const payload = CommandsSchema.parse(await req.json());

  const response = await processCommand(payload, context);

  // return the events that were added during that process
  return NextResponse.json(
    response.ok
      ? { ok: response.ok, events: response.events }
      : { ok: response.ok, error: response.error }
  );
};

export const dynamic = process.env.APP_BUILD ? "force-static" : "auto";
