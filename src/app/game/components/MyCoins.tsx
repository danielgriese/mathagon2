import { GameState } from "@/game/types";
import React from "react";
import { Coin } from "./Coin";

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
        <Coin key={coin.id} coin={coin} hasTurn={hasTurn} />
      ))}
    </div>
  );
};
