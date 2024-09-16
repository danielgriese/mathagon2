import connectDB from "@/db/connectDB";
import { GameModel } from "@/db/models/GameModel";
import { getRequester } from "@/utils/getRequester";
import { reqToParams } from "@/utils/reqToParams";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateGameSchema, GetGameRequestSchema } from "./schema";

// TODO: pick fields
export type GetGameResponse = { game: GameModel | null };
export type ListGamesResponse = { games: Omit<GameModel, "events">[] };

export const GET = async (req: NextRequest) => {
  const { gameId, userId } = GetGameRequestSchema.parse(reqToParams(req));

  const db = await connectDB();

  // if we have an id, this is a lookup request
  if (gameId) {
    const game = await db.Game.findOne({
      _id: gameId,
    });

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

export const POST = async (req: NextRequest) => {
  const { challengeeIds } = CreateGameSchema.parse(reqToParams(req));

  const { userId } = await getRequester();

  const db = await connectDB();

  // TODO: this is a poor mans way of making match making
  // in the future we should have a queue and match making logic, especially on ELO rating
  const challenge = !challengeeIds?.length
    ? await db.Game.findOne(
        {
          status: "pending",
          "players._id": { $ne: userId },
        },
        { projection: { _id: 1 } }
      )
    : null;

  if (challenge) {
    // TODO actual joining and game start logic
    // add player to game
    await db.Game.updateOne(
      {
        _id: challenge._id,
      },
      {
        $set: { status: "running" }, // TODO only if all players are accepted
        $push: {
          players: {
            _id: userId,
            username: userId, // TODO: lookup username
            status: "accepted",
          },
        },
      }
    );

    return NextResponse.json({
      gameId: challenge._id,
    } satisfies CreateGameResponse);
  } else {
    const res = await db.Game.insertOne({
      _id: new ObjectId().toHexString(),

      status: "pending",

      players: [
        // add own player as accepted
        { _id: userId, username: userId, status: "accepted" }, // TODO: lookup username

        // add challengees as pending
        ...(challengeeIds?.map((id) => ({
          _id: id,
          username: id, // TODO: lookup username
          status: "pending" as const,
        })) ?? []),
      ],

      createdAt: new Date(),

      // empty events? need to add the first (like joiners?)
      events: [],
    });

    return NextResponse.json({
      gameId: res.insertedId,
    } satisfies CreateGameResponse);
  }
};

export const dynamic = process.env.APP_BUILD ? "force-static" : "auto";
