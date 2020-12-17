import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AddButton, AppBackground, Footer } from "global/components";
import { BigDate, Grid, TagsDisplay } from "core/components";
import { useMutation, useQuery } from "urql";
import { MemoriesDisplay } from "../components/Memories";
import { PhotoUploader } from "features/photos/components/PhotoUploader";
import { PhotoGrid } from "features/photos/components/PhotoGrid";
import { motion } from "framer-motion";
import { BiEditAlt as EditIcon } from "react-icons/bi";

export default function DailyLogDetails() {
  let { tripId = 0, dailyLogId } = useParams();

  let [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: QUERY,
    variables: { id: dailyLogId },
    pause: !dailyLogId,
  });

  let dailyLog = data?.dailyLog;

  if (!dailyLog) return null;
  let trip = dailyLog?.trip || null;

  return (
    <>
      <div className="dailyLog-details">
        <motion.div variants={animationVariants} initial="fromTop" animate="visible">
          <div className="row">
            <h2 className="greedy dailyLog-title">
              <BigDate date={dailyLog.date} variant="day-date-month" className="text-shadowed" />
            </h2>
            <Link to="edit">
              <button className="icon-button">
                <EditIcon />
              </button>
            </Link>
          </div>
          {trip?.title && (
            <div className="daily-log-trip">
              <span className="day-count">
                Day {dayjs(dailyLog.date).diff(dayjs(trip.start), "day") + 1}:
              </span>
              <Link to={"/trips/" + trip?.id}>{trip.title}</Link>
            </div>
          )}
          <TagsDisplay tags={dailyLog.tags} />
        </motion.div>
        <div className="memories">
          <MemoriesDisplay memories={dailyLog.memories} />
        </div>

        <motion.section
          className="photos"
          variants={animationVariants}
          initial="fromBottom"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          <PhotoGrid
            photos={dailyLog?.photos}
            date={dailyLog?.date}
            onChange={() => reexecuteQuery()}
          />
        </motion.section>
      </div>

      <Footer>
        <AddButton>
          <p style={{ textAlign: "center", width: "100%" }}>
            Add a Place or a Photo to {dayjs(dailyLog.date).format("M/DD/YYYY")}
          </p>
          <Link to={`/places/new?date=${dailyLog?.date}`}>Place</Link>
          <Link to={`/photos/new?date=${dailyLog?.date}`}>Photo</Link>
        </AddButton>
      </Footer>
    </>
  );
}
const animationVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },
  fromTop: {
    opacity: 0,
    y: -20,
  },
  fromBottom: {
    opacity: 0,
    y: 30,
  },
};
const QUERY = `
query GetDailyLog($id: Int!) {
  dailyLog: dailylogs_by_pk(id: $id) {
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
    trip {
      id
      title
      start
      end
    }
    photos(order_by: {date: desc, created_at: desc}) {
      id
      thumbnail
      url
      date
      blurred
    }
  }
}
  `;
