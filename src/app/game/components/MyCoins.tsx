import { GameState } from "@/game/types";
import React from "react";

export type MyCoinsProps = {
  coins: GameState["coins"];
  hasTurn: boolean;
};

export const MyCoins: React.FC<MyCoinsProps> = (props) => {
  const { coins, hasTurn } = props;
  return (
    <div
      className={`flex items-center space-x-2 ${
        hasTurn ? "opacity-100" : "opacity-40"
      }`}
    >
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="w-8 h-8 grid place-items-center border border-black"
        >
          {coin.value}
        </div>
      ))}
    </div>
  );
};
