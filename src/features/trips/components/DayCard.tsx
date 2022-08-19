import dayjs from "dayjs";
import { useState } from "react";
import { BiBookHeart } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
import { useIsOnline } from "~/common/isOnline";
import { BigDate, Img, MotionGrid } from "~/components";
import { PhotoDto } from "~/features/photos/photo.types";
import { TripDto } from "../trip.types";

interface DayCardProps {
  date: Date;
  photos: PhotoDto[];
  memoryCount: number;
  trip: TripDto;
}
const getRandomPhoto = (photos: PhotoDto[] = []) => {
  if (!photos.length)
    return {
      mid: "/images/mountain-road.thumbnail.jpg",
      small: "/images/mountain-road.thumbnail.jpg",
    };

  return photos[Math.floor(Math.random() * photos.length)];
};

export function DayCard({ photos, date, trip, memoryCount }: DayCardProps) {
  const isOnline = useIsOnline();
  const [randomPhoto] = useState(() => getRandomPhoto(photos));
  return (
    <MotionGrid.Item className="card dailylog-card aspect-video">
      <div className="img overlay">
        <Img
          src={isOnline ? randomPhoto.mid : randomPhoto.small}
          initial={randomPhoto.small}
          className="saturate-[0.85] brightness-95"
          opacity={1}
        />
      </div>
      <div className="overlay overlay-dark"></div>

      <div>
        <div className=" text-shadowed font-bold uppercase">
          Day {dayjs(date).diff(dayjs(trip.start), "day") + 1}
        </div>
        <BigDate
          date={date}
          variant="day-date-month"
          className="text-shadowed"
        />
      </div>
      <div className="flex justify-end items-center gap-3 font-sans">
        <div className="flex items-center">
          <span className="number">{memoryCount}</span> <BiBookHeart />
        </div>
        <div className="flex items-center">
          <span className="number">{photos.length}</span> <IoMdImages />
        </div>
      </div>
    </MotionGrid.Item>
  );
}
