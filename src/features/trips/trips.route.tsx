import { queryEntity, useEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { AppBackground } from "../layout/AppBackground/AppBackground";
import { TripCard } from "./components/TripCard";
import { TripItem, tripSchema } from "./trip.types";

export default function TripsRoute() {
  let trips = useTrips();

  return (
    <>
      <AppBackground variant="blurred" />
      <div className="pt-[var(--safeContentTop)] px-2 sm:px-4">
        <h1 className="app-title text-5xl my-4">Trips</h1>
        <div>
          {trips.map((trip) => (
            <TripCard key={trip.id} {...trip} dailyLogCount={0} />
          ))}
        </div>
      </div>
    </>
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
