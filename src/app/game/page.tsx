"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GetGameResponse } from "../api/game/route";
import { useMe } from "../components/UserProvider";
import { fetchAuthed } from "@/utils/fetchAuthed";
import { Game } from "./components/Game";

export default function GamePage() {
  const params = useSearchParams();
  const gameId = params.get("id");

  const { me } = useMe();

  const query = useQuery({
    queryKey: ["game", gameId],
    queryFn: () =>
      fetchAuthed<undefined, GetGameResponse>(
        `/api/game?gameId=${gameId}`,
        me.token
      ),
    refetchInterval(query) {
      // while pending we want to poll every second
      if (query.state.data?.game?.status === "pending") {
        return 1000;
      } else {
        return false;
      }
    },
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  const game = query.data?.game;

  // if game is null, we need to show an error/warning with backlink
  if (!game) {
    // TODO nicer alert component
    return (
      <div>
        <h1>Game Not Found</h1>
        <Link href="/games">Back To Games</Link>
      </div>
    );
  }

  if (game.status === "pending") {
    // TODO same UI structure as regular game?
    return (
      <div>
        <h1>Game {game._id}</h1>
        <p>Waiting for players</p>
        {/* TODO: add option to cancel challenge */}
        <Link href="/games">Back To Games</Link>
      </div>
    );
  }

  return (
    <>
      <Game
        gameId={game._id}
        // when the game ends, we refetch the query to get the final state
        onGameEnded={() => {
          console.log("refetch due to end");
          query.refetch();
        }}
      />
      {game.status === "completed" && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center text-white">
          <div>GAME ENDED</div>
          <Link href="/games">Back To Games</Link>
        </div>
      )}
    </>
  );
}
