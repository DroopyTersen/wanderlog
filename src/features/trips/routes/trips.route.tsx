import { LoaderFunction, useLoaderData } from "react-router-dom";
import { MotionGrid } from "~/components";
import { AppBackgroundLayout } from "~/features/layout/AppBackground/AppBackgroundLayout";
import { DesktopPageTitle } from "~/features/layout/DesktopPageTitle";
import { NewMenu } from "~/features/layout/NewMenu/NewMenu";
import { TripCard } from "../components/TripCard";
import { tripService, useTrips } from "../trip.service";

export default function TripsRoute() {
  let trips = useTrips();
  let { tripPhotos } = useLoaderData() as any;
  return (
    <AppBackgroundLayout title="Trips">
      <DesktopPageTitle>Trips</DesktopPageTitle>
      <MotionGrid width="400px" className="mt-2 daily-logs-grid">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            {...trip}
            photos={[tripPhotos[trip.id]].filter(Boolean)}
          />
        ))}
      </MotionGrid>
      <NewMenu></NewMenu>
    </AppBackgroundLayout>
  );
}
export const loader: LoaderFunction = async () => {
  let tripPhotos = await tripService.getRandomPhotoForEachTrip();

  return {
    tripPhotos,
  };
};
