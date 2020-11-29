import React from "react";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { TagsDisplay } from "core/components";
import { MemoriesDisplay, MemoriesPreview } from "./Memories";

interface Props {
  dailyLog: {
    id: number;
    date: string;
    tags: { tag: { name: string; id: number } }[];
    memories: string;
    photos?: {
      id: number;
      date: string;
      thumbnail: string;
    }[];
  };
  trip: {
    id: number;
    title: string;
    start: string;
  };
}

const getRandomPhoto = (photos = []) => {
  if (!photos.length) return "/images/mountain-road.thumbnail.jpg";

  return photos.map((p) => p.thumbnail)[Math.floor(Math.random() * photos.length)];
};

export function DailyLogCard({ dailyLog, trip }: Props) {
  let { pathname } = useLocation();
  console.log("🚀 ~ file: DailyLogCard.tsx ~ line 23 ~ DailyLogCard ~ pathname", pathname);
  let linkPrefix = pathname.toLowerCase().indexOf("/dailylogs") > -1 ? "" : "dailylogs/";
  const imgSrc = getRandomPhoto(dailyLog.photos);
  return (
    <Link to={linkPrefix + dailyLog.id + ""}>
      <div className="card daily-log-card">
        <h2 className="dailyLog-title">
          <span className="day">{dayjs(dailyLog.date).format("ddd")}</span>
          <span className="date">{dayjs(dailyLog.date).format("M/DD/YYYY")}</span>
        </h2>
        <div className="row-two">
          <div className="photo">
            <img src={imgSrc} />
          </div>
          <div className="column-two">
            <div className="day-count">
              Day {dayjs(dailyLog.date).diff(dayjs(trip?.start), "day") + 1}
            </div>
            <div className="places">Places will go here</div>
            <TagsDisplay tags={dailyLog.tags} />
          </div>
        </div>
        {/* <MemoriesPreview
          memories={dailyLog.memories.slice(0)}
          className="preview"
        ></MemoriesPreview> */}
      </div>
    </Link>
  );
}
