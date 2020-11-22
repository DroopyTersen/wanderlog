import { BigMonth, PageTitle, TagsDisplay } from "core/components";
import { calcNumDays, displayDate, displayDateRange } from "core/utils";
import dayjs from "dayjs";
import { AddButton, Footer } from "global/components";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { DELETE_TRIP_MUTATION, GET_TRIP_BY_ID_QUERY } from "./trips.mutations";

function useDelete(id) {
  let navigate = useNavigate();
  let [deleteResult, deleteMutation] = useMutation(DELETE_TRIP_MUTATION);
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
    query: GET_TRIP_BY_ID_QUERY,
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
          <div className="destination-tags">
            {trip.destination && <div className="destination">{trip.destination}</div>}
            {!!trip.tags.length && <TagsDisplay tags={trip.tags.map((t) => t.tag.name)} />}
          </div>
          <Footer>
            <button className="scary" onClick={deleteTrip} disabled={isDeleting}>
              Delete
            </button>

            <Link to="edit">
              <button disabled={isDeleting} className="gold">
                Edit
              </button>
            </Link>
            <AddButton>
              <Link to={"/places/new?tripId=" + trip.id}>Place</Link>
              <Link to={"/photos/new?tripId=" + trip.id}>Photo</Link>
              <Link to={"/dailyLogs/new?tripId=" + trip.id}>Daily Log</Link>
            </AddButton>
          </Footer>
        </>
      )}
    </div>
  );
};
