import { PrivateCommandHandler, pushEvents } from ".";
import { GameState } from "../types";
import { BaseEvent } from "./base";

export interface DrawnCoinEvent extends BaseEvent {
  type: "coin-drawn";
  playerId: string;
  coin: GameState["coins"][0];
}

export const _drawCoin: PrivateCommandHandler<{
  playerId: string;
  maxValue?: number;
}> = async (state, payload, context) => {
  console.log("drawCoin", { state, payload, context });

  // TODO we might check if the user can receive any coins

  let coins = state.state.coins;

  // if we have a max value, we can filter the numbers
  if (payload.maxValue !== undefined) {
    coins = coins.filter((c) => c.value <= (payload.maxValue ?? 0));
  }

  // get a random number
  const value = coins[Math.floor(Math.random() * coins.length)];

  // push event
  return pushEvents(state, [
    {
      type: "coin-drawn",
      playerId: payload.playerId,
      coin: value,
    },
  ]);
};
