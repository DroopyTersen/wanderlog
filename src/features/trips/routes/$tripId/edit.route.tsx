import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { DeleteButton } from "~/components/modal/DeleteButton";
import { DesktopPageTitle } from "~/features/layout/DesktopPageTitle";
import { AppBackgroundLayout } from "../../../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../../../layout/AppErrorBoundary/AppErrorBoundary";
import { useAllUsers } from "../../../users/user.service";
import { TripForm } from "../../components/TripForm";
import { tripService } from "../../trip.service";
import { TripDto, tripSaveSchema } from "../../trip.types";

export default function EditTripRoute() {
  let users = useAllUsers();
  let { trip } = useLoaderData() as { trip: TripDto };
  return (
    <AppBackgroundLayout back="/trips" title="Edit Trip">
      <DesktopPageTitle>Edit Trip</DesktopPageTitle>
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
    await tripService.update(saveTripInput);

    return redirect("/trips/" + saveTripInput.id);
  } else if (request.method === "DELETE") {
    console.log("DELETING");
    await tripService.remove(params.tripId + "");
    return redirect("/trips");
  }

  return redirect("/trips");
};

export const loader: LoaderFunction = async ({ params }) => {
  let trip = await tripService.getById(params.tripId + "");
  console.log("🚀 | constloader:LoaderFunction= | trip", trip);
  return {
    trip,
  };
};
export const errorElement = (
  <AppBackgroundLayout back="/trips" title="Edit Trip">
    <AppErrorBoundary />
  </AppBackgroundLayout>
);
