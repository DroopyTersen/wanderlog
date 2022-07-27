import { useLoaderData } from "react-router-dom";
import { db } from "~/database/database";
import { User, UserSchema } from "~/features/users/user.types";
export default function UsersRoute() {
  let data = (useLoaderData() as { users: User[] }) || { users: [] };
  return (
    <div>
      <h1>UsersRoute</h1>
      <ul>
        {data?.users?.map((user) => (
          <li key={user?.id}>
            {user.username} - {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const loader = async () => {
  let docs: any[] = await db?.users.find().exec();
  let users: User[] = docs.map((doc) => {
    return UserSchema.parse(doc);
  });
  return {
    users,
  };
};
