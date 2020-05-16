import React from "react";
import useAsyncData from "../../core/hooks/useAsyncData";
import { TripModel } from "../../models";
import { Link, useParams } from "react-router-dom";

export default function TripDetails() {
  let { id } = useParams();
  let { data: trip, isLoading } = useAsyncData<TripModel>(TripModel.load, [id], null);

  if (isLoading) return null;

  return (
    <div>
      <h2>{trip?.item.title}</h2>
      <Link to="edit">Edit</Link>
    </div>
  );
}
