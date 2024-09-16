import { CreateGameResponse, CreateGameSchema } from "@/app/api/game/route";
import { useMe } from "@/app/components/UserProvider";
import { fetchAuthed } from "@/utils/fetchAuthed";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";

export type CreateChallengeButtonProps = unknown;

type Args = z.infer<typeof CreateGameSchema>;

export const CreateChallengeButton: React.FC<CreateChallengeButtonProps> = (
  props
) => {
  const { me } = useMe();
  const router = useRouter();

  // CreateChallengeSchema
  const mutation = useMutation({
    mutationFn: (args: Args) =>
      fetchAuthed<Args, CreateGameResponse>("/api/game", me.token, args, {
        method: "POST",
      }),
  });

  // TODO nice button
  return (
    <button
      className="my-4 p-2 border"
      onClick={async () => {
        const result = await mutation.mutateAsync({});
        console.log("result", result);
        router.push(`/game?id=${result.gameId}`);
      }}
    >
      {mutation.isPending ? "Loading ..." : "Create Random Challenge"}
    </button>
  );
};
