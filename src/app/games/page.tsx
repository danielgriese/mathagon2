"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ListGamesRequest, ListGamesResponse } from "@/app/api/games/route";
import { useMe } from "@/app/components/UserProvider";
import { fetchAuthed } from "@/utils/fetchAuthed";

export default function GamesPage() {
  const { me } = useMe();

  const query = useQuery({
    queryKey: ["games"],
    queryFn: () =>
      fetchAuthed<ListGamesRequest, ListGamesResponse>(
        "/api/games",
        me.token,
        undefined
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
