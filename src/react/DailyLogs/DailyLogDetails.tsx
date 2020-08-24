import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAsyncData from "../hooks/useAsyncData";
import { DailyLogModel, TripModel } from "../../models";
import dayjs from "dayjs";
import { HightlightsDisplay } from "./highlights";
import { TagsDisplay } from "../components/tags/tags";
import Grid from "../components/Grid";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";
import AppBackground from "../global/AppBackground/AppBackground";
import Header from "../global/Header/Header";
import Footer from "../global/Footer/Footer";
import AddButton from "../global/AddButton/AddButton";
import { Button } from "../components/inputs/buttons";

export default function DailyLogDetails() {
  let { isLoading, trip, dailyLog } = useDailyLogDetails();
  let navigate = useNavigate();
  if (isLoading) return <div>Loading...</div>;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      await dailyLog.remove();
      navigate("/dailyLogs");
    }
  };
  return (
    <>
      <AppBackground variant="blurred" />
      <Header title="Daily Logs" />
      <div className="dailyLog-details">
        {trip?.item?.title && (
          <div className="trip">
            <span className="day-count">
              Day {dayjs(dailyLog.item.date).diff(dayjs(trip.item.start), "day") + 1}:
            </span>
            <Link to={"/trips/" + trip?.item?.id}>{trip.item.title}</Link>
          </div>
        )}
        <h2 className="dailyLog-title">
          <span className="day">{dayjs(dailyLog.item.date).format("ddd")}</span>
          <span className="date">{dayjs(dailyLog.item.date).format("M/DD/YYYY")}</span>
        </h2>
        <TagsDisplay tags={dailyLog.item.tags} />
        <div className="memories">
          {dailyLog.item.highlights.map((memory) => (
            <div key={memory} className="memory">
              {memory}
            </div>
          ))}
        </div>
      </div>
      <Footer className="dailyLog-details">
        <Button onClick={handleDelete}>Delete</Button>
        <Link to={`edit`} role="button" className="edit-button">
          EDIT
        </Link>
        <AddButton>
          <p style={{ textAlign: "center", width: "100%" }}>
            Add a Place or a Photo to {dayjs(dailyLog.item.date).format("M/DD/YYYY")}
          </p>
          <Link to={`/places/new?dailyLogId=${dailyLog?.item?.id}`}>Place</Link>
          <Link to={`/photos/new?dailyLogId=${dailyLog?.item?.id}`}>Photo</Link>
        </AddButton>
      </Footer>
      {/* <div>
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
      </div> */}
    </>
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
