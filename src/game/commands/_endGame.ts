import { PrivateCommandHandler, pushEvent } from ".";
import { BaseEvent } from "./base";

export interface GameEndedEvent extends BaseEvent {
  type: "game-ended";
  // add data and props here
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const _endGame: PrivateCommandHandler<{}> = async (
  prevState,
  payload,
  context
) => {
  console.log("End Game", { prevState, payload, context });

  // we could check that we can't start a game twice?

  // keep state around
  let state = prevState;

  //   TODO implement game ending scenario

  state = pushEvent(state, { type: "game-ended" });

  return state;
};
