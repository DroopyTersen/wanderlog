import { BigDate, Grid, Loader, MotionGrid, PageTitle, TagsDisplay } from "core/components";
import { calcNumDays, displayDate, displayDateRange } from "core/utils";
import dayjs from "dayjs";
import { DailyLogCard } from "features/dailyLogs/components/DailyLogCard";
import { AddButton, Footer } from "global/components";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import { motion, AnimatePresence } from "framer-motion";

export const TripDetailsScreen = () => {
  let { tripId } = useParams();

  let [{ data, fetching, error }] = useQuery({
    query: QUERY,
    variables: { id: tripId },
    pause: !tripId,
  });
  let trip = data?.trip || null;
  if (error) return <div className="error">{error}</div>;
  if (!trip) return <Loader />;

  return (
    <motion.div className="trip trip-details">
      <motion.div layoutId={`trip-title-${trip.id}`}>
        <PageTitle className="trip-title greedy">{trip.title}</PageTitle>
      </motion.div>
      <div className="row space-between date-row">
        <div className="trip-dates">
          <div className="num-days">
            <span>{calcNumDays(trip.start, trip.end)}</span> days
          </div>
          <div className="date">{displayDateRange(trip.start, trip.end)}</div>
        </div>
        <BigDate variant="month" date={trip.start} />
      </div>
      {/* <div className="destination">{trip.destination || "Destination Unknown"}</div> */}
      {/* {!!trip.tags.length && <TagsDisplay tags={trip.tags} />} */}

      <section className="daily-logs">
        <MotionGrid width="400px" className="daily-logs-grid" gap="15px">
          {trip.dailyLogs.map((dailyLog) => (
            <DailyLogCard
              key={dailyLog.id}
              dailyLog={dailyLog}
              trip={trip}
              getLink={({ id }) => `dailylogs-${id}`}
            />
          ))}
        </MotionGrid>
      </section>

      {/* <section className="photos">
        <PhotoGrid photos={trip?.photos} />
      </section> */}

      <Footer>
        <Link to={`/trips/${trip.id}/edit`}>
          <button className="gold">Edit</button>
        </Link>
        <AddButton>
          <Link to={"/places/new?tripId=" + trip.id}>Place</Link>
          <Link to={"/photos/new?tripId=" + trip.id}>Photo</Link>
          <Link to={`/trips/${trip.id}/dailylogs-new`}>Daily Log</Link>
        </AddButton>
      </Footer>
    </motion.div>
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
        blurred
      }
    }
  }
}
  `;
