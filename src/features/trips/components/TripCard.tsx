import { BigMonth, TagsDisplay } from "core/components";
import { calcNumDays } from "core/utils";
import React from "react";
import { Link } from "react-router-dom";

export interface TripCardProps {
  id: number;
  title: string;
  destination?: string;
  start: string;
  end: string;
  tags: { tag: { name: string; id: number } }[];
  photos?: {
    id: number;
    thumbnail: string;
  }[];
}

const getRandomPhoto = (photos = []) => {
  if (!photos.length) return "/images/mountain-road.thumbnail.jpg";

  return photos.map((p) => p.thumbnail)[Math.floor(Math.random() * photos.length)];
};
export const TripCard = (trip: TripCardProps) => {
  return (
    <Link to={"/trips/" + trip.id}>
      <div className="card trip-card trip">
        <div>
          <h2 className="trip-title">{trip.title}</h2>
          <div className="destination">{trip.destination || "Destination Unknown"}</div>
        </div>
        <div className="overlay card-thumbnail">
          <img src={getRandomPhoto(trip.photos)} />
          <BigMonth date={trip.start} className="shadowed" />
        </div>
        {!!trip.tags.length && <TagsDisplay tags={trip.tags} />}
      </div>
    </Link>
  );
};
