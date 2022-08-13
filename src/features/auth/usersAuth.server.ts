import bcrypt from "bcryptjs";
import "isomorphic-fetch";

import { hasuraAdminRequest } from "~/common/hasura.server";
import { generateId } from "~/common/utils";
import { User } from "~/features/users/user.types";

export const verifyCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  let data = await hasuraAdminRequest<{ users: any[] }>(
    QUERY_USER_BY_USERNAME,
    { username }
  );
  if (!data.users.length) {
    return null;
  }
  if (data.users.length > 1) {
    throw new Error("Multiple users with the same username");
  }
  let user = data.users[0];
  let isValid = await bcrypt.compare(password, user.password);
  return isValid
    ? {
        id: user.id,
        username: user.username,
        name: user.name,
      }
    : null;
};

const QUERY_USER_BY_USERNAME = `query GetUserByUsername($username: String!) {
  users(where: {username: { _eq:$username}}) {
    id
    username
    password
    name
  }
}`;

export const createUser = async (
  username: string,
  password: string,
  name?: string
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await hasuraAdminRequest<{ user: User }>(
    MUTATION_INSERT_USER,
    {
      username,
      id: generateId(),
      password: hashedPassword,
      name: name || username,
    }
  );
  return result?.user;
};

const MUTATION_INSERT_USER = `mutation InsertUser($username:String!, $password:String!, $name:String!, $id:String!) {
  user: insertUsersOne(object: {
    username:$username,
    password:$password,
    name: $name,
    id: $id
  }) {
    id
    username
    name
  }
}
`;
