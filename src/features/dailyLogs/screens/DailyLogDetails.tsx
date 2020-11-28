import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AddButton, AppBackground, Footer } from "global/components";
import { TagsDisplay } from "core/components";
import { useMutation, useQuery } from "urql";
import { MemoriesDisplay } from "../components/Memories";

function useDelete(id, tripId) {
  let navigate = useNavigate();
  let [deleteResult, deleteMutation] = useMutation(DELETE_MUTATION);

  useEffect(() => {
    if (deleteResult?.data?.delete_dailylogs) {
      navigate("/trips/" + tripId);
    }
  }, [deleteResult.data, tripId]);

  return [() => deleteMutation({ id }, {}), deleteResult.fetching] as [() => void, boolean];
}

export default function DailyLogDetails() {
  let { tripId = 0, dailyLogId } = useParams();
  let [deleteDailyLog, isDeleting] = useDelete(dailyLogId, tripId);

  let [{ data, fetching, error }] = useQuery({
    query: QUERY,
    variables: { dailyLogId, tripId },
    pause: !dailyLogId,
  });
  let trip = data?.trip || null;
  let dailyLog = data?.dailyLog;
  console.log("🚀 | DailyLogDetails | dailyLog", tripId, dailyLogId, dailyLog);

  if (!dailyLog) return null;

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
      </div>
      <Footer>
        <button className="scary" onClick={deleteDailyLog} disabled={isDeleting}>
          Delete
        </button>

        <Link to="edit">
          <button disabled={isDeleting} className="gold">
            Edit
          </button>
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

const QUERY = `query GetDailyLog($dailyLogId:Int!, $tripId: Int!) {
    dailyLog: dailylogs_by_pk(id: $dailyLogId) {
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
    }
    trip: trips_by_pk(id: $tripId) {
      id
      title
      start
      end
    }
  }`;

const DELETE_MUTATION = `
mutation DeleteDailyLog($id:Int!) {
    delete_tag_dailylog(where: {dailylog_id: {_eq: $id }}) {
      affected_rows
    }
    delete_dailylogs(where: {id: {_eq: $id }}) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
