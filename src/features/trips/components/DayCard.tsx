import dayjs from "dayjs";
import { BiBookHeart } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
import { BigDate, Img, MotionGrid } from "~/components";
import { BLURRED_PHOTOS } from "~/features/layout/AppBackground/AppBackground";
import { TripDto } from "../trip.types";

interface DayCardProps {
  date: Date;
  photos: any[];
  memoryCount: number;
  trip: TripDto;
}
const getRandomPhoto = (photos: any[] = []) => {
  if (!photos.length)
    return {
      thumbnail: "/images/mountain-road.thumbnail.jpg",
      blurred: BLURRED_PHOTOS.landscape,
    };

  return photos[Math.floor(Math.random() * photos.length)];
};

export function DayCard({ photos, date, trip, memoryCount }: DayCardProps) {
  return (
    <MotionGrid.Item className="card dailylog-card">
      <div className="img overlay">
        <Img src={getRandomPhoto(photos).thumbnail} opacity={0.9} />
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
