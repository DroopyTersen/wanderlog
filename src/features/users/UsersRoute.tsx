import { useAllUsers } from "./user.service";

export default function UsersRoute() {
  let users = useAllUsers();
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
