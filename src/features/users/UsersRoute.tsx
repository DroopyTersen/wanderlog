import { queryCollection, useCollection } from "~/database/data.helpers";
import { db } from "~/database/database";
import { userSchema } from "~/features/users/user.types";

export default function UsersRoute() {
  let users = useUsers();
  return (
    <div>
      <h1>UsersRoute</h1>
      <ul>
        {users?.map((user) => (
          <li key={user?.id}>
            {user.username} - {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const getAllUsersQuery = () => db.users.find();
export const useUsers = () =>
  useCollection(getAllUsersQuery(), "users", userSchema);

export const loader = async () => {
  let users = await queryCollection(getAllUsersQuery(), userSchema);
  return {
    users,
  };
};
