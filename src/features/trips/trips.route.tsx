import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { NewMenu } from "../layout/NewMenu/NewMenu";
import { TripCard } from "./components/TripCard";
import { useTrips } from "./trip.service";

export default function TripsRoute() {
  let trips = useTrips();

  return (
    <AppBackgroundLayout title="Trips">
      {trips.map((trip) => (
        <TripCard key={trip.id} {...trip} dailyLogCount={0} />
      ))}
      <NewMenu />
    </AppBackgroundLayout>
  );
}
