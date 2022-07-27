import { createGraphQLClient } from "./createGraphQLClient";
const ENDPOINT = import.meta.env.VITE_HASURA_ENDPOINT;

export const getHasuraUserClient = (token: string) => {
  return createGraphQLClient(ENDPOINT, {
    ensureToken: () => Promise.resolve(token),
  });
};
