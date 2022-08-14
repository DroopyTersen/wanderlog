import { addRxPlugin, createRxDatabase, RxCollection } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import {
  RxDBReplicationGraphQLPlugin,
  RxGraphQLReplicationState,
} from "rxdb/plugins/replication-graphql";
import { isOnlineStore } from "~/common/isOnline";
import { auth } from "~/features/auth/auth.client";
import { memoriesCollection } from "~/features/memories/memories.rxdb";
import { tripsCollection } from "~/features/trips/trips.rxdb";
import { usersCollection } from "~/features/users/users.rxdb";
import { RxCollectionDefinition } from "./database.types";
addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBReplicationGraphQLPlugin);
const GRAPHQL_ENDPOINT = import.meta.env.VITE_HASURA_ENDPOINT;
console.log("🚀 | GRAPHQL_ENDPOINT", GRAPHQL_ENDPOINT);

let replicationStates: RxGraphQLReplicationState<any>[] = [];
const syncCollection = async (
  collection: RxCollection,
  collectionDefinition: RxCollectionDefinition
) => {
  console.log("SYNCING", collectionDefinition.name);
  let replicationState = collection.syncGraphQL({
    url: GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `Bearer ${auth.getAccessToken()}`,
    },
    pull: {
      queryBuilder: collectionDefinition.buildPullQuery,
      batchSize: collectionDefinition.batchSize,
    },
    push: {
      queryBuilder: collectionDefinition.buildPushQuery,
      batchSize: collectionDefinition.batchSize,
    },
    deletedFlag: "deleted",
    liveInterval: collectionDefinition?.liveInterval || 10 * 1000,
    live: true,
    autoStart: true,
  });
  replicationState.error$.subscribe((err) => {
    console.error("replication error:" + collectionDefinition.name);
    console.dir(err);
  });
  if (replicationState.isStopped()) {
    replicationState.run();
  }
  replicationStates.push(replicationState);
  return;
};

let collections: RxCollectionDefinition[] = [
  usersCollection,
  tripsCollection,
  memoriesCollection,
];

export const createDb = async () => {
  console.log("CREATING DB");
  const db = await createRxDatabase({
    name: "wanderlog-db",
    storage: getRxStorageDexie(),
  });
  for (const collection of collections) {
    await db.addCollections({
      [collection.name]: {
        schema: collection.schema,
        migrationStrategies: {
          1: (old) => old,
          2: (old) => old,
        },
      },
    });
  }

  return db;
};

export let dbPromise: ReturnType<typeof createDb>;
export let db: Awaited<typeof dbPromise>;

export const initDB = async () => {
  if (auth.checkIsLoggedIn()) {
    if (db) {
      console.log("🚀 | db already exists");
    } else {
      console.log("Initializing DB");
      dbPromise = createDb();
      dbPromise.catch((err) => console.error(err));
      db = await dbPromise;

      // isOnlineStore.subscribe(async () => {
      //   let isOnline = isOnlineStore.getState();
      //   console.log("🚀 | isOnlineStore.subscribe | isOnline", isOnline);
      //   if (!isOnline) {
      //     replicationStates.forEach((replicationState) => {
      //       replicationState.cancel();
      //     });
      //     replicationStates = [];
      //   } else {
      //     console.log("syncing");
      //     replicationStates.forEach(async (replicationState) => {
      //       await replicationState.cancel();
      //     });
      //     replicationStates = [];
      //     for (const collection of collections) {
      //       await syncCollection(db[collection.name], collection);
      //     }
      //   }
      // });

      let isOnline = isOnlineStore.getState();
      if (isOnline) {
        console.log("syncing2");
        await Promise.all(
          replicationStates.filter(Boolean).map((replicationState) => {
            return replicationState.cancel();
          })
        );
        replicationStates = [];
        for (const collection of collections) {
          await syncCollection(db[collection.name], collection);
        }
      }
    }
  }
};

// Delete all indexedDB databases
export const wipeDatabase = async () => {
  const databases = await indexedDB.databases();
  for (const database of databases) {
    if (database?.name) {
      await indexedDB.deleteDatabase(database?.name);
    }
  }
};
