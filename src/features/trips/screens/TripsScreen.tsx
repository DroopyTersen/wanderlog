import { MotionGrid } from "core/components";
import { useAuth } from "features/auth/auth.provider";
import { AddButton, Footer } from "global/components";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import { TripCard } from "../components/TripCard";
const QUERY = `
query getMyTrips($author: String!) {
  trips(where: {author_id: {_eq: $author}} order_by:{ end:desc}) {
    id
    title
    destination
    start
    end
    tags {
      tag_id
      trip_id
      tag {
        name
        id
      }
    }
    photos {
      id
      thumbnail
      blurred
    }
    dailyLogs_aggregate {
      aggregate {
        count
      }
    }
  }
}

`;

export const TripsScreen = () => {
  let { currentUser } = useAuth();
  let [{ data, fetching, error }] = useQuery({
    query: QUERY,
    variables: { author: currentUser?.username },
    pause: !currentUser?.username,
  });
  return (
    <>
      {error && <div className="error">{JSON.stringify(error, null, 2)}</div>}
      {data?.trips && (
        <MotionGrid width="500px" gap="5px">
          {data.trips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              dailyLogCount={trip.dailyLogs_aggregate.aggregate.count}
            />
          ))}
        </MotionGrid>
      )}
      <Footer>
        <AddButton>
          <Link to="/trips/new">Trip</Link>
          {/* <Link to="/places/new">Place</Link> */}
          <Link to="/photos/new">Photo</Link>
          <Link to="/dailylogs/new">Daily Log</Link>
        </AddButton>
      </Footer>
    </>
  );
};
