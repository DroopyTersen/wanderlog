import { queryCollection, useCollection } from "~/database/data.helpers";
import { db } from "~/database/database";
import { userSchema } from "./user.types";

export const userQueries = {
  getAll: () =>
    db.users.find({
      sort: [
        {
          name: "asc",
        },
      ],
    }),
};

export const useAllUsers = () => {
  return useCollection(
    userQueries.getAll(),
    (r) => r?.data?.allUsers,
    userSchema
  );
};

export const userService = {
  getAll: () => {
    return queryCollection(userQueries.getAll(), userSchema);
  },
};
