import { useParams } from "react-router-dom";
import { getDaysInRange } from "~/common/utils";
import { useTrip } from "../../trip.service";

export default function TripPlacesRoute() {
  let { tripId } = useParams();
  let trip = useTrip(tripId);
  let tripDates = getDaysInRange(trip?.start, trip?.end);

  return <h2>Places: Coming soon</h2>;
}
