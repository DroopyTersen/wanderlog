import React from "react";
import { createClient, Provider as GraphQLProvider, dedupExchange, fetchExchange } from "urql";
import { devtoolsExchange } from "@urql/devtools";
import { getCurrentUserFromCache } from "features/auth/auth.utils";
import { retryExchange } from "@urql/exchange-retry";
const schema = require("./gql.schema.json");
import { cacheExchange } from "@urql/exchange-graphcache";
// import { offlineExchange } from "@urql/exchange-graphcache";
// import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";

// const storage = makeDefaultStorage({
//   idbName: "wanderlog-urql-v1", // The name of the IndexedDB database
//   maxAge: 14, // The maximum age of the persisted data in days
// });

const cache = cacheExchange({
  schema,
  //   storage,
  keys: {
    tag_trip: (data) => `${data.tag_id}_${data.trip_id}`,
  },
  updates: {
    Mutation: {
      delete_trips: (result, args, cache, info) => {
        cache.invalidate({ __typename: "trips", id: info.variables.id + "" });
      },
    },
  },
  optimistic: {
    /* ... */
  },
});

export const client = createClient({
  url: "https://hasura.wanderlog.app/v1/graphql",
  exchanges: [devtoolsExchange, dedupExchange, cache, retryExchange({}), fetchExchange],
  fetchOptions: () => {
    let user = getCurrentUserFromCache();
    return {
      headers: {
        Authorization: user ? `Bearer ${user.token}` : "",
      },
    };
  },
});

export default function UrqlProvider({ children }) {
  return <GraphQLProvider value={client}>{children}</GraphQLProvider>;
}
