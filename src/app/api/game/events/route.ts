import connectDB from "@/db/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { GetEventsRequestSchema } from "../schema";
import { reqToParams } from "@/utils/reqToParams";
import { GameEvent } from "@/game/commands";

export type GetGameEventsResponse = { events: GameEvent[] };

const IS_APP_BUILD = !!process.env.APP_BUILD;

export const GET = async (req: NextRequest) => {
  // There must be a better way
  if (IS_APP_BUILD) {
    return NextResponse.json({ events: [] });
  }

  // userId
  const { gameId, after } = GetEventsRequestSchema.parse(reqToParams(req));

  // TODO validate user from cookie

  const db = await connectDB();

  // grab the user via userId and check its last event token
  //   const user = await db.User.findOne(
  //     { _id: userId },
  //     { projection: { lastEventToken: 1 } }
  //   );

  const game = await db.Game.findOne(
    {
      _id: gameId,
    },
    {
      projection: {
        events: after
          ? {
              $filter: {
                input: "$events",
                cond: { $gt: ["$$this._id", after] },
              },
            }
          : 1,
      },
    }
  );

  const response: GetGameEventsResponse = { events: game?.events || [] };
  return NextResponse.json(response);
};

export const dynamic = IS_APP_BUILD ? "force-static" : "auto";
