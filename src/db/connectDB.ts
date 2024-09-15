"use server";

import { Collection, Db, MongoClient } from "mongodb";
import { GameModel } from "./models/GameModel";
import { createIndexes } from "./createIndexes";

export type ICollections = {
  db: Db;

  Game: Collection<GameModel>;
};

// a connection promise that will be resolved
let _collectionPromise: Promise<ICollections>;

// return collection singleton
export default async function connectDB(): Promise<ICollections> {
  if (_collectionPromise) {
    return _collectionPromise;
  }

  _collectionPromise = (async () => {
    const uri = process.env.DB_URI;
    if (!uri) throw new Error("Database URI not provided!");

    const client = await MongoClient.connect(uri, {
      ignoreUndefined: true,
    });
    const db = client.db(); // use standard db

    const collections: ICollections = {
      db,
      Game: db.collection<GameModel>("games"),
    };

    await createIndexes(collections);

    return collections;
  })();

  return _collectionPromise;
}
