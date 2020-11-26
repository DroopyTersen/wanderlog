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
}
export const TripCard = (trip: TripCardProps) => {
  return (
    <Link to={"/trips/" + trip.id}>
      <div className="card trip-card trip">
        <div className="row align-top">
          <h2 className="trip-title greedy">{trip.title}</h2>
          <BigMonth date={trip.start} />
        </div>
        <div className="row2 row space-between">
          <div className="destination-tags">
            {trip.destination && <div className="destination">{trip.destination}</div>}
            {!!trip.tags.length && <TagsDisplay tags={trip.tags.map((t) => t.tag.name)} />}
          </div>
          <div className="trip-dates">
            <div className="num-days">
              <span>{calcNumDays(trip.start, trip.end)}</span> days
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
