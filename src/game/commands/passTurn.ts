import { z } from "zod";
import { BaseCommandSchema, BaseEvent } from "./base";
import { CommandHandler, pushEvents } from ".";
import { _drawCoin } from "./_drawCoin";

export const PassTurnCommandSchema = BaseCommandSchema.extend({
  type: z.literal("pass-turn"),
  // pass turn does not have any specific payload
});

export interface TurnReceivedEvent extends BaseEvent {
  type: "turn-received";
  playerId: string;
}

export const passTurn: CommandHandler<"pass-turn"> = async (
  prevState,
  payload,
  context
) => {
  let state = prevState;

  console.log("passTurn", { state, payload, context });

  const players = state.state.players;

  // TODO simplify getting player and index of it
  //   check if the player is allowed to pass the turn
  const playerIndex = players.findIndex((p) => p._id === payload.playerId);
  const player = players[playerIndex];

  if (!player?.hasTurn) {
    return { ok: false, error: "player.no-turn" };
  }

  // TODO check if user needs new numbers
  // TODO check if user did not do anything? => fold? or is that separate and client side?

  // actually pass turn to next player
  const nextPlayerIndex = (playerIndex + 1) % players.length;

  state = pushEvents(state, [
    {
      type: "turn-received",
      playerId: players[nextPlayerIndex]._id,
    },
  ]);

  // depending on how many coins the user is missing, we try to give as many new
  const missingCoins = 5 - player.coins.length;
  if (missingCoins > 0) {
    for (let i = 0; i < missingCoins; i++) {
      state = await _drawCoin(
        state,
        { gameId: state.state.id, playerId: player._id }, // no max value as we want to draw from all coins
        context
      );
    }
  }

  return { ok: true, ...state };
};
