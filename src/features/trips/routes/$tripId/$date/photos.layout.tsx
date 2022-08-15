import { useParams } from "react-router-dom";
import { PhotoGrid } from "~/features/photos/components/PhotoGrid";
import { usePhotos } from "~/features/photos/photo.service";

export default function DayPhotosLayout() {
  let { tripId, date } = useParams();

  let photos = usePhotos(tripId + "", date + "") || [];
  return (
    <div className="mt-4">
      <PhotoGrid tripId={tripId} date={date} photos={photos} />
    </div>
  );
}
