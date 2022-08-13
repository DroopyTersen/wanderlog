import type { RxJsonSchema } from "rxdb";
import zodToJsonSchema from "zod-to-json-schema";
import { parseRxDocs } from "~/database/data.helpers";
import { RxCollectionDefinition } from "~/database/database.types";
import { userSchema } from "./user.types";

export const userJsonSchema: any = zodToJsonSchema(userSchema, "user")
  .definitions.user;

const schema: RxJsonSchema<any> = {
  title: "User Schema",
  description: "User schema",
  version: 1,
  primaryKey: "id",
  ...userJsonSchema,
  indexes: ["id", "username"],
};

const buildPullQuery = async (doc) => {
  let lastSync = doc?.updatedAt || new Date(0).toUTCString();
  const query = `query GetLatestUsers($lastSync: timestamptz!, $batchSize: Int!) {
  users(where:{updatedAt:{ _gt: $lastSync }}, limit: $batchSize) {
    id
    username
    name
    updatedAt
  }
}`;

  return {
    query,
    variables: {
      lastSync,
      batchSize: BATCH_SIZE,
    },
  };
};

const buildPushQuery = (items) => {
  const query = `mutation UpsertUsers($users:[UsersInsertInput!]!) {
  insertUsers(objects: $users, onConflict: { constraint: Users_pkey, update_columns: [name,username,deleted] }) {
    returning {
      id
      name
      username
      updatedAt
    }
  }`;

  return {
    query,
    variables: {
      users: parseRxDocs(items, userSchema),
    },
  };
};
const BATCH_SIZE = 100;
export const usersCollection: RxCollectionDefinition = {
  name: "users",
  liveInterval: 60 * 1000,
  schema,
  buildPullQuery,
  buildPushQuery,
  batchSize: BATCH_SIZE,
};
