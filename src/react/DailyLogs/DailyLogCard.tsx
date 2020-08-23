import React from "react";
import "./DailyLogCard.scss";
import { DailyLogModel } from "../../models";
import Card from "../components/surfaces/Card";
import BigDate from "../components/BigDate";
import { TagsDisplay } from "../components/tags/tags";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";

export default function DailyLogCard({ dailyLog }: { dailyLog: DailyLogModel }) {
  const subtitle = dailyLog?.trip?.item?.title || "Not part of a trip";
  const imgSrc = dailyLog.photos.length
    ? getCloudinaryImageUrl(dailyLog.photos[0].item.publicId)
    : "/images/mountains.png";
  return (
    <Card className="daily-log-card">
      <div className="column-one">
        <BigDate date={dailyLog.item.date} />
        <div className="subtitle">{subtitle}</div>
        <TagsDisplay tags={dailyLog.item.tags} />
      </div>
      <div className="photo">
        <img src={imgSrc} />
      </div>
    </Card>
  );
}
