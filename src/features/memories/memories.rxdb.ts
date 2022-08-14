import type { RxJsonSchema } from "rxdb";
import zodToJsonSchema from "zod-to-json-schema";
import { RxCollectionDefinition } from "~/database/database.types";
import { memorySchema } from "./memory.types";

const schema: RxJsonSchema<any> = {
  title: "Memories",
  version: 1,
  primaryKey: "id",
  ...(zodToJsonSchema(memorySchema, "Memory").definitions.Memory as any),
  additionalProperties: false,
};

const PULL_QUERY = `query GetLatestMemories($lastSync:timestamptz!, $batchSize:Int) {
  memories(where:{updatedAt:{_gt:$lastSync}} limit: $batchSize orderBy: [{ sortOrder: asc, createdAt:asc}]) {
    id
    tripId
    date
    content
    createdById
    createdAt
    updatedAt
    deleted
    sortOrder
  }
}`;

const PUSH_QUERY = `mutation UpsertMemories($objects: [MemoriesInsertInput!]!) {
  insertMemories(objects: $objects, onConflict: {constraint: memories_pkey, update_columns: [content, date, sortOrder, deleted, tripId, updatedAt]}) {
    returning {
      id
      tripId
      date
      content
      createdById
      createdAt
      updatedAt
      deleted
      sortOrder
    }
  }
}
`;

// const hasuraInsertSchema = baseMemorySchema.extend({
//   id: z.string(),
//   deleted: z.boolean().optional().default(false),
// });

// type HasuraInsertSchema = z.infer<typeof hasuraInsertSchema>;

const buildPushQuery = (items) => {
  console.log("🚀 | buildPushQuery | items", items);
  // let objects: HasuraInsertSchema[] = items.map(
  //   (item: MemoryDto & { deleted: boolean }) => {
  //     let object: HasuraInsertSchema = {
  //       ...item,
  //     };
  //     return object;
  //   }
  // );

  return {
    query: PUSH_QUERY,
    variables: {
      objects: items,
    },
  };
};

const buildPullQuery = async (doc) => {
  let lastSync = doc?.updatedAt || new Date(0).toUTCString();
  return {
    query: PULL_QUERY,
    variables: {
      lastSync,
      batchSize: BATCH_SIZE,
    },
  };
};
const BATCH_SIZE = 1000;

export const memoriesCollection: RxCollectionDefinition = {
  name: "memories",
  batchSize: BATCH_SIZE,
  schema,
  buildPullQuery,
  buildPushQuery,
  liveInterval: 8000,
};
