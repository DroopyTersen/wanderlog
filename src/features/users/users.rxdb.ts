import type { RxJsonSchema } from "rxdb";
import { RxCollectionDefinition } from "~/database/database.types";

const schema: RxJsonSchema<any> = {
  title: "User Schema",
  description: "User schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    username: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
  required: ["id", "username"],
  indexes: ["id", "username"],
};

const buildPullQuery = async (doc) => {
  let lastSync = doc?.updatedAt || new Date(0).toUTCString();
  const query = `query GetLatestUsers($lastSync: timestamptz!) {
  users(where:{updatedAt:{ _gt: $lastSync }} limit: 5) {
    id
    username
    name
    updatedAt
  }
}`;
  console.log({
    query,
    variables: {
      lastSync,
    },
  });
  return {
    query,
    variables: {
      lastSync,
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
      users: items,
    },
  };
};
export const usersCollection: RxCollectionDefinition = {
  name: "users",
  liveInterval: 60 * 1000,
  schema,
  buildPullQuery,
  buildPushQuery,
};
