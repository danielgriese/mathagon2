import React, { useCallback } from "react";
import { useGame } from "../hooks/useGame";
import { Player } from "./Player";
import { Board, BoardProps } from "./Board";
import { MyCoins } from "./MyCoins";

export type GameProps = {
  gameId: string;
  // state: GameMo
};

// TODO client to collect events and release them on by one (for visual effects)
// it should be possible to flush all events at once (with no effects being played)

export const Game: React.FC<GameProps> = (props) => {
  const { state, action, me } = useGame(props.gameId);
  // TODO isLoading with skeleton

  const myPlayer = state.players.find((player) => player._id === me.id);

  const handleDropCoin: BoardProps["onDropCoin"] = useCallback(
    (colIdx, rowIdx, coinId) => {
      action({
        type: "drop-coin",
        coinId: coinId,
        column: colIdx,
        row: rowIdx,
      });
    },
    [action]
  );

  return (
    <>
      <header>
        <div className="flex items-center">
          {state.players.map((player) => (
            <Player key={player._id} player={player} />
          ))}
        </div>
        <MyCoins
          coins={myPlayer?.coins ?? []}
          hasTurn={myPlayer?.hasTurn ?? false}
        />
      </header>
      <main>
        {/* Coins and Board */}
        <Board board={state.board} onDropCoin={handleDropCoin} />
      </main>
      <footer>
        {/* Game Actions */}
        {/* <Link href="/games">To Games</Link> */}

        <button
          className="p-4 border"
          onClick={() => {
            // get a random position on the board (that is still empty)
            for (let colIdx = 0; colIdx < state.board.length; colIdx++) {
              const col = state.board[colIdx];
              for (let rowIdx = 0; rowIdx < col.length; rowIdx++) {
                if (col[rowIdx] === null) {
                  // get a random coin from player
                  const coin =
                    myPlayer?.coins[
                      Math.floor(Math.random() * myPlayer.coins.length)
                    ];

                  action({
                    type: "drop-coin",
                    coinId: coin?.id ?? -1,
                    column: colIdx,
                    row: rowIdx,
                  });
                  return;
                }
              }
            }
          }}
        >
          Set Random number
        </button>

        <button
          className="p-4 border"
          onClick={() =>
            action({
              type: "pass-turn",
            })
          }
        >
          Pass Turn
        </button>
      </footer>
    </>
  );
};
