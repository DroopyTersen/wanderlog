import { ActionFunction, redirect } from "react-router-dom";
import { queryCollection } from "~/database/data.helpers";
import { db } from "~/database/database";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { userSchema } from "../users/user.types";
import { useUsers } from "../users/UsersRoute";
import { TripForm } from "./components/TripForm";
import { tripSaveSchema } from "./trip.types";
import { tripMutations } from "./trips.data";

export default function NewTripRoute() {
  let users = useUsers();
  return (
    <AppBackgroundLayout back="/trips" title="New Trip">
      <TripForm users={users} />
    </AppBackgroundLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let companions = formData.getAll("companions");
  let saveTripInput = tripSaveSchema.parse({
    ...Object.fromEntries(formData),
    companions: companions.map((userId) => ({ userId })),
  });
  await tripMutations.insert(saveTripInput);

  return redirect("/trips/" + saveTripInput.id);
};

export const loader = async () => {
  let users = await queryCollection(db.users.find(), userSchema);
  return {
    users,
  };
};
