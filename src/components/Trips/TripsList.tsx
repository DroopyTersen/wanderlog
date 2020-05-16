import React from "react";
import useAsyncData from "../../core/hooks/useAsyncData";
import { TripModel } from "../../models";
import { Link } from "react-router-dom";

export default function TripsList() {
  let { data: trips, isLoading } = useAsyncData<TripModel[]>(TripModel.loadAll, [], null);

  if (isLoading) return null;

  return (
    <div>
      <ul>
        {trips?.map((trip) => {
          return (
            <li key={trip.item.id}>
              <Link to={trip.item.id}>{trip.item.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
