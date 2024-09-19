import { useMe } from "@/app/components/UserProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetGameEventsResponse } from "@/app/api/game/events/route";
import { fetchAuthed } from "@/utils/fetchAuthed";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createLocalGameEventReducer } from "@/game/reducer/reduceLocalGameEvent";
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

    refetchOnWindowFocus: true,
    refetchInterval: 5000, // every 5 seconds
  });

  const appReducer = useMemo(
    () => createLocalGameEventReducer(/*me.id*/),
    [] // [me.id]
  );

  const [state, dispatchEvent] = useReducer(appReducer, {
    // id of this game
    id: gameId,
    players: [],
    coins: [],
    board: [],

    // additional local state
    gameEnded: false,

    // dropTargets: [],
  } satisfies GameStateLocal);

  // dispatch any new events in delayed manner
  useEffect(() => {
    const events = eventsQuery.data?.events;

    if (events?.length) {
      console.log("adding events to queue", events);

      if (lastToken.current) {
        // if we have a last token, the game is already started
        // in that case we want to push events to the queue to be handled "async"
        eventQueue.current.push(...events);
        // eventsQuery.data.events = [];

        if (!isProcessing) {
          processQueue();
        }
      } else {
        // if we don't have a last token, the game is just starting
        // in that case we immediately dispatch the events
        events.forEach((event) => {
          dispatchEvent(event);
        });
      }

      // set the last token for next query
      lastToken.current = events[events.length - 1]._id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsQuery.data?.events]);

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
        // refetch the events query immediately
        eventsQuery.refetch();
        // // add events to local queue
        // eventQueue.current.push(...data.events);

        // if (!isProcessing) {
        //   processQueue();
        // }
      } else {
        // show error on board if wrong operation? or some kind of "!=" effect
        // TODO show errors differently (sonner?)
        console.error(data.error);
      }
    },
    onError: (error) => {
      // TODO show errors differently (sonner?)
      console.error(error);
    },
  });

  return { state, action: action.mutate, me, isLoading: eventsQuery.isLoading };
}
