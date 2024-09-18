import { z } from "zod";
import { BaseCommandSchema, BaseEvent } from "./base";
import { CommandHandler, pushEvent } from ".";
import { _drawCoin } from "./_drawCoin";
import { _endGame } from "./_endGame";
import { passTurn } from "./passTurn";

export const FoldCommandSchema = BaseCommandSchema.extend({
  type: z.literal("fold"),
});

export interface PlayerFoldedEvent extends BaseEvent {
  type: "player-folded";
  playerId: string;
}

export const fold: CommandHandler<"fold"> = async (
  prevState,
  payload,
  context
) => {
  let state = prevState;

  const players = state.state.players;

  // check if this player did not fold already
  const player = players.find((p) => p._id === payload.playerId);

  if (!player?.hasTurn) {
    return { ok: false, error: "player.no-turn" };
  }

  if (player) {
    // push folded event
    state = pushEvent(state, {
      type: "player-folded",
      playerId: player._id,
    });

    // pass turn to next player
    const passTurnResponse = await passTurn(
      state,
      { type: "pass-turn", gameId: state.state.id, playerId: player._id },
      context
    );

    // not sure if can have a nicer way than this
    if (!passTurnResponse.ok) {
      return passTurnResponse;
    } else {
      state = {
        state: passTurnResponse.state,
        events: passTurnResponse.events,
      };
    }

    // check if all players folded
    const allPlayersFolded = state.state.players.every((p) => p.didFold);

    console.log("All players folded?", allPlayersFolded);

    // if all players folded, end the game
    if (allPlayersFolded) {
      state = await _endGame(state, { gameId: state.state.id }, context);
    }
  }

  return { ok: true, ...state };
};
