"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ListGamesResponse } from "../api/games/route";

export default function GamesPage() {
  const query = useQuery({
    queryKey: ["games"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/games`).then(
        (res) => res.json() as Promise<ListGamesResponse>
      ),
  });

  return (
    <div>
      <h1>My Games</h1>

      <div>
        {query.isLoading ? (
          "Loading..."
        ) : (
          <ul>
            {query.data?.games.map((game) => (
              <li key={game.id}>
                <Link href={`/game?id=${game.id}`}>Game {game.id}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Link href="/">Go Home</Link>
      </div>
    </div>
  );
}
