"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GetGameResponse } from "../api/game/route";
import { useMe } from "../components/UserProvider";
import { fetchAuthed } from "@/utils/fetchAuthed";

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

  return (
    <div>
      <h1>game {game._id}</h1>
    </div>
  );
}
