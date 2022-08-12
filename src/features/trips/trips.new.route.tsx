import { ActionFunction, redirect } from "react-router-dom";
import { generateId } from "~/common/utils";
import { queryEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { auth } from "../auth/auth.client";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { userSchema } from "../users/user.types";
import { useUsers } from "../users/UsersRoute";
import { TripForm } from "./components/TripForm";
import { tripSaveSchema } from "./trip.types";

export default function NewTripRoute() {
  let users = useUsers();
  return (
    <AppBackgroundLayout title="New Trip">
      <TripForm users={users} />
    </AppBackgroundLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let companions = formData.getAll("companions");
  console.log("🚀 | constaction:ActionFunction= | companions", companions);
  let saveTripInput = tripSaveSchema.parse({
    ...Object.fromEntries(formData),
    companions: companions.map((userId) => ({ userId })),
  });
  if (!saveTripInput.id) {
    saveTripInput.id = generateId();
  }

  db.trips.insert({
    ...saveTripInput,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdById: auth.getCurrentUser()?.id,
    updatedById: auth.getCurrentUser()?.id,
  });

  return redirect("/trips/" + saveTripInput.id);
};

export const loader = async () => {
  let users = await queryEntity(db.users.find(), userSchema);
  return {
    users,
  };
};
