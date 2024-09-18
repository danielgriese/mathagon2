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

          hasMadeMove: false,
          nonMovedPasses: 0,
          didFold: false,
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

          // reset player fold
          resetPlayerFold(player);
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
        break;
      }

      case "turn-received": {
        // check if the previous player has made a move
        const prevPlayer = event.prevPlayerId
          ? getPlayer(draft, { playerId: event.prevPlayerId })
          : undefined;

        if (prevPlayer) {
          prevPlayer.hasTurn = false;

          if (!prevPlayer.hasMadeMove) {
            // he did not make a move, so we increase the nonMovedPasses
            prevPlayer.nonMovedPasses++;
          }
        }

        // pass turn to next player
        const nextPlayer = getPlayer(draft, { playerId: event.nextPlayerId });
        if (nextPlayer) {
          nextPlayer.hasTurn = true;
          nextPlayer.hasMadeMove = false;
        }

        break;
      }

      case "player-folded": {
        const player = getPlayer(draft, event);

        if (player) {
          player.didFold = true;
        }

        break;
      }

      case "game-ended": {
        // remove turn of all players
        draft.players.forEach((player) => {
          player.hasTurn = false;
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

function resetPlayerFold(player: WritableDraft<PlayerState>) {
  player.hasMadeMove = true;
  player.nonMovedPasses = 0;
  player.didFold = false;
}
