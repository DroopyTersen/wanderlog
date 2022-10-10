import dayjs from "dayjs";
import { LoaderFunction, Outlet, useParams } from "react-router-dom";
import { Tabs } from "~/components/layout/Tabs";
import { photoService } from "~/features/photos/photo.service";
import { TripDaysSlider } from "~/features/trips/components/TripDaysSlider";
import { AppBackgroundLayout } from "../../../../layout/AppBackground/AppBackgroundLayout";
import { AppErrorBoundary } from "../../../../layout/AppErrorBoundary/AppErrorBoundary";
import { memoryService } from "../../../../memories/memory.service";
import { tripService, useTrip } from "../../../trip.service";
import { DateNewMenu } from "./$date.newMenu";

export const errorElement = <AppErrorBoundary />;

export default function TripDayLayout() {
  let params = useParams();
  let date = params.date + "";
  let trip = useTrip(params.tripId);
  return (
    <AppBackgroundLayout
      back={`/trips/${trip?.id}`}
      title={dayjs(date).format("MM/DD/YY")}
      key={date}
    >
      <div className="dailyLog-details pt-2">
        <TripDaysSlider trip={trip} activeDate={date} />

        <Tabs
          items={[
            { to: "photos", label: "Photos" },
            { to: "memories", label: "Memories" },
            // { to: "places", label: "Places" },
          ]}
        />

        <Outlet />
        <DateNewMenu tripId={trip?.id} date={date} />
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
