import { client } from "global/UrqlProvider"
import { cacheCurrentUser, getCurrentUserFromCache } from "./auth.utils";

const STATIC_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImYzZTU4ZjQ2LWY4ZWYtNDdiMC04MzIxLTAwZTY4ZmY3NGYyMCIsImlhdCI6MTYwNTgyMDg2MiwiZXhwIjoxNjA1ODI0NzUwLCJYLUhBU1VSQS1ST0xFIjoidXNlciIsIlgtSEFTVVJBLVVTRVJfSUQiOiJuYXRhbmRkcmV3In0.JRFVfInXLw76rKtbz5NrgDSXSzhW5UmYdELdot_1qWw";

export const login = async ({ username, password }) => {
console.log("username", username)

  cacheCurrentUser({
    token: STATIC_TOKEN,
    username,
    role: "user",
  })
  return getCurrentUser();
};

const GET_USER_QUERY = `
    query currentUser($username: String!) {
        user : users_by_pk(username: $username) {
          email
          imageUrl
          name
          role
          username
        }
    }
`;

export const getCurrentUser = () => {
    let user = getCurrentUserFromCache();
    if (!user) throw new Error("User is not logged in");
    return getUser(user.username);
}

export const getUser = async (username) => {
    console.log("getUser -> username", username)
    let { data, error }  = await client.query(GET_USER_QUERY, {
        username
    }).toPromise()

    if (error) {
      console.error("Error getting user", error);
      throw error
    } else if (data.user) {
      return data.user;
    }
};
