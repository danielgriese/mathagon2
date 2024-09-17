import { GameStateLocal } from "@/game/types";
import React from "react";

export type PlayerProps = {
  player: GameStateLocal["players"][number];
};

export const Player: React.FC<PlayerProps> = (props) => {
  const { player } = props;

  return (
    <div>
      <pre>
        {[
          player.username,
          player.hasTurn,
          player.score,
          player.multiplier,
        ].join(" | ")}
      </pre>
    </div>
  );
};
