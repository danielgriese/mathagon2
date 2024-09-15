"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ListGamesResponse } from "@/app/api/game/route";
import { useMe } from "@/app/components/UserProvider";
import { fetchAuthed } from "@/utils/fetchAuthed";
import { CreateChallengeButton } from "./components/CreateChallengeButton";

export default function GamesPage() {
  const { me } = useMe();

  const gamesQuery = useQuery({
    queryKey: ["games"],
    queryFn: () =>
      fetchAuthed<undefined, ListGamesResponse>(
        `/api/game?userId=${me.id}`,
        me.token,
        undefined
      ),
  });

  return (
    <div>
      <h2>My Games</h2>

      <div>
        {gamesQuery.isLoading ? (
          "Loading..."
        ) : (
          <ul>
            {gamesQuery.data?.games.map((game) => (
              <li key={game._id}>
                <Link href={`/game?id=${game._id}`}>Game {game._id}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateChallengeButton />

      <div>
        <Link href="/">Go Home</Link>
      </div>
    </div>
  );
}
