import { GameStateLocal } from "@/game/types";
import React from "react";

export type PlayerProps = {
  player: GameStateLocal["players"][number];
};

export const Player: React.FC<PlayerProps> = (props) => {
  const { player } = props;

  return (
    <div className={player.hasTurn ? "opacity-100" : "opacity-50"}>
      <div className="text-xs">@{player.username}</div>
      <div>{player.score}</div>
    </div>
  );
};
