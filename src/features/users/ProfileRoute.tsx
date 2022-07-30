import { useLoaderData, useParams } from "react-router-dom";
import { findOneEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { userSchema } from "~/features/users/user.types";
import { auth } from "../auth/auth.client";

const currentUser = auth.getCurrentUser();

export default function UsersRoute() {
  let { userId } = useParams();
  const canEdit = userId === currentUser?.id + "";
  let user = useLoaderData();
  console.log("🚀 | UsersRoute | user", user);
  console.log("🚀 | UsersRoute | canEdit", canEdit);
  return (
    <div>
      <h1>Profile</h1>
      <div></div>
    </div>
  );
}
const getUserQuery = (userId) =>
  db.users.find({
    selector: {
      id: userId + "",
    },
  });

export const loader = async ({ params }) => {
  let user = await findOneEntity(getUserQuery(params.userId), userSchema);
  return {
    user,
  };
};
