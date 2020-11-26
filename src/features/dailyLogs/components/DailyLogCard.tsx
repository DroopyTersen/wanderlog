import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { TagsDisplay } from "core/components";

interface Props {
  dailyLog: {
    id: number;
    title: string;
    date: string;
    tags: { tag: { name: string; id: number } }[];
  };
  trip: {
    id: number;
    title: string;
    start: string;
  };
}

export function DailyLogCard({ dailyLog, trip }: Props) {
  const imgSrc = "/images/mountain-road.thumbnail.png";
  return (
    <Link to={dailyLog.id + ""}>
      <div className="card daily-log-card">
        <h2 className="dailyLog-title">
          <span className="day">{dayjs(dailyLog.date).format("ddd")}</span>
          <span className="date">{dayjs(dailyLog.date).format("M/DD/YYYY")}</span>
        </h2>
        <div className="row-two">
          <div className="photo">
            <img src={imgSrc} />
          </div>
          <div>
            {trip?.title && (
              <div className="daily-log-trip">
                <span className="day-count">
                  Day {dayjs(dailyLog.date).diff(dayjs(trip?.start), "day") + 1}:
                </span>
                <Link to={"/trips/" + trip.id}>{trip.title}</Link>
              </div>
            )}
            <TagsDisplay tags={dailyLog.tags.map((t) => t.tag.name)} />
          </div>
        </div>
      </div>
    </Link>
  );
}
