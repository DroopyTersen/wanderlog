import { motion } from "framer-motion";
import { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { Link, LoaderFunction, useParams } from "react-router-dom";
import {
  calcNumDays,
  displayDateRange,
  formatDateId,
  getDaysInRange,
} from "~/common/utils";
import { BigDate, MotionGrid } from "~/components";
import { LinkButton } from "~/components/inputs/buttons";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../layout/AppErrorBoundary/AppErrorBoundary";
import { useAllUsers } from "../users/user.service";
import { DayCard } from "./components/DayCard";
import { tripService, useTrip } from "./trip.service";

export default function TripDetailsRoute() {
  let { tripId } = useParams();
  let trip = useTrip(tripId + "");
  let photos = [];

  let allUsers = useAllUsers() || [];
  let companions =
    trip?.companions?.map((c) => allUsers.find((u) => u.id === c.userId)) || [];
  if (!trip) return null;

  let tripDates = getDaysInRange(trip?.start, trip?.end);
  let [tab, setTab] = useState<"days" | "photos" | "places">("days");

  return (
    <AppBackgroundLayout back="/trips" title="Trips">
      <div className="trip trip-details">
        <motion.div
          variants={animationVariants}
          initial="fromTop"
          animate="visible"
        >
          <div className="flex justify-between items-center">
            <h1 className="page-title trip-title mt-4 mb-4 font-normal">
              {trip.title}
            </h1>
            <LinkButton to="edit" className="btn-ghost" variants={["circle"]}>
              <HiOutlinePencil />
            </LinkButton>
          </div>
          <div className="row space-between date-row">
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
              <div
                key={c?.id || c?.username}
                className="avatar placeholder pr-2 items-center gap-2 bg-pink/80 text-primary-700 rounded-full text-sm font-medium"
              >
                <div className="shadow-xl rounded-full w-8">
                  <svg
                    className="h-full w-full bg-pink"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>

                <span className="w-[120] truncate">
                  {c?.name || c?.username}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="tabs mt-8 uppercase font-bold">
          <a
            onClick={() => setTab("days")}
            className={`font-semibold tab tab-bordered ${
              tab === "days" ? "tab-active" : ""
            }`}
          >
            Days
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
        {tab === "days" && (
          <MotionGrid width="400px" className="mt-2 daily-logs-grid">
            {tripDates.map((date, index) => (
              <Link key={formatDateId(date)} to={index + 1 + ""}>
                <DayCard trip={trip} date={date} photos={[]} memoryCount={0} />
              </Link>
            ))}
          </MotionGrid>
        )}
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
  let trip = tripService.getById(params.tripId + "");
  // todo get photos for this trip
  let photos = [];

  return {
    trip,
    photos,
  };
};

export const errorElement = <AppErrorBoundary />;
