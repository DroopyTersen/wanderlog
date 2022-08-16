import { useParams } from "react-router-dom";
import { PhotoGrid } from "~/features/photos/components/PhotoGrid";
import { useTripPhotos } from "~/features/photos/photo.service";
import { useTrip } from "../../trip.service";

export default function TripPhotosRoute() {
  let { tripId } = useParams();
  let trip = useTrip(tripId + "");
  let photos = useTripPhotos(tripId + "");
  return (
    <div className="mt-4">
      <PhotoGrid trip={trip} photos={photos} />
    </div>
  );
}
