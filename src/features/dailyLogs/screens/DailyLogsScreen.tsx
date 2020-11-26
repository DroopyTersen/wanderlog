import { Grid } from "core/components";
import { AddButton, Footer } from "global/components";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import { DailyLogCard } from "../components/DailyLogCard";

export const DailyLogsScreen = () => {
  let [{ data, fetching, error }] = useQuery<ScreenData>({ query: QUERY });
  return (
    <>
      {error && <div className="error">{error}</div>}
      {data?.dailyLogs && (
        <Grid width="500px">
          {data.dailyLogs.map((item) => (
            <DailyLogCard key={item.id} dailyLog={item} trip={data?.trip} />
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

interface ScreenData {
  dailyLogs: any[];
  trip: {
    id: number;
    title: string;
    start: string;
  };
}
const QUERY = `
query getDailyLogsByTrip($tripId:Int!) {
    dailyLogs:dailylogs_by_trip(args: {trip_id: $tripId}) {
      author {
        username
        imageUrl
        name
      }
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
    }
    trip: trips_by_pk(id: $tripId) {
      id
      title
      start
    }
  }    
`;
