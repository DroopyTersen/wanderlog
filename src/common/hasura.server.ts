import {
  createGraphQLClient,
  GqlClient,
  GqlRequest,
} from "./createGraphQLClient";

const ENDPOINT = process.env.VITE_HASURA_ENDPOINT;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

export const getHasuraAdminClient = (): GqlClient => {
  return createGraphQLClient(ENDPOINT, {
    staticHeaders: {
      "x-hasura-admin-secret": ADMIN_SECRET,
    },
  });
};

export const getHasuraUserClient = (token: string) => {
  return createGraphQLClient(ENDPOINT, {
    ensureToken: () => Promise.resolve(token),
  });
};
export const hasuraAdminRequest: GqlRequest = (...args) =>
  getHasuraAdminClient().request(...args);
