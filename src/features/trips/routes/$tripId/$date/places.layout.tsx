import { useParams } from "react-router-dom";

export default function DayPlacesLayout() {
  let { tripId, date } = useParams();
  let places = [];
  return <h2>Places: {places?.length}</h2>;
}
