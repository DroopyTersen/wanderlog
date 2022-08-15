import { useParams } from "react-router-dom";
import { PhotoGrid } from "~/features/photos/components/PhotoGrid";
import { useTripPhotos } from "~/features/photos/photo.service";

export default function TripPhotosRoute() {
  let { tripId } = useParams();
  let photos = useTripPhotos(tripId + "");
  return (
    <div className="mt-4">
      <PhotoGrid tripId={tripId} photos={photos} />
    </div>
  );
}
