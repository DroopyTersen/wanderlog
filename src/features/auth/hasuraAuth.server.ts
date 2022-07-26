import { User } from "~/common/types";
import jwt from "jsonwebtoken";
const ROLE = "user";

export const createJWT = (user: User) => {
  let claims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [ROLE],
      "x-hasura-default-role": ROLE,
      "x-hasura-user-id": user.id,
    },
    user,
  };
  var token = jwt.sign(claims, process.env.JWT_SECRET, {
    noTimestamp: true,
  });
  return token;
};
