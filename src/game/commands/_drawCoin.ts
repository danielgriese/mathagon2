import { PrivateCommandHandler, pushEvent } from ".";
import { GameState } from "../types";
import { BaseEvent } from "./base";

export interface DrawnCoinEvent extends BaseEvent {
  type: "coin-drawn";
  playerId: string;
  coin: GameState["coins"][0];
}

export const _drawCoin: PrivateCommandHandler<{
  playerId: string;
  range?: [number, number];
}> = async (state, payload, context) => {
  console.log("drawCoin", { state, payload, context });

  // TODO we might check if the user can receive any coins

  let coins = state.state.coins;

  // if we have a max value, we can filter the numbers
  if (payload.range !== undefined) {
    const [minValue, maxValue] = payload.range;
    coins = coins.filter((c) => c.value >= minValue && c.value <= maxValue);
  }

  // get a random number
  const value = coins[Math.floor(Math.random() * coins.length)];

  // no number left -> return the current state
  if (!value) {
    return state;
  }

  // push event
  return pushEvent(state, {
    type: "coin-drawn",
    playerId: payload.playerId,
    coin: value,
  });
};
