import React, { useCallback, useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { Player } from "./Player";
import { Board, BoardProps } from "./Board";
import { MyCoins } from "./MyCoins";

import { DndContext } from "@dnd-kit/core";
import { CoinProps } from "./Coin";

export type GameProps = {
  gameId: string;

  onGameEnded: () => void;
};

// TODO client to collect events and release them on by one (for visual effects)
// it should be possible to flush all events at once (with no effects being played)

export const Game: React.FC<GameProps> = (props) => {
  const { state, action, me } = useGame(props.gameId);
  const [draggedCoin, setDraggedCoin] = useState<CoinProps["coin"] | null>(
    null
  );
  // TODO isLoading with skeleton

  // use effect to check if game ended
  const { onGameEnded } = props;
  useEffect(() => {
    if (state.gameEnded) {
      onGameEnded();
    }
  }, [state.gameEnded, onGameEnded]);

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
    <DndContext
      onDragStart={(e) => {
        // get dragged coin by id
        const coin = myPlayer?.coins.find((coin) => coin.id === e.active.id);
        if (coin) {
          setDraggedCoin(coin);
        }
      }}
      onDragEnd={(e) => {
        const coin = draggedCoin;

        const dragData = e.over?.data.current;
        if (!dragData) {
          return;
        }
        const { rowIdx, colIdx } = dragData as {
          rowIdx: number;
          colIdx: number;
        };
        setDraggedCoin(null);

        if (coin) {
          handleDropCoin(colIdx, rowIdx, coin.id);
        }
      }}
    >
      <header>
        <div className="flex items-center space-x-2">
          {state.players.map((player) => (
            <Player key={player._id} player={player} />
          ))}
        </div>

        <div className="min-h-[48px] my-4 px-2">
          <MyCoins
            coins={myPlayer?.coins ?? []}
            hasTurn={myPlayer?.hasTurn ?? false}
          />
        </div>
      </header>
      <main className="w-full h-full p-2 grid grid-cols-[1fr] grid-rows-[1fr] place-items-center max-h-full overflow-hidden">
        {/* Coins and Board */}
        <Board
          board={state.board}
          dropTargets={state.dropTargets}
          onDropCoin={handleDropCoin}
        />
      </main>
      <footer>
        {/* Game Actions */}
        {/* <Link href="/games">To Games</Link> */}

        {myPlayer?.nonMovedPasses || myPlayer?.didFold ? (
          <button
            className="p-4 border"
            onClick={() =>
              action({
                type: "fold",
              })
            }
          >
            FOLD
          </button>
        ) : (
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
        )}
      </footer>
    </DndContext>
  );
};
