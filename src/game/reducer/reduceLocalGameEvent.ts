import { produce, WritableDraft } from "immer";
import { GameEvent } from "../commands";
import { FieldPosition, GameStateLocal } from "../types";
import { reduceGameEvent } from "./reduceGameEvent";
import { getAvailableNeighborFieldPositions } from "../utils/getNeighborFields";
import { getNumericNeighborPairs } from "../utils/getNumericNeighborPairs";

export function createLocalGameEventReducer() {
  //(myUserId: string) {
  function reduceAppGameEvent(
    prevState: GameStateLocal,
    event: GameEvent
  ): GameStateLocal {
    // use general game reducer first
    const state = reduceGameEvent(prevState, event) as GameStateLocal;

    // then we can do some local stuff
    return produce(state, (draft) => {
      switch (event.type) {
        case "game-ended": {
          draft.gameEnded = true;
          break;
        }

        // TODO mark new board coins

        // TODO mark my new coins

        // mark drop targets on creation
        case "game-started": {
          // copy the board state as drop targets (all false initially)
          draft.dropTargets = draft.board.map((col) => col.map(() => false));

          // get all initial current number fields
          const numberFields = draft.board.flatMap((col, colIndex) =>
            col
              .map((type, rowIndex) => {
                return typeof type === "number"
                  ? ([colIndex, rowIndex] as FieldPosition)
                  : undefined;
              })
              .filter((s) => s !== undefined)
          );

          return numberFields.reduce(_reduceNeighborDropTargets, draft);
        }

        // mark drop targets on coin drop
        case "coin-dropped": {
          return _reduceNeighborDropTargets(draft, [event.column, event.row]);
        }
      }

      return draft;
    });
  }

  return reduceAppGameEvent;
}

function _reduceNeighborDropTargets(
  state: WritableDraft<GameStateLocal>,
  position: FieldPosition
): WritableDraft<GameStateLocal> {
  // get potential available drop targtes next to our position
  const available = getAvailableNeighborFieldPositions(
    state.board,
    position[0],
    position[1]
  );

  state.dropTargets = available.reduce((targets, pos) => {
    // check if this field is a valid drop target by checking if we have a neighbor pairs
    const isDropTarget =
      getNumericNeighborPairs(state.board, pos[0], pos[1]).length > 0;

    // update the drop target state
    targets[pos[0]][pos[1]] = isDropTarget;

    return targets;
  }, state.dropTargets);

  return state;
}
