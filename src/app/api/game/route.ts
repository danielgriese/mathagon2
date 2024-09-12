import { NextRequest, NextResponse } from "next/server";

export type GetGameRequest = unknown;
export type GetGameResponse = { game: { id: string } };

export const GET = async (req: NextRequest) => {
  const gameId = req.nextUrl.searchParams.get("id");
  console.log("/game", gameId);

  if (!gameId) {
    if (process.env.APP_BUILD) {
      return NextResponse.json({});
    }

    throw new Error("gameId is required");
  }

  const response: GetGameResponse = { game: { id: gameId } };

  return NextResponse.json(response);
};

export const dynamic = process.env.APP_BUILD ? "force-static" : "auto";
