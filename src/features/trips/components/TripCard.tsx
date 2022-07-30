import { BiBookHeart } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
import { Link } from "react-router-dom";
import { BigDate, Img, MotionGrid } from "~/components";
import { BLURRED_PHOTOS } from "../../layout/AppBackground/AppBackground";
import "./trips.scss";

export interface TripCardProps {
  id: string;
  title: string;
  destination?: string;
  start: string;
  end: string;
  photos?: {
    id: number;
    thumbnail: string;
    blurred: string;
  }[];
  dailyLogCount: number;
}

const getRandomPhoto = (photos = []) => {
  if (!photos.length)
    return {
      thumbnail: "/images/mountain-road.thumbnail.jpg",
      blurred: BLURRED_PHOTOS.landscape,
    };

  return photos[Math.floor(Math.random() * photos.length)];
};

export const TripCard = (trip: TripCardProps) => {
  let photos = trip?.photos || [];
  const randomPhoto = getRandomPhoto();
  return (
    <Link
      to={"/trips/" + trip.id}
      className="text-white hover:text-white hover:brightness-125"
    >
      <MotionGrid.Item className="py-4 grid grid-cols-[70px_1fr] backdrop-blur-sm gap-4 border-b border-b-gray-100/20 hover:bg-primary-700 w-full">
        <div className="overlay w-[70px] h-[70px] rounded-lg overflow-hidden">
          <Img
            src={randomPhoto.thumbnail}
            initial={randomPhoto.thumbnail}
            opacity={0.8}
          />
          <BigDate
            variant={"month"}
            date={trip.start}
            className="text-shadowed z-10"
          />
        </div>
        <div>
          <h2 className="text-lg text-white font-medium">{trip.title}</h2>
          <div className="flex justify-between items-center text-white">
            <span className="destination italic">
              {trip.destination || "Destination Unknown"}
            </span>
            <div className="counts flex gap-2">
              <span className="dailylog-count flex gap-1 items-center">
                <span className="number">{trip.dailyLogCount}</span>{" "}
                <BiBookHeart />
              </span>
              <span className="photo-count flex gap-1 items-center">
                <span className="number">{photos.length}</span>
                <IoMdImages />
              </span>
            </div>
          </div>
        </div>
      </MotionGrid.Item>
    </Link>
  );
};
