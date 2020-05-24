import React from "react";
import { useParams, Link } from "react-router-dom";
import useAsyncData from "../shared/useAsyncData";
import { DailyLogModel, TripModel } from "../../models";
import dayjs from "dayjs";
import { HightlightsDisplay } from "./highlights";
import { TagsDisplay } from "../shared/tags/tags";
import { LinkButton } from "../global/Header/Header";

export default function DailyLogDetails() {
  let { isLoading, trip, dailyLog } = useDailyLogDetails();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {trip?.item?.title && (
        <div className="trip">
          <Link to={"/trips/" + trip?.item?.id}>
            <h3>{trip.item.title}</h3>
          </Link>
        </div>
      )}
      <h1>{dailyLog.title}</h1>

      <TagsDisplay tags={dailyLog.item.tags} />
      <HightlightsDisplay style={{ margin: "20px 0" }} highlights={dailyLog.item.highlights} />

      <div>
        <LinkButton to="edit">Edit</LinkButton>
      </div>
    </div>
  );
}

function useDailyLogDetails() {
  let { logId } = useParams();
  let {
    data: { dailyLog, trip },
    isLoading,
  } = useAsyncData<{ dailyLog?: DailyLogModel; trip?: TripModel }>(
    async (logId) => {
      let dailyLog = await DailyLogModel.load(logId);
      let trip = await TripModel.loadByDate(dailyLog.item.date);
      return {
        dailyLog,
        trip,
      };
    },
    [logId],
    {}
  );

  return {
    isLoading,
    trip,
    dailyLog,
  };
}
