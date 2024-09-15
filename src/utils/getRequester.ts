import { headers } from "next/headers";

export async function getRequester() {
  const heads = headers();

  const auth = heads.get("Authorization");
  const ip = heads.get("x-real-ip") || heads.get("x-forwarded-for");
  // TODO nextrequest as country/ip?

  // identify Bearer token
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length);
    // TODO verify token

    // TODO find user by token

    return {
      ip,
      token,
      userId: token, // TODO userId from token
    };
  }

  throw new Error("No token found");
}
