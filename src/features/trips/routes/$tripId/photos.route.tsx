import { useParams } from "react-router-dom";
import { getDaysInRange } from "~/common/utils";
import { useTrip } from "../../trip.service";

export default function TripPhotosRoute() {
  let { tripId } = useParams();
  let trip = useTrip(tripId);
  let tripDates = getDaysInRange(trip?.start, trip?.end);

  return <h2>Photos: coming soon</h2>;
}
