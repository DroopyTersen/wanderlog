import { queryCollection, useCollection } from "~/database/data.helpers";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { NewMenu } from "../layout/NewMenu/NewMenu";
import { TripCard } from "./components/TripCard";
import { TripItem, tripSchema } from "./trip.types";
import { tripQueries } from "./trips.data";

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

const useTrips = (): TripItem[] => {
  const trips = useCollection(tripQueries.getAll(), "trips", tripSchema);
  return trips;
};

export const loader = async () => {
  let trips = await queryCollection(tripQueries.getAll(), tripSchema);
  return {
    trips,
  };
};
