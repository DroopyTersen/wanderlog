import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { getRandomPhoto } from "~/common/utils";
import { BigDate, Img, MotionGrid } from "~/components";
import { AvatarInitialsStack } from "~/components/surfaces/Avatar";
import { auth } from "~/features/auth/auth.client";
import { useAllUsers } from "~/features/users/user.service";
import { sortCompanions } from "../trip.service";

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
  companions?: {
    userId: string;
  }[];
}

const currentUserId = auth.getCurrentUser()?.id;
export const TripCard = (trip: TripCardProps) => {
  const randomPhoto = getRandomPhoto(trip.photos);
  let allUsers = useAllUsers() || [];
  let companions = sortCompanions(trip?.companions, allUsers);
  if (!trip) return null;
  return (
    <Link
      to={"/trips/" + trip.id}
      className="text-white hover:text-white hover:brightness-110"
    >
      <MotionGrid.Item className="card dailylog-card">
        <div className="img overlay">
          <Img
            src={randomPhoto.thumbnail}
            opacity={1}
            className="saturate-[0.8]"
          />
        </div>
        <div className="overlay overlay-dark"></div>

        <div className="flex justify-between">
          <BigDate
            variant="month"
            date={trip.start}
            className="text-shadowed text-gold-200"
          />
          <div className="flex flex-col items-end gap-1">
            <div className=" text-shadowed font-bold uppercase text-gold-200">
              {dayjs(trip.end).diff(dayjs(trip.start), "day") + 1} Days
            </div>

            <AvatarInitialsStack
              names={companions
                .filter((c) => c?.id !== currentUserId)
                .map((c) => c?.name || c?.username || "")}
            />
          </div>
        </div>
        <div className="pb-2">
          <h2 className="text-xl text-white font-semibold text-shadowed">
            {trip.title}
          </h2>
          <div className="italic text-gray-200 flex gap-1 items-center relative -top-1">
            <span>{trip.destination || "Destination Unknown"}</span>
          </div>
        </div>
      </MotionGrid.Item>
    </Link>
  );
};
