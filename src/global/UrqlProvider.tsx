import React from "react";
import { createClient, Provider as GraphQLProvider, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { devtoolsExchange } from "@urql/devtools";
import { getCurrentUserFromCache } from "features/auth/auth.utils";
import { retryExchange } from "@urql/exchange-retry";

export const client = createClient({
  url: "https://hasura.wanderlog.app/v1/graphql",
  exchanges: [devtoolsExchange, dedupExchange, cacheExchange({}), retryExchange({}), fetchExchange],
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
