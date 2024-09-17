import { IContext } from "./types";

export function createContext(userId: string): IContext {
  return {
    userId,
    traceId: Math.random().toString(36).substring(7), // TODO implement real traceId
  };
}
