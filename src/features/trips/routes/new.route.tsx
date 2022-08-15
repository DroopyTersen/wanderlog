import { ActionFunction, redirect } from "react-router-dom";
import { AppBackgroundLayout } from "../../layout/AppBackground/AppBackgroundLayout";
import { useAllUsers } from "../../users/user.service";
import { TripForm } from "../components/TripForm";
import { tripService } from "../trip.service";
import { tripSaveSchema } from "../trip.types";

export default function NewTripRoute() {
  let users = useAllUsers();
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
  await tripService.insert(saveTripInput);

  return redirect("/trips/" + saveTripInput.id);
};
