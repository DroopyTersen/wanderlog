import { BigMonth, Grid, PageTitle, TagsDisplay } from "core/components";
import { calcNumDays, displayDate, displayDateRange } from "core/utils";
import dayjs from "dayjs";
import { DailyLogCard } from "features/dailyLogs/components/DailyLogCard";
import { AddButton, Footer } from "global/components";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";

function useDelete(id) {
  let navigate = useNavigate();
  let [deleteResult, deleteMutation] = useMutation(DELETE_MUTATION);
  useEffect(() => {
    if (deleteResult?.data?.delete_trips) {
      navigate("/trips");
    }
  }, [deleteResult.data]);

  return [() => deleteMutation({ id }, {}), deleteResult.fetching] as [() => void, boolean];
}

export const TripDetailsScreen = () => {
  let { tripId } = useParams();
  let [deleteTrip, isDeleting] = useDelete(tripId);

  let [{ data, fetching, error }] = useQuery({
    query: QUERY,
    variables: { id: tripId },
    pause: !tripId,
  });
  let trip = data?.trip || null;

  return (
    <div className="trip trip-details">
      {error && <div className="error">{error}</div>}
      {trip && (
        <>
          <PageTitle className="trip-title greedy">{trip.title}</PageTitle>
          <div className="row space-between date-row">
            <div className="trip-dates">
              <div className="num-days">
                <span>{calcNumDays(trip.start, trip.end)}</span> days
              </div>
              <div className="date">{displayDateRange(trip.start, trip.end)}</div>
            </div>
            <BigMonth date={trip.start} />
          </div>
          {/* <div className="destination">{trip.destination || "Destination Unknown"}</div> */}
          {/* {!!trip.tags.length && <TagsDisplay tags={trip.tags} />} */}

          <section className="daily-logs">
            <Grid width="400px" className="daily-logs-grid" gap="20px">
              {trip.dailyLogs.map((dailyLog) => (
                <DailyLogCard key={dailyLog.id} dailyLog={dailyLog} trip={trip} />
              ))}
            </Grid>
          </section>

          <Footer>
            <button className="scary" onClick={deleteTrip} disabled={isDeleting}>
              Delete
            </button>

            <Link to={`/trips/${trip.id}/edit`}>
              <button disabled={isDeleting} className="gold">
                Edit
              </button>
            </Link>
            <AddButton>
              <Link to={"/places/new?tripId=" + trip.id}>Place</Link>
              <Link to={"/photos/new?tripId=" + trip.id}>Photo</Link>
              <Link to={`/trips/${trip.id}/dailylogs/new`}>Daily Log</Link>
            </AddButton>
          </Footer>
        </>
      )}
    </div>
  );
};

export const QUERY = `
query getTripById($id: Int!) {
  trip: trips_by_pk(id: $id) {
    id
    title
    start
    end
    destination
    tags {
      tag_id
      trip_id
      tag {
        name
        id
      }
    }
    dailyLogs(order_by: {date: asc}) {
      id
      date
      memories
      tags {
        tag_id
        dailylog_id
        tag {
          name
          id
        }
      }
      photos(order_by: {date: desc, created_at: desc}) {
        id
        thumbnail
        url
      }
    }
  }
}
  `;

export const DELETE_MUTATION = `
mutation DeleteTrip($id:Int!) {
  delete_tag_trip(where: {trip_id: {_eq: $id }}) {
    affected_rows
  }
  delete_trips(where: {id: {_eq: $id }}) {
    affected_rows
    returning {
      id
    }
  }
}
`;
