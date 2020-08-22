import React from "react";
import { TripModel, DailyLogModel } from "../../models";
import { Link, useParams } from "react-router-dom";
import { useSyncListener } from "../shared/useSyncListener";
import dayjs from "dayjs";
import { displayDate } from "../../core/utils";
import useAsyncData from "../hooks/useAsyncData";
import { HightlightsDisplay } from "../DailyLogs/highlights";
import Grid from "../components/Grid";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";

export default function TripDetails() {
  let { tripId } = useParams();
  let { trip, dailyLogs } = useTrip(tripId);
  if (!trip) return null;

  return (
    <div>
      <h2>{trip?.item.title}</h2>
      <div className="row space-between">
        <div>
          <div>{trip.item.destination}</div>
          <div>
            {displayDate(trip.item.start)} to {displayDate(trip.item.end)}
          </div>
        </div>
        <div className="row align-right">
          <Link to="dailyLogs/new">+ Daily Log</Link>
          <Link to="edit">Edit Trip</Link>
        </div>
      </div>
      <h3>Daily Logs</h3>

      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr)",
        }}
      >
        {dailyLogs?.map((dailyLog) => (
          <DailyLogCard key={dailyLog.item.id} dailyLog={dailyLog} />
        ))}
      </div>

      <Grid>
        {trip.photos.map((photo) => (
          <img src={getCloudinaryImageUrl(photo.item.publicId)} />
        ))}
      </Grid>
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

function DailyLogCard({ dailyLog }: { dailyLog: DailyLogModel }) {
  return (
    <Link to={"dailyLogs/" + dailyLog.item.id}>
      <div className="card">
        <div style={{ display: "grid", gap: "1px", gridTemplateColumns: "1fr 1fr 1fr" }}>
          <img
            src="/images/mountains.png"
            alt="DailyLog Photo"
            style={{ height: "130px", objectFit: "cover", width: "100%" }}
          />
          <img
            src="/images/mountains.png"
            alt="DailyLog Photo"
            style={{ height: "130px", objectFit: "cover", width: "100%" }}
          />
          <img
            src="/images/mountains.png"
            alt="DailyLog Cover Photo"
            style={{ height: "130px", objectFit: "cover", width: "100%" }}
          />
        </div>

        <div className="card-body">
          <h4 className="card-title">{dailyLog.title}</h4>
          <h5
            className="card-subtitle"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Places will go here</span>
          </h5>
          <p className="card-text">
            <HightlightsDisplay highlights={dailyLog.item.highlights} />
          </p>
        </div>
      </div>
    </Link>
  );
}
