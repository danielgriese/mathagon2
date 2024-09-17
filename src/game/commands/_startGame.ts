import { BaseEvent } from "./base";
import { GameEvent, PrivateCommandHandler, pushEvents } from ".";
import { FieldType, GameState } from "../types";
import { reduceGameEvent } from "../reducer/reduceGameEvent";
import { GameModel } from "@/db/models/GameModel";
import { _drawCoin } from "./_drawCoin";

export interface GameStartedEvent extends BaseEvent {
  type: "game-started";
  // add data and props here
  board: FieldType[][];
  numbers: number[];
  players: GameModel["players"];
}

export const _startGame: PrivateCommandHandler<{
  players: GameModel["players"];
}> = async (prevState, payload, context) => {
  console.log("Start Game", { prevState, payload, context });

  // we could check that we can't start a game twice?

  // keep state around
  let state = prevState;

  // push the game started event first
  state = pushEvents(state, [
    {
      type: "game-started",
      board: DEFAULT_BOARD,
      numbers: DEFAULT_NUMBERS,
      players: payload.players,
    },
  ]);

  // now let all players draw numbers
  for (const player of payload.players) {
    // we start with a max value of 12 by default (to have a better start)
    for (let i = 0; i < 5; i++) {
      // TODO different initial numbers?
      state = await _drawCoin(
        state,
        { gameId: state.state.id, playerId: player._id, maxValue: 12 },
        context
      );
    }
  }

  // pass turn to first player
  state = await pushEvents(state, [
    {
      type: "turn-received",
      playerId: state.state.players[0]._id,
    },
  ]);

  return state;
};

const DEFAULT_BOARD: GameState["board"] = [
  [null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, 3, null, null, null],
  [null, null, null, 1, null, 4, null, null, null],
  [null, null, null, 2, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null],
];

const DEFAULT_NUMBERS = [
  0,
  ...new Array(7).fill(1),
  ...new Array(7).fill(2),
  ...new Array(7).fill(3),
  ...new Array(7).fill(4),
  ...new Array(7).fill(5),
  ...new Array(7).fill(6),
  ...new Array(7).fill(7),
  ...new Array(7).fill(8),
  ...new Array(7).fill(9),
  ...new Array(7).fill(10),
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  24,
  25,
  27,
  30,
  32,
  35,
  36,
  40,
  42,
  45,
  49,
  50,
  54,
  56,
  60,
  63,
  64,
  70,
  72,
  80,
  81,
  90,
];
