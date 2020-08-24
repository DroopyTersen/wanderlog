import React from "react";
import { DailyLogModel } from "../../models";
import Card from "../components/surfaces/Card";
import BigDate from "../components/BigDate";
import { TagsDisplay } from "../components/tags/tags";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";
import { Link } from "react-router-dom";

export default function DailyLogCard({ dailyLog }: { dailyLog: DailyLogModel }) {
  const subtitle = dailyLog?.trip?.item?.title || "Not part of a trip";
  const imgSrc = dailyLog.photos.length
    ? getCloudinaryImageUrl(dailyLog.photos[0].item.publicId)
    : "/images/mountains.png";
  return (
    <Link to={dailyLog.item.id}>
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
    </Link>
  );
}
