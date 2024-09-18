import { z } from "zod";
import { BaseCommandSchema, BaseEvent } from "./base";
import { CommandHandler, pushEvent } from ".";
import { _drawCoin } from "./_drawCoin";

export const PassTurnCommandSchema = BaseCommandSchema.extend({
  type: z.literal("pass-turn"),
});

export interface TurnReceivedEvent extends BaseEvent {
  type: "turn-received";
  prevPlayerId: string | null;
  nextPlayerId: string;
}

export const passTurn: CommandHandler<"pass-turn"> = async (
  prevState,
  payload,
  context
) => {
  let state = prevState;

  const players = state.state.players;

  // check if the player is allowed to pass the turn
  const playerIndex = players.findIndex((p) => p._id === payload.playerId);
  const player = players[playerIndex];

  if (!player?.hasTurn) {
    return { ok: false, error: "player.no-turn" };
  }

  // TODO check if user needs new numbers
  // TODO check if user did not do anything? => fold? or is that separate and client side?

  // actually pass turn to next player
  const nextPlayerIndex = (playerIndex + 1) % players.length;

  state = pushEvent(state, {
    type: "turn-received",
    prevPlayerId: player._id,
    nextPlayerId: players[nextPlayerIndex]._id,
  });

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
