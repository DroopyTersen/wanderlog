import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { formatDateId, getDaysInRange } from "~/common/utils";
import { BigDate } from "~/components";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../layout/AppErrorBoundary/AppErrorBoundary";
import { MemoriesDisplay } from "../memories/Memories";
import { memoryService, useMemories } from "../memories/memory.service";
import { tripService, useTrip } from "./trip.service";

export const errorElement = <AppErrorBoundary />;

export default function DayNumberRoute() {
  let params = useParams();
  let { date } = useLoaderData() as { date: string };
  let trip = useTrip(params.tripId);
  let memories = useMemories(params.tripId + "", date) || [];
  let [tab, setTab] = useState<"memories" | "photos" | "places">("memories");
  // TODO: wire up photos
  let photos = [];

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

        <div className="tabs mt-8 uppercase font-bold">
          <a
            onClick={() => setTab("memories")}
            className={`font-semibold tab tab-bordered ${
              tab === "memories" ? "tab-active" : ""
            }`}
          >
            Memories
          </a>
          <a
            onClick={() => setTab("photos")}
            className={`font-semibold tab tab-bordered ${
              tab === "photos" ? "tab-active" : ""
            }`}
          >
            Photos
          </a>
          <a
            onClick={() => setTab("places")}
            className={`font-semibold tab tab-bordered ${
              tab === "places" ? "tab-active" : ""
            }`}
          >
            Places
          </a>
        </div>

        <div className="memories">
          <MemoriesDisplay memories={memories} />
        </div>

        <motion.section
          className="photos"
          variants={animationVariants}
          initial="fromBottom"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          {/* <PhotoGrid
          photos={dailyLog?.photos}
          date={dailyLog?.date}
          onChange={() => reexecuteQuery()}
        /> */}
        </motion.section>
      </div>
    </AppBackgroundLayout>
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  let trip = await tripService.getById(params.tripId + "");
  let dayNumber = parseInt(params.dayNumber + "", 10);
  let tripDates = getDaysInRange(trip.start, trip.end);
  let targetDate = tripDates[dayNumber - 1];
  let memories = await memoryService.getByTripAndDate(
    trip.id,
    formatDateId(targetDate)
  );

  return {
    memories,
    date: targetDate,
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
