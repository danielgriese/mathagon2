import { z } from "zod";
import { GameState } from "../types";
import { IContext } from "@/utils/types";
import {
  CoinDroppedEvent,
  CoinsClearedEvent,
  dropCoin,
  DropCoinCommandSchema,
} from "./dropCoin";
import { passTurn, PassTurnCommandSchema, TurnReceivedEvent } from "./passTurn";
import { GameStartedEvent } from "./_startGame";
import { reduceGameEvent } from "../reducer/reduceGameEvent";
import { DrawnCoinEvent } from "./_drawCoin";
import { ObjectId, OptionalId } from "mongodb";
import { fold, FoldCommandSchema, PlayerFoldedEvent } from "./fold";
import { GameEndedEvent } from "./_endGame";

export const CommandsSchema = z.union([
  DropCoinCommandSchema,
  PassTurnCommandSchema,
  FoldCommandSchema,
]);

export type Commands = z.infer<typeof CommandsSchema>;

export type GameEvent =
  | GameStartedEvent
  | GameEndedEvent
  | DrawnCoinEvent
  | TurnReceivedEvent
  | CoinDroppedEvent
  | CoinsClearedEvent
  | PlayerFoldedEvent;

export type CommandHandler<TType extends Commands["type"]> = (
  state: { state: GameState; events: GameEvent[] },
  payload: TType extends Commands["type"]
    ? Extract<Commands, { type: TType }>
    : never,
  context: IContext
) => Promise<
  | { ok: false; error: string }
  | { ok: true; state: GameState; events: GameEvent[] }
>;

export type PrivateCommandHandler<TPayload extends object> = (
  state: { state: GameState; events: GameEvent[] },
  payload: { gameId: string } & TPayload,
  context: IContext
) => Promise<{ state: GameState; events: GameEvent[] }>;

type CommandHandlers = {
  [TType in Commands["type"]]: CommandHandler<TType>;
};

export const CommandMap: CommandHandlers = {
  "drop-coin": dropCoin,
  "pass-turn": passTurn,
  fold: fold,
};

export function pushEvent(
  state: { state: GameState; events: GameEvent[] },
  event: OptionalId<GameEvent>
): { state: GameState; events: GameEvent[] } {
  const eventWithId = {
    ...event,
    _id: new ObjectId().toHexString(),
  };

  return {
    state: reduceGameEvent(state.state, eventWithId),
    events: [...state.events, eventWithId],
  };
}
