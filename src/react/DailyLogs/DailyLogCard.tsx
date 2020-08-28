import React from "react";
import { DailyLogModel } from "../../models";
import Card from "../components/surfaces/Card";
import BigDate from "../components/BigDate";
import { TagsDisplay } from "../components/tags/tags";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export default function DailyLogCard({ dailyLog }: { dailyLog: DailyLogModel }) {
  const subtitle = dailyLog?.trip?.item?.title || "Not part of a trip";
  const imgSrc = dailyLog.photos.length
    ? getCloudinaryImageUrl(dailyLog.photos[0].item.publicId)
    : "/images/mountain-road.thumbnail.png";
  return (
    <Link to={dailyLog.item.id}>
      <Card className="daily-log-card">
        <h2 className="dailyLog-title">
          <span className="day">{dayjs(dailyLog.item.date).format("ddd")}</span>
          <span className="date">{dayjs(dailyLog.item.date).format("M/DD/YYYY")}</span>
        </h2>
        <div className="row-two">
          <div className="photo">
            <img src={imgSrc} />
          </div>
          <div>
            {dailyLog?.trip?.item?.title && (
              <div className="daily-log-trip">
                <span className="day-count">
                  Day {dayjs(dailyLog.item.date).diff(dayjs(dailyLog?.trip.item.start), "day") + 1}:
                </span>
                <Link to={"/trips/" + dailyLog?.trip?.item?.id}>{dailyLog?.trip.item.title}</Link>
              </div>
            )}
            <TagsDisplay tags={dailyLog.item.tags} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
