import { GameEvent } from "../commands";
import { GameStateLocal } from "../types";
import { reduceGameEvent } from "./reduceGameEvent";

export function reduceAppGameEvent(
  prevState: GameStateLocal,
  event: GameEvent
): GameStateLocal {
  // use general game reducer first
  let state = reduceGameEvent(prevState, event) as GameStateLocal;

  //   console.log("reduce local event", event);

  return state;
  //   // ok we got that, based on the event, we can reduce further stuff along using local app logic
  //   switch (event.type) {
  //     // TODO mark new new coins

  //     // TODO mark my new coins

  //     // mark drop targets on creation
  //     case "game_created": {
  //       // copy the board state as drop targets (all false initially)
  //       state = update(state, {
  //         dropTargets: { $set: state.board.map((col) => col.map((_) => false)) },
  //       });

  //       const numberFields = state.board.flatMap((col, colIndex) =>
  //         col
  //           .map((type, rowIndex) => {
  //             return typeof type === "number"
  //               ? ([colIndex, rowIndex] as FieldPosition)
  //               : undefined;
  //           })
  //           .filter(filterNulls)
  //       );

  //       return numberFields.reduce(_updateNeighborDropTargets, state);
  //     }

  //     // mark drop targets on coin drop
  //     case "player_coin_dropped": {
  //       return _updateNeighborDropTargets(state, [event.column, event.row]);
  //     }

  //     default:
  //       return state;
  //   }
}

// function _updateNeighborDropTargets(
//   state: GameAppState,
//   position: FieldPosition
// ): GameAppState {
//   // get potential available drop targtes next to our position
//   const available = getAvailableNeighborFieldPositions(
//     state.board,
//     position[0],
//     position[1]
//   );

//   // for each of these positions, we got to check if they are a valid drop target
//   return update(state, {
//     dropTargets: {
//       $apply: (value) =>
//         available.reduce((targets, pos) => {
//           // check if this field is a valid drop target by checking if we have a neighbor pairs
//           const isDropTarget =
//             getNumericNeighborPairs(state.board, pos[0], pos[1]).length > 0;

//           return update(targets, {
//             [pos[0]]: {
//               [pos[1]]: { $set: isDropTarget },
//             },
//           });
//         }, value),
//     },
//   });
// }
