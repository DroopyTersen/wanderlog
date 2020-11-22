import { Grid } from "core/components";
import { AddButton, Footer } from "global/components";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import { TripCard } from "./TripCard";

const QUERY = `
query getTrips {
    trips(order_by: {end: desc, title: asc}) {
        id
        title
        destination
        start
        end
        tags {
            tag {
                name
                id
            }
        }
    }
}   
`;

export const TripsScreen = () => {
  let [{ data, fetching, error }] = useQuery({ query: QUERY });
  return (
    <>
      {error && <div className="error">{error}</div>}
      {data?.trips && (
        <Grid width="500px">
          {data.trips.map((trip) => (
            <TripCard {...trip} />
          ))}
        </Grid>
      )}
      <Footer>
        <AddButton>
          <Link to="/places/new">Place</Link>
          <Link to="/photos/new">Photo</Link>
          <Link to="/dailylogs/new">Daily Log</Link>
        </AddButton>
      </Footer>
    </>
  );
};
