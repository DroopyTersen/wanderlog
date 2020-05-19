import React, { useState, useEffect, useRef } from "react";
import { TripModel } from "../../models";
import { Link } from "react-router-dom";
import { useSyncListener } from "../shared/useSyncListener";
import useAsyncData from "../shared/useAsyncData";

export default function TripsList() {
  let { data: trips, isLoading } = useTrips();

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

function useTrips() {
  let refreshToken = useSyncListener(["trips"]);
  return useAsyncData<TripModel[]>(TripModel.loadAll, [refreshToken], null);
}
