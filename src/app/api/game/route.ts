import connectDB from "@/db/connectDB";
import { GameModel } from "@/db/models/GameModel";
import { getRequester } from "@/utils/getRequester";
import { reqToParams } from "@/utils/reqToParams";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GetGameRequestSchema = z.object({
  gameId: z.string().optional(),

  // filter for lists
  userId: z.string().optional(),
});

// TODO: pick fields
export type GetGameResponse = { game: GameModel | null };
export type ListGamesResponse = { games: GameModel[] };

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
    // this will be a list request (TODO filter based on user)
    // TODO check user against token
    const games = await db.Game.find({
      // TODO based on actual user
      // "pending" | "accepted" | "rejected" | "canceled" | "completed";
      // status: { $ne: "completed" }, // TODO think about challenges logic
      // $or: [{ "challenger._id": userId }, { "challengee._id": userId }],
    }).toArray();

    const response: ListGamesResponse = {
      games,
    };

    return NextResponse.json(response);
  }

  return NextResponse.json({});
};

export const CreateGameSchema = z.object({
  // optionally challenge specific other players
  challengeeIds: z.array(z.string()).optional(),

  // TODO other fields
});

// TODO pick reduced set of fields
export type CreateGameResponse = { gameId: string };

export const POST = async (req: NextRequest) => {
  const { challengeeIds } = CreateGameSchema.parse(reqToParams(req));

  const { userId } = await getRequester();

  const db = await connectDB();

  // TODO: this is a poor mans way of making match making
  // in the future we should have a queue and match making logic, especially on ELO rating
  const challenge = !!challengeeIds?.length
    ? await db.Game.findOne({
        status: "pending",
        "players[1]._id": { $exists: false },
      })
    : null;

  if (challenge) {
    // add player to game
    const res = await db.Game.updateOne(
      {
        _id: challenge._id,
      },
      {
        $set: { status: "running" }, // TODO only if all players are accepted
        $push: {
          players: {
            _id: userId,
            username: userId, // TODO: lookup username
            status: "pending",
          },
        },
      }
    );
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
