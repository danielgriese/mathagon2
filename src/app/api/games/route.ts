import { NextResponse } from "next/server";

export type ListGamesRequest = undefined;
export type ListGamesResponse = { games: { id: string }[] };

export const GET = async () => {
  // const input: ListGamesRequest = await req.json();
  // might need to check the headers for authorization
  console.log("/games");

  const response: ListGamesResponse = { games: [{ id: "123" }, { id: "456" }] };

  return NextResponse.json(response);
};
