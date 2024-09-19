import { CreateGameSchema } from "@/app/api/game/schema";
import connectDB from "@/db/connectDB";
import { GameModel } from "@/db/models/GameModel";
import { _startGame } from "@/game/commands/_startGame";
import { IContext } from "@/utils/types";
import { ObjectId } from "mongodb";
import { z } from "zod";

export async function createGame(
  { challengeeIds, isSolo }: z.infer<typeof CreateGameSchema>,
  context: IContext
) {
  console.log("createGame", { challengeeIds, ...context });

  const { userId } = context;

  const db = await connectDB();

  let challenge: GameModel | null = null;

  if (isSolo) {
    // create a solo challenge with no other players
    const res = await db.Game.insertOne({
      _id: new ObjectId().toHexString(),
      status: "pending",
      players: [],
      createdAt: new Date(),
      events: [],
    });

    challenge = await db.Game.findOne({ _id: res.insertedId });
  } else {
    // TODO: this is a poor mans way of making match making
    // in the future we should have a queue and match making logic, especially on ELO rating
    challenge = !challengeeIds?.length
      ? await db.Game.findOne(
          {
            status: "pending",
            "players._id": { $ne: userId },
          },
          { projection: { _id: 1, players: 1 } }
        )
      : null;
  }

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

    const game = await db.Game.findOne(
      {
        _id: challenge._id,
      },
      { projection: { players: 1 } }
    );

    // actually start the game via command action
    const { events } = await _startGame(
      {
        state: {
          id: challenge._id,
          players: [],
          coins: [],
          board: [],
        },
        events: [],
      },
      { gameId: challenge._id, players: game?.players ?? [] },
      context
    );

    // update game with the initial events
    await db.Game.updateOne(
      {
        _id: challenge._id,
      },
      {
        $push: {
          events: {
            $each: events,
          },
        },
      }
    );

    return { gameId: challenge._id };
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

    return { gameId: res.insertedId };
  }
}
