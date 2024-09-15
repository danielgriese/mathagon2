import { NextRequest } from "next/server";

export function reqToParams(req: NextRequest) {
  return Object.fromEntries(req.nextUrl.searchParams.entries());
}
