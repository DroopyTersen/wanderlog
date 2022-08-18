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
      <MotionGrid.Item className="py-4 grid grid-cols-[90px_1fr] backdrop-blur-sm gap-4 border-b border-b-gray-100/20 hover:bg-primary-700 w-full">
        <div className="overlay w-[90px] h-[90px] rounded-lg overflow-hidden">
          <Img
            src={randomPhoto.thumbnail}
            initial={randomPhoto.thumbnail}
            opacity={0.7}
          />
          <BigDate
            variant={"month"}
            date={trip.start}
            className="text-shadowed z-10"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg text-white font-medium">{trip.title}</h2>
            <div className="italic text-gray-200 flex gap-1 items-center">
              <span>{trip.destination || "Destination Unknown"}</span>
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            <AvatarInitialsStack
              names={companions
                .filter((c) => c?.id !== currentUserId)
                .map((c) => c?.name || c?.username || "")}
            />
          </div>
        </div>
      </MotionGrid.Item>
    </Link>
  );
};
