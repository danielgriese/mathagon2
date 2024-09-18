import connectDB from "@/db/connectDB";
import { IContext } from "@/utils/types";

export async function endGame(gameId: string, context: IContext) {
  console.log("End Game", { gameId, context });
  const db = await connectDB();

  // TODO grant ELO points
  // progress player rank etc.
  await db.Game.updateOne(
    {
      _id: gameId,
    },
    {
      $set: {
        status: "completed",
      },
    }
  );
}
