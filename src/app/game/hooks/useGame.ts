import { useMe } from "@/app/components/UserProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetGameEventsResponse } from "@/app/api/game/events/route";
import { fetchAuthed } from "@/utils/fetchAuthed";
import { useEffect, useReducer, useRef, useState } from "react";
import { reduceAppGameEvent } from "@/game/reducer/reduceLocalGameEvent";
import { Commands, GameEvent } from "@/game/commands";
import { type PutCommandResponse } from "@/app/api/game/route";
import { GameStateLocal } from "@/game/types";

type OmitPlayerAndGameId<T> = T extends { playerId: string; gameId: string }
  ? Omit<T, "playerId" | "gameId">
  : T;

// TODO we can later on differentiate if that is a local game or a remote game (with server)
export function useGame(gameId: string) {
  // get my current user
  const { me } = useMe();

  // use ref for last event token
  const lastToken = useRef<string | null>(null);

  const eventQueue = useRef<GameEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const eventsQuery = useQuery({
    queryKey: ["events", gameId, me.id],
    queryFn: () =>
      fetchAuthed<undefined, GetGameEventsResponse>(
        `/api/game/events?gameId=${gameId}&userId=${me.id}&after=${
          lastToken.current ?? ""
        }`,
        me.token
      ),

    refetchInterval: 5000, // every 5 seconds
  });

  // use effect to set the last token
  useEffect(() => {
    if (eventsQuery.data?.events?.length) {
      lastToken.current =
        eventsQuery.data.events[eventsQuery.data.events.length - 1]._id;
    }
  }, [eventsQuery.data]);

  const [state, dispatchEvent] = useReducer(reduceAppGameEvent, {
    // id of this game
    id: gameId,
    players: [],
    coins: [],
    board: [],

    // dropTargets: [],
  } satisfies GameStateLocal);

  // dispatch any new events in delayed manner
  useEffect(() => {
    if (eventsQuery.data?.events?.length) {
      console.log("adding events to queue", eventsQuery.data.events);
      eventQueue.current.push(...eventsQuery.data.events);
      eventsQuery.data.events = [];

      if (!isProcessing) {
        processQueue();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsQuery.data]);

  const processQueue = () => {
    setIsProcessing(true);
    if (eventQueue.current.length === 0) {
      setIsProcessing(false);
      return;
    }

    const event = eventQueue.current.shift();
    if (event) {
      dispatchEvent(event);

      setTimeout(() => {
        processQueue();
      }, 100); // Adjust the delay as needed
    }
  };

  // action mutation
  const action = useMutation({
    mutationFn: (args: OmitPlayerAndGameId<Commands>) =>
      fetchAuthed<Commands, PutCommandResponse>(
        "/api/game",
        me.token,
        { ...args, gameId, playerId: me.id },
        {
          method: "PUT",
        }
      ),
    onSuccess: (data) => {
      console.log("onSuccess", data);

      if (data.ok) {
        // add events to local queue
        eventQueue.current.push(...data.events);

        if (!isProcessing) {
          processQueue();
        }
      } else {
        // TODO show errors differently (sonner?)
        alert(data.error);
      }
    },
    onError: (error) => {
      // TODO show errors differently (sonner?)
      alert(error.message);
    },
  });

  return { state, action: action.mutate, me, isLoading: eventsQuery.isLoading };
}
