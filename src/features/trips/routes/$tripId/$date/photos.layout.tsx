import { useParams } from "react-router-dom";
import { PhotoGrid } from "~/features/photos/components/PhotoGrid";
import { usePhotos } from "~/features/photos/photo.service";
import { useTrip } from "~/features/trips/trip.service";

export default function DayPhotosLayout() {
  let { tripId, date } = useParams();
  let trip = useTrip(tripId + "");
  let photos = usePhotos(tripId + "", date + "") || [];
  return (
    <div className="mt-4">
      <PhotoGrid trip={trip} date={date} photos={photos} />
    </div>
  );
}
