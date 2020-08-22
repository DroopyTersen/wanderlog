import React from "react";
import { useParams, Link } from "react-router-dom";
import useAsyncData from "../hooks/useAsyncData";
import { DailyLogModel, TripModel } from "../../models";
import dayjs from "dayjs";
import { HightlightsDisplay } from "./highlights";
import { TagsDisplay } from "../components/tags/tags";
import Grid from "../components/Grid";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";

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
        <Link to="edit">Edit</Link>
        <Link to={`/photos/upload?date=${dailyLog.item.date}`}>Add Photos</Link>
      </div>

      <Grid>
        {dailyLog.photos.map((photo) => (
          <img src={getCloudinaryImageUrl(photo.item.publicId)} />
        ))}
      </Grid>
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
