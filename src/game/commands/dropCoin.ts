import { z } from "zod";
import { BaseCommandSchema, BaseEvent } from "./base";
import { CommandHandler, pushEvent } from ".";
import {
  getNumericNeighborPairs,
  NumericNeighborTuple,
} from "../utils/getNumericNeighborPairs";
import { _drawCoin } from "./_drawCoin";

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

  // how many points the player gained
  points: number;

  // valid operations on this drop
  operations: {
    pair: NumericNeighborTuple;
    operation: {
      operator: string;
      operands: number[];
    };
  }[];
}

export interface CoinsClearedEvent extends BaseEvent {
  type: "coins-cleared";

  playerId: string;

  // how many points the player gained as a bonus
  points: number;
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

  // const get board state
  const board = state.state.board;

  // get target field
  const targetField = board[payload.column][payload.row];

  // check if target is already set
  if (typeof targetField === "number") {
    return { ok: false, error: "game.target-is-number" };
  }
  // check if this is a valid move
  const neighbors = getNumericNeighborPairs(board, payload.column, payload.row);

  // check which operators should be considered
  const operators =
    // limit to one if + or - special field
    targetField === "-" || targetField === "+"
      ? [targetField]
      : ["+", "-", "*", "/"];

  // filter neighbors by checking if arithemetic functions do match
  const validOperations = neighbors
    .map((pair) => {
      // each operator applied to A & B and B & A
      const validOperation = operators
        .flatMap((operator) => [
          {
            operator,
            operands: [pair[0], pair[1]],
          },
          {
            operator,
            operands: [pair[1], pair[0]],
          },
        ])
        // find at least one matching operation for that pair
        .find((op) => {
          switch (op.operator) {
            case "+":
              return op.operands[0] + op.operands[1] === coin.value;
            case "-":
              return op.operands[0] - op.operands[1] === coin.value;
            case "*":
              return op.operands[0] * op.operands[1] === coin.value;
            case "/":
              return (
                op.operands[1] !== 0 &&
                op.operands[0] / op.operands[1] === coin.value
              );
          }
        });

      // return pair with valid operations if applicable
      return validOperation && { pair, operation: validOperation };
    })
    .filter((op) => op !== undefined);

  if (validOperations.length === 0) {
    return { ok: false, error: "game.invalid-operation" };
  }

  state = pushEvent(state, {
    type: "coin-dropped",
    coin,
    column: payload.column,
    row: payload.row,
    playerId: payload.playerId,
    operations: validOperations,

    // gain points(depending on how many neighbor pairs were hit)
    points: coin.value * validOperations.length,
  });

  const updatedPlayer = state.state.players.find(
    (p) => p._id === payload.playerId
  );

  // if coins are empty provide new ones and give bonus
  if (updatedPlayer?.coins.length === 0) {
    // provide 5 new coins (might need to be adjusted based on game mode)
    for (let i = 0; i < 5; i++) {
      state = await _drawCoin(
        state,
        { gameId: state.state.id, playerId: player._id }, // no max value as we want to draw from all coins
        context
      );
    }

    state = pushEvent(state, {
      type: "coins-cleared",
      playerId: payload.playerId,
      points: 100,
    });
  }

  return { ok: true, ...state };
};
