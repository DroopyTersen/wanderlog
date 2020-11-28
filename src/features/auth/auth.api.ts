import { client } from "global/providers/UrqlProvider";
import { cacheCurrentUser, getCurrentUserFromCache } from "./auth.utils";

export const login = async ({ username, password }) => {
  console.log("username", username);
  let resp = await fetch("/.netlify/functions/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  let data = await resp.json();
  if (resp.ok) {
    cacheCurrentUser(data);
    let user = await getCurrentUser();
    console.log("user", data, user);
    return {
      ...data,
      ...user,
    };
  } else {
    throw new Error(data?.message || "Please try again.");
  }
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
};

export const getUser = async (username) => {
  console.log("getUser -> username", username);
  let { data, error } = await client
    .query(GET_USER_QUERY, {
      username,
    })
    .toPromise();

  if (error) {
    console.error("Error getting user", error);
    throw error;
  } else if (data.user) {
    return data.user;
  }
};
