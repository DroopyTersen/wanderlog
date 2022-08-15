import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Link, LoaderFunction, Outlet, useParams } from "react-router-dom";
import { BigDate } from "~/components";
import { Tabs } from "~/components/layout/Tabs";
import { DropdownMenu } from "~/components/surfaces/DropdownMenu";
import { NewMenu } from "~/features/layout/NewMenu/NewMenu";
import { photoService } from "~/features/photos/photo.service";
import { AppBackgroundLayout } from "../../../../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../../../../layout/AppErrorBoundary/AppErrorBoundary";
import { memoryService } from "../../../../memories/memory.service";
import { tripService, useTrip } from "../../../trip.service";

export const errorElement = <AppErrorBoundary />;

export default function TripDayLayout() {
  let params = useParams();
  let date = params.date + "";
  let trip = useTrip(params.tripId);

  return (
    <AppBackgroundLayout
      back={`/trips/${trip?.id}`}
      title={dayjs(date).format("MM/DD/YY")}
    >
      <div className="dailyLog-details">
        <motion.div
          variants={animationVariants}
          initial="fromTop"
          animate="visible"
        >
          <h2 className="text-gold-300 mt-4 mb-2">
            <BigDate date={date} variant="day-date-month" />
          </h2>
          {trip?.title && (
            <div className="flex items-center gap-1">
              <span className="day-count font-bold">
                Day {dayjs(date).diff(dayjs(trip.start), "day") + 1}:
              </span>
              <Link to={"/trips/" + trip?.id} className="text-pink">
                {trip.title}
              </Link>
            </div>
          )}
        </motion.div>

        <Tabs
          items={[
            { to: "memories", label: "Memories" },
            { to: "photos", label: "Photos" },
            { to: "places", label: "Places" },
          ]}
        />

        <Outlet />
        <NewMenu>
          <DropdownMenu.Item to={`/trips/${trip.id}/${date}/memories/new`}>
            Add a Memory
          </DropdownMenu.Item>
        </NewMenu>
      </div>
    </AppBackgroundLayout>
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  let trip = await tripService.getById(params.tripId + "");
  let memories = await memoryService.getByTripAndDate(
    trip?.id,
    params.date + ""
  );

  let photos = await photoService.getByTripAndDate(trip?.id, params.date + "");
  return {
    trip,
    memories,
    photos,
  };
};

const animationVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },
  fromTop: {
    opacity: 0,
    y: -20,
  },
  fromBottom: {
    opacity: 0,
    y: 30,
  },
};
