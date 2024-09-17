import { z } from "zod";
import { BaseCommandSchema, BaseEvent } from "./base";
import { CommandHandler, pushEvents } from ".";

export const DropCoinCommandSchema = BaseCommandSchema.extend({
  type: z.literal("drop-coin"),

  // the number that has been dropped
  coinId: z.number(),

  // row and column (the game engine / server validates this move with probable restrictions or bonuses)
  column: z.number(),
  row: z.number(),
});

export interface CoinDroppedEvent extends BaseEvent {
  type: "coin-dropped";

  playerId: string;

  // the ID of the coin that has been dropped
  coin: { id: number; value: number };

  // row and column (the game engine / server validates this move with probable restrictions or bonuses)
  column: number;
  row: number;

  // valid operations on this drop
  // operations: {
  //   pair: NumericNeighborTuple;
  //   operation: {
  //     operator: string;
  //     operands: number[];
  //   };
  // }[];
}

export const dropCoin: CommandHandler<"drop-coin"> = async (
  state,
  payload,
  context
) => {
  console.log("dropCoin", { state, payload, context });

  // get the player
  const player = state.state.players.find((p) => p._id === payload.playerId);
  if (!player) {
    return { ok: false, error: "player.not-found" };
  }

  // it should be the players turn
  if (!player.hasTurn) {
    return { ok: false, error: "player.no-turn" };
  }

  // find the coin in the players possession
  const coin = player.coins.find((c) => c.id === payload.coinId);
  if (!coin) {
    return { ok: false, error: "player.does-not-own-coin" };
  }

  // find the coin in the players possession

  // TODO implement the actual logic and checks
  state = pushEvents(state, [
    {
      type: "coin-dropped",
      coin,
      column: payload.column,
      row: payload.row,
      playerId: payload.playerId,
    },
  ]);

  // TODO implement all of it
  return { ok: true, ...state };
};
