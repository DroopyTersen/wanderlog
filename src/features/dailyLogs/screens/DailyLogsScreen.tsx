import { Grid, Loader } from "core/components";
import { useAuth } from "features/auth/auth.provider";
import { AddButton, Footer } from "global/components";
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "urql";
import { DailyLogCard } from "../components/DailyLogCard";

export const DailyLogsScreen = () => {
  let { currentUser } = useAuth();
  let [{ data, fetching, error }] = useQuery<ScreenData>({
    query: QUERY,
    variables: {
      author: currentUser.username,
    },
  });
  if (error) return <div className="error">{error}</div>;
  if (!data?.dailyLogs) return <Loader />;

  return (
    <>
      {error && <div className="error">{error}</div>}
      {data?.dailyLogs && (
        <Grid width="500px">
          {data.dailyLogs.map((item) => (
            <DailyLogCard key={item.id} dailyLog={item} trip={item?.trip} />
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
  photos: { blurred: string; thumbnail: string }[];
}
const QUERY = `
query GetMyDailyLogs($author: String!) {
  dailyLogs: dailylogs(where: {author_id: {_eq: $author}} order_by: {date: desc}) {
    id
    date
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
      blurred
    }
    trip {
      id
      start
      end
      title
    }
  }
}
   
`;
