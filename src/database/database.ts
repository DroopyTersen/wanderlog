import { addRxPlugin, createRxDatabase, RxCollection } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBReplicationGraphQLPlugin } from "rxdb/plugins/replication-graphql";
import { auth } from "~/features/auth/auth.client";
import { usersCollection } from "~/features/users/users.rxdb";
import { RxCollectionDefinition } from "./database.types";

addRxPlugin(RxDBReplicationGraphQLPlugin);
const GRAPHQL_ENDPOINT = import.meta.env.VITE_HASURA_ENDPOINT;
console.log("🚀 | GRAPHQL_ENDPOINT", GRAPHQL_ENDPOINT);

const syncCollection = async (
  collection: RxCollection,
  collectionDefinition: RxCollectionDefinition
) => {
  let replicationState = collection.syncGraphQL({
    url: GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `Bearer ${auth.getAccessToken()}`,
    },
    pull: {
      modifier: (doc) => {
        console.log("🚀 | doc", doc);
        doc.id = doc.id + "";
        return doc;
      },
      queryBuilder: collectionDefinition.buildPullQuery,
      batchSize: 5,
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
  console.log("REP STATE IS STOPPED", replicationState.isStopped());
  // return await replicationState.awaitInitialReplication();
};

let collections: RxCollectionDefinition[] = [usersCollection];
export const createDb = async () => {
  const db = await createRxDatabase({
    name: "wanderlog-db",
    storage: getRxStorageDexie(),
  });
  for (const collection of collections) {
    await db.addCollections({
      [collection.name]: { schema: collection.schema },
    });
    await syncCollection(db[collection.name], collection);
  }

  return db;
};

export let dbPromise: ReturnType<typeof createDb> = null;
export let db: Awaited<typeof dbPromise> = null;

export const initDB = async () => {
  if (auth.checkIsLoggedIn()) {
    if (db) {
      console.log("🚀 | db already exists");
    } else {
      console.log("Initializing DB");
      dbPromise = createDb();
      db = await dbPromise;
    }
  }
};
