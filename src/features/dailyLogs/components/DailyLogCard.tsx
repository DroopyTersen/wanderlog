import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { BigDate, Img, TagsDisplay } from "core/components";
import { MemoriesDisplay, MemoriesPreview } from "./Memories";
import { BLURRED_PHOTOS } from "global/components";
import { IoMdImages } from "react-icons/io";

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
  getLink?: (dailyLog) => string;
}

const getRandomPhoto = (photos = []) => {
  if (!photos.length)
    return { thumbnail: "/images/mountain-road.thumbnail.jpg", blurred: BLURRED_PHOTOS.landscape };

  return photos[Math.floor(Math.random() * photos.length)];
};
export function DailyLogCard({ dailyLog, trip, getLink = ({ id }) => `/dailylogs/${id}` }: Props) {
  let [randomPhoto, setRandomPhoto] = useState(() => getRandomPhoto(dailyLog.photos));
  useEffect(() => {
    setRandomPhoto(getRandomPhoto(dailyLog.photos));
  }, [dailyLog.photos]);

  let { tripId: hasTripContext } = useParams();

  return (
    <Link to={getLink(dailyLog)}>
      <div className="card dailylog-card">
        <div className="img overlay">
          <Img src={randomPhoto.thumbnail} initial={randomPhoto.blurred} opacity={0.8} />
        </div>
        <div className="overlay"></div>
        {dailyLog.photos.length > 0 && (
          <div className="photo-count">
            <span className="photo-count-number">{dailyLog.photos.length}</span>
            <IoMdImages />
          </div>
        )}
        <div>
          <BigDate date={dailyLog.date} variant="day-date-month" className="text-shadowed" />
          {trip?.title && (
            <div className="daily-log-trip text-shadowed">
              <span className="day-count">
                Day {dayjs(dailyLog.date).diff(dayjs(trip.start), "day") + 1}:
              </span>
              <Link to={"/trips/" + trip?.id}>{trip.title}</Link>
            </div>
          )}
        </div>
        <TagsDisplay tags={dailyLog.tags} />
      </div>
    </Link>
  );
}
