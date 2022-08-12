import { queryEntity, useEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { TripCard } from "./components/TripCard";
import { TripItem, tripSchema } from "./trip.types";

export default function TripsRoute() {
  let trips = useTrips();

  return (
    <AppBackgroundLayout title="Trips">
      <div>
        {trips.map((trip) => (
          <TripCard key={trip.id} {...trip} dailyLogCount={0} />
        ))}
      </div>
    </AppBackgroundLayout>
  );
}

const getAllTripsQuery = () =>
  db.trips.find({
    sort: [
      {
        start: "desc",
      },
    ],
  });
const useTrips = (): TripItem[] => {
  const trips = useEntity(getAllTripsQuery(), "trips", tripSchema);
  return trips;
};

export const loader = async () => {
  let trips = await queryEntity(getAllTripsQuery(), tripSchema);
  return {
    trips,
  };
};
