import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AddButton, AppBackground, Footer } from "global/components";
import { Grid, TagsDisplay } from "core/components";
import { useMutation, useQuery } from "urql";
import { MemoriesDisplay } from "../components/Memories";
import { PhotoUploader } from "features/photos/components/PhotoUploader";
import { PhotoGrid } from "features/photos/components/PhotoGrid";

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
        <h2 className="dailyLog-title">
          <span className="day">{dayjs(dailyLog.date).format("ddd")}</span>
          <span className="date">{dayjs(dailyLog.date).format("M/DD/YYYY")}</span>
        </h2>
        {trip?.title && (
          <div className="daily-log-trip">
            <span className="day-count">
              Day {dayjs(dailyLog.date).diff(dayjs(trip.start), "day") + 1}:
            </span>
            <Link to={"/trips/" + trip?.id}>{trip.title}</Link>
          </div>
        )}
        <TagsDisplay tags={dailyLog.tags} />
        <div className="memories">
          <MemoriesDisplay memories={dailyLog.memories} />
        </div>

        <section className="photos">
          <PhotoGrid
            photos={dailyLog?.photos}
            date={dailyLog?.date}
            onChange={() => reexecuteQuery()}
          />
        </section>
      </div>

      <Footer>
        <Link to="edit">
          <button className="gold">Edit</button>
        </Link>
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
