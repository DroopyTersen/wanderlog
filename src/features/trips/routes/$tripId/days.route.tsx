import { Link, useParams } from "react-router-dom";
import { formatDateId, getDaysInRange } from "~/common/utils";
import { MotionGrid } from "~/components";
import { useTripMemories } from "~/features/memories/memory.service";
import { useTripPhotos } from "~/features/photos/photo.service";
import { DayCard } from "../../components/DayCard";
import { useTrip } from "../../trip.service";

export default function TripDaysRoute() {
  let { tripId } = useParams();
  let trip = useTrip(tripId);
  let tripDates = getDaysInRange(trip?.start, trip?.end);
  let tripMemories = useTripMemories(tripId + "") || [];
  let tripPhotos = useTripPhotos(tripId + "") || [];

  return (
    <MotionGrid width="400px" className="mt-2 daily-logs-grid">
      {tripDates.map((date, index) => (
        <Link
          key={formatDateId(date)}
          to={`/trips/${trip.id}/${formatDateId(date)}`}
        >
          <DayCard
            trip={trip}
            date={date}
            photos={tripPhotos.filter((p) => p.date === formatDateId(date))}
            memoryCount={
              tripMemories?.filter((m) => m.date === formatDateId(date)).length
            }
          />
        </Link>
      ))}
    </MotionGrid>
  );
}
