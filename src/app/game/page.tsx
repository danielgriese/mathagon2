"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GetGameResponse } from "../api/game/route";

export default function GamesPage() {
  const params = useSearchParams();
  const gameId = params.get("id");

  const query = useQuery({
    queryKey: ["game", gameId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/game?id=${gameId}`).then(
        (res) => res.json() as Promise<GetGameResponse>
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
