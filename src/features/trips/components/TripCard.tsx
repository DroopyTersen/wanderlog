import { BigMonth, Img, TagsDisplay } from "core/components";
import React from "react";
import { Link } from "react-router-dom";
import { BLURRED_PHOTOS } from "global/components/AppBackground/AppBackground";
import { motion } from "framer-motion";

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
    blurred: string;
  }[];
}

const getRandomPhoto = (photos = []) => {
  if (!photos.length)
    return { thumbnail: "/images/mountain-road.thumbnail.jpg", blurred: BLURRED_PHOTOS.landscape };

  return photos[Math.floor(Math.random() * photos.length)];
};
export const TripCard = (trip: TripCardProps) => {
  const randomPhoto = getRandomPhoto(trip.photos);
  return (
    <Link to={"/trips/" + trip.id}>
      <motion.div className="card trip-card trip" layoutId={`trip-container-${trip.id}`}>
        <div>
          <motion.h2 className="trip-title" layoutId={`trip-title-${trip.id}`}>
            {trip.title}
          </motion.h2>
          <div className="destination">{trip.destination || "Destination Unknown"}</div>
        </div>
        <div className="overlay card-thumbnail">
          <Img src={randomPhoto.thumbnail} initial={randomPhoto.blurred} opacity={0.8} />
          <BigMonth date={trip.start} className="text-shadowed" />
        </div>
        {!!trip.tags.length && <TagsDisplay tags={trip.tags} />}
      </motion.div>
    </Link>
  );
};
