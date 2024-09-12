"use client";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "mathagon2-user-0.0.1";

type User = {
  id: string;
  username: string;
  token: string; // auth token to be sent/verified by server
  // TODO others
};

import React, { PropsWithChildren, useContext, useMemo } from "react";

export type UserProviderProps = PropsWithChildren<unknown>;

const MeContext = React.createContext<{ me: User }>({
  me: {
    id: "",
    username: "",
    token: "",
  },
});

export const UserProvider: React.FC<UserProviderProps> = (props) => {
  // TODO: disable resync? how to store client?

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // TODO: load user from local storage

      // if we have it, return it
      const localUser = window.localStorage.getItem(STORAGE_KEY);
      if (localUser) {
        // TODO sync with server
        // or sync asynchronously
        // fetch(`${process.env.NEXT_PUBLIC_URL}/api/games`).then(
        //     (res) => res.json() as Promise<ListGamesResponse>
        //   )

        return JSON.parse(localUser) as User;
      }

      // if we don't have it, create it
      // fake a user for now
      const randomId = Date.now().toString();
      const user: User = {
        id: randomId,
        username: `user_${randomId}`,
        token: randomId, // TODO token is JWT for server auth
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      return user;
    },
  });

  const context = useMemo(
    () => (query.data ? { me: query.data } : undefined),
    [query.data]
  );

  if (query.isLoading) {
    // TODO nice skeleton
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error?.message}</div>;
  }

  if (!context) {
    return <div>Error: no data</div>;
  }

  return (
    <MeContext.Provider value={context}>{props.children}</MeContext.Provider>
  );
};

export function useMe() {
  return useContext(MeContext);
}
