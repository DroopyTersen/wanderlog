export interface GraphQLError {
  message: string;
  path?: (string | number)[];
  locations: any[];
}

export interface GraphQLResult<T = any> {
  data?: T;
  errors?: GraphQLError[];
}
export type GqlRequest = <T = any>(
  query: string,
  variables?: any,
  returnRawResult?: boolean
) => Promise<T>;

export interface GqlClient {
  request: GqlRequest;
}

export function createGraphQLClient(
  endpoint,
  { ensureToken = () => Promise.resolve(""), staticHeaders = {} } = {}
): GqlClient {
  let request = async function (
    query,
    variables = {},
    returnRawResult = false
  ) {
    const token = await ensureToken();
    let headers = {
      "Content-Type": "application/json",
      ...staticHeaders,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    let resp = await fetch(endpoint, {
      method: "POST",
      headers,
      // spread the passed in queryOptions onto the POST body
      body: JSON.stringify({ query, variables }),
    });

    if (!resp.ok) {
      throw new Error(`GQL Request Error: ${resp.status} ${resp.statusText}`);
    }
    let result: GraphQLResult = await resp.json();
    if (returnRawResult) {
      return result;
    }
    if (result.errors) {
      console.error("🚀 | request | errors", result.errors);
      throw new Error(result.errors.map((e) => e.message).join(", "));
    }
    return result?.data;
  };

  return { request };
}
