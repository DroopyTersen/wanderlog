import { useParams } from "react-router-dom";

export default function DayPhotosLayout() {
  let { tripId, date } = useParams();
  let photos = [];
  return <h2>Photos: {photos?.length}</h2>;
}
