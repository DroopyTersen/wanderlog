import { motion } from "framer-motion";
import { HiOutlinePencil } from "react-icons/hi";
import {
  LoaderFunction,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { calcNumDays, displayDateRange } from "~/common/utils";
import { BigDate } from "~/components";
import { LinkButton } from "~/components/inputs/buttons";
import { Tabs } from "~/components/layout/Tabs";
import { Avatar } from "~/components/surfaces/Avatar";
import { memoryService } from "~/features/memories/memory.service";
import { photoService } from "~/features/photos/photo.service";
import { AppBackgroundLayout } from "../../../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../../../layout/AppErrorBoundary/AppErrorBoundary";
import { useAllUsers } from "../../../users/user.service";
import { sortCompanions, tripService, useTrip } from "../../trip.service";
import { TripNewMenu } from "./$tripId.newMenu";

export default function TripDetailsRoute() {
  let { tripId } = useParams();
  let navigate = useNavigate();
  let trip = useTrip(tripId + "");
  let allUsers = useAllUsers() || [];
  let companions = sortCompanions(trip?.companions || [], allUsers);
  if (!trip) return null;

  return (
    <AppBackgroundLayout back="/trips" title="Trips">
      <div className="trip trip-details">
        <motion.div
          variants={animationVariants}
          initial="fromTop"
          animate="visible"
        >
          <div className="flex justify-between items-center lg:justify-start">
            <h1 className="page-title trip-title mt-4 mb-4 font-normal">
              {trip.title}
            </h1>
            <LinkButton to="edit" className="btn-ghost" variants={["circle"]}>
              <HiOutlinePencil />
            </LinkButton>
          </div>
          <div className="flex justify-between date-row lg:justify-end gap-4 lg:flex-row-reverse">
            <div className="trip-dates">
              <div className="num-days">
                <span>{calcNumDays(trip.start, trip.end)}</span> days
              </div>
              <div className="date">
                {displayDateRange(trip.start, trip.end)}
              </div>
            </div>
            <BigDate variant="month" date={trip.start} />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] mt-4 gap-2">
            {companions?.map((c) => (
              <Avatar key={c?.id} name={c?.name || c?.username || ""} />
            ))}
          </div>
        </motion.div>
        <Tabs
          items={[
            {
              label: "Days",
              to: "days",
            },
            {
              label: "Photos",
              to: "photos",
            },
            // {
            //   label: "Places",
            //   to: "places",
            // },
          ]}
        />

        <Outlet />
        <TripNewMenu trip={trip} />
      </div>
    </AppBackgroundLayout>
  );
}

const animationVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },
  fromTop: {
    opacity: 0,
    y: -20,
  },
};

export const loader: LoaderFunction = async ({ params }) => {
  let trip = await tripService.getById(params.tripId + "");
  let tripMemories = await memoryService.getByTrip(params.tripId + "");
  // todo get photos for this trip
  let tripPhotos = await photoService.getByTrip(params.tripId + "");

  return {
    trip,
    tripPhotos,
    tripMemories,
  };
};

export const errorElement = <AppErrorBoundary />;
