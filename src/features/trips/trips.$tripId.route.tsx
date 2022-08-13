import { motion } from "framer-motion";
import { LoaderFunction, useParams } from "react-router-dom";
import { calcNumDays, displayDateRange } from "~/common/utils";
import { BigDate } from "~/components";
import { findOneEntity, useEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { AppBackgroundLayout } from "../layout/AppBackground/AppBackgroundLayout";
import { Header } from "../layout/Header/Header";
import { tripSchema } from "./trip.types";
export default function TripDetailsRoute() {
  let trip = useTrip();
  return (
    <AppBackgroundLayout>
      <Header back="/trips">Trips</Header>
      <div className="trip trip-details pt-11">
        <motion.div
          variants={animationVariants}
          initial="fromTop"
          animate="visible"
        >
          <h1 className="page-title trip-title mt-4 mb-4 font-normal">
            {trip.title}
          </h1>
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
        </motion.div>
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

const getTripQuery = (tripId: string) => {
  return db.trips.findOne({
    selector: {
      id: tripId,
    },
  });
};

let useTrip = () => {
  let { tripId } = useParams();
  return useEntity(getTripQuery(tripId + ""), "trip", tripSchema);
};

export const loader: LoaderFunction = async ({ params }) => {
  let trip = await findOneEntity(getTripQuery(params.tripId + ""), tripSchema);
  return {
    trip,
  };
};
