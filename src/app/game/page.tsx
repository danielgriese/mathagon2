"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GetGameRequest, GetGameResponse } from "../api/game/route";
import { useMe } from "../components/UserProvider";
import { fetchAuthed } from "@/utils/fetchAuthed";

export default function GamesPage() {
  const params = useSearchParams();
  const gameId = params.get("id");

  const { me } = useMe();

  const query = useQuery({
    queryKey: ["game", gameId],
    queryFn: () =>
      fetchAuthed<GetGameRequest, GetGameResponse>(
        `/api/game?id=${gameId}`,
        me.token
      ),
  });

  return (
    <div>
      {query.isLoading ? (
        "Loading..."
      ) : (
        <div>
          <h1>Game {query.data?.game.id}</h1>
        </div>
      )}
      <Link href="/games">Back To Games</Link>
    </div>
  );
}
