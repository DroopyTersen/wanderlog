import { getCurrentUserFromCache } from "features/auth/auth.utils";
import React from "react";
import { createClient, Provider as GraphQLProvider } from "urql";


export const client = createClient({
    url: "https://hasura.wanderlog.app/v1/graphql",
    fetchOptions: () => {
        let user = getCurrentUserFromCache();
        return {
            headers: {
                "Authorization": user ? `Bearer ${user.token}` : ""
            }
        }
    }
  })

export default function UrqlProvider({ children }) {
    return <GraphQLProvider value={client}>
        {children}
    </GraphQLProvider>
}
