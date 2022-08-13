import { queryEntity, useCollection } from "~/database/data.helpers";
import { db } from "~/database/database";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { Header } from "../layout/Header/Header";
import { NewMenu } from "../layout/NewMenu/NewMenu";
import { TripCard } from "./components/TripCard";
import { TripItem, tripSchema } from "./trip.types";

export default function TripsRoute() {
  let trips = useTrips();

  return (
    <AppBackgroundLayout>
      <Header back="/">Trips</Header>
      <div className="pt-11">
        {trips.map((trip) => (
          <TripCard key={trip.id} {...trip} dailyLogCount={0} />
        ))}
      </div>
      <NewMenu />
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
  const trips = useCollection(getAllTripsQuery(), "trips", tripSchema);
  return trips;
};

export const loader = async () => {
  let trips = await queryEntity(getAllTripsQuery(), tripSchema);
  return {
    trips,
  };
};
