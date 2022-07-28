import { queryEntity, useEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { UserSchema } from "~/features/users/user.types";

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
const useUsers = () => useEntity(getAllUsersQuery(), "users", UserSchema);

export const loader = async () => {
  let users = await queryEntity(getAllUsersQuery(), UserSchema);
  return {
    users,
  };
};
