import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { DeleteButton } from "~/components/modal/DeleteButton";
import { findOneEntity, queryCollection } from "~/database/data.helpers";
import { db } from "~/database/database";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../layout/AppErrorBoundary/AppErrorBoundary";
import { userSchema } from "../users/user.types";
import { useUsers } from "../users/UsersRoute";
import { TripForm } from "./components/TripForm";
import { TripItem, tripSaveSchema, tripSchema } from "./trip.types";
import { tripMutations, tripQueries } from "./trips.data";

export default function NewTripRoute() {
  let users = useUsers();
  let { trip } = useLoaderData() as { trip: TripItem };
  return (
    <AppBackgroundLayout back="/trips" title="Edit Trip">
      <TripForm users={users} initial={trip} />
      <div>
        <DeleteButton method="delete" formData={{ id: trip?.id }}>
          Delete Trip
        </DeleteButton>
      </div>
    </AppBackgroundLayout>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  let formData = await request.formData();
  console.log("ACTION", request.method);
  if (request.method === "POST") {
    let companions = formData.getAll("companions");
    let saveTripInput = tripSaveSchema.parse({
      ...Object.fromEntries(formData),
      companions: companions.map((userId) => ({ userId })),
    });
    await tripMutations.update(saveTripInput);

    return redirect("/trips/" + saveTripInput.id);
  } else if (request.method === "DELETE") {
    console.log("DELETING");
    await tripMutations.remove(params.tripId + "");
    return redirect("/trips");
  }

  return redirect("/trips");
};

export const loader: LoaderFunction = async ({ params }) => {
  let users = await queryCollection(db.users.find(), userSchema);
  let trip = await findOneEntity(
    tripQueries.getById(params.tripId + ""),
    tripSchema
  );
  return {
    users,
    trip,
  };
};
export const errorElement = (
  <AppBackgroundLayout back="/trips" title="Edit Trip">
    <AppErrorBoundary />
  </AppBackgroundLayout>
);
