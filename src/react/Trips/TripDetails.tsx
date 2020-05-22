import React from "react";
import { TripModel, DailyLogModel } from "../../models";
import { Link, useParams } from "react-router-dom";
import { useSyncListener } from "../shared/useSyncListener";
import dayjs from "dayjs";
import { displayDate } from "../../core/utils";
import useAsyncData from "../shared/useAsyncData";
import { LinkButton } from "../global/Header/Header";

export default function TripDetails() {
  let { id } = useParams();
  let { trip, dailyLogs } = useTrip(id);
  if (!trip) return null;

  return (
    <div>
      <h2>{trip?.item.title}</h2>
      <div>{trip.item.destination}</div>
      <div>
        {displayDate(trip.item.start)} to {displayDate(trip.item.end)}
      </div>
      <div>
        <LinkButton to="dailyLogs/new">+ Daily Log</LinkButton>
        <LinkButton to="edit">Edit Trip</LinkButton>
      </div>
      <h3>Daily Logs</h3>
      <ul>
        <li>
          <LinkButton to="/dailyLogs/new">+ Daily Log</LinkButton>
        </li>
        {dailyLogs.map((dailyLog) => (
          <li key={dailyLog.item.id}>
            <Link to={"dailyLogs/" + dailyLog.item.id}>{displayDate(dailyLog.item.date)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useTrip(tripId) {
  let refreshToken = useSyncListener(["dailyLogs", "trips"]);
  let { data: trip, isLoading } = useAsyncData<TripModel>(
    TripModel.load,
    [tripId, refreshToken],
    null
  );
  let { data: dailyLogs } = useAsyncData<DailyLogModel[]>(
    DailyLogModel.loadByTrip,
    [tripId, refreshToken],
    []
  );

  return {
    trip,
    dailyLogs,
  };
}
