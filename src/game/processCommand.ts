import { IContext } from "@/utils/types";
import { CommandHandler, CommandMap, Commands, GameEvent } from "./commands";
import connectDB from "@/db/connectDB";
import { reduceGameEvent } from "./reducer/reduceGameEvent";

export async function processCommand(
  command: Commands,
  context: IContext
): Promise<{ ok: false; error: string } | { ok: true; events: GameEvent[] }> {
  const { gameId } = command;

  // load the game
  const db = await connectDB();
  const game = await db.Game.findOne(
    {
      _id: gameId,
    },
    { projection: { events: 1 } }
  );

  if (!game) {
    return { ok: false, error: "game.not-found" };
  }

  // TODO validate that the player is part of the game and acting on it's behalf

  // get game state (reduce from event log)
  const state = game?.events.reduce(reduceGameEvent, {
    id: gameId,
    players: [],
    numbers: [],
    board: [],
  });

  // process command -> execute the function
  // collect events and store in event log
  // return the added events
  console.log("processCommand", { command, ...context });

  const handler = CommandMap[command.type] as CommandHandler<Commands["type"]>;
  const response = await handler({ state, events: [] }, command, context);

  // store the events
  if (response.ok) {
    await db.Game.updateOne(
      {
        _id: gameId,
      },
      {
        $push: {
          events: {
            $each: response.events,
          },
        },
      }
    );
  }

  // return the ok code and events
  return response;
}
