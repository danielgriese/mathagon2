import { GameEvent } from "../commands";
import { GameState, PlayerState } from "../types";
import { produce, WritableDraft } from "immer";

export function reduceGameEvent(state: GameState, event: GameEvent): GameState {
  console.log("reduceGameEvent", state, event);

  return produce(state, (draft) => {
    switch (event.type) {
      case "game-started": {
        draft.board = event.board;
        draft.coins = event.numbers.map((value, idx) => ({
          id: idx + 1,
          value,
        }));

        draft.players = event.players.map((player) => ({
          _id: player._id,
          username: player.username,
          coins: [],
          hasTurn: false,
          multiplier: 1,
          score: 0,
        }));
        break;
      }

      case "coin-drawn": {
        const player = getPlayer(draft, event);

        if (player) {
          if (!player.coins.find((c) => c.id === event.coin.id)) {
            player.coins.push(event.coin);
            player.coins.sort((a, b) => a.value - b.value);
          }
        }

        // remove number from game
        const idx = draft.coins.findIndex((c) => c.id === event.coin.id);
        if (idx !== -1) {
          draft.coins.splice(idx, 1);
        }

        break;
      }

      case "coin-dropped": {
        const player = getPlayer(draft, event);

        if (player) {
          // remove coin from player
          const idx = player.coins.findIndex((c) => c.id === event.coin.id);
          if (idx !== -1) {
            player.coins.splice(idx, 1);
          }

          // add points to player
          player.score += event.points;
        }

        // add coin to board
        draft.board[event.column][event.row] = event.coin.value;

        break;
      }

      // get bonus for cleared points
      case "coins-cleared": {
        const player = getPlayer(draft, event);

        if (player) {
          player.score += event.points;
        }
      }

      case "turn-received": {
        // go through all players and set hasTurn to false or true
        draft.players.forEach((player) => {
          player.hasTurn = player._id === event.playerId;
        });

        break;
      }
    }

    return draft;
  });
}

function getPlayer(
  state: WritableDraft<GameState>,
  event: { playerId: string }
): WritableDraft<PlayerState> | undefined {
  return state.players.find((player) => player._id === event.playerId);
}
