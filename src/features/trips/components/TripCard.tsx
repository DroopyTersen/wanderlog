import { BigMonth, Img, TagsDisplay } from "core/components";
import React from "react";
import { Link } from "react-router-dom";
import { BLURRED_PHOTOS } from "global/components/AppBackground/AppBackground";
import { BiBookHeart } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";

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
  dailyLogCount: number;
  photoCount: number;
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
      <div className="card trip-card trip">
        <div className="left-column">
          <h2 className="trip-title">{trip.title}</h2>
          <div className="row row2">
            <span className="destination">{trip.destination || "Destination Unknown"}</span>
            <div className="counts">
              {trip.dailyLogCount && (
                <span className="dailylog-count">
                  <span className="number">{trip.dailyLogCount}</span> <BiBookHeart />
                </span>
              )}
              {trip.photos.length > 0 && (
                <span className="photo-count">
                  <span className="number">{trip.photos.length}</span>
                  <IoMdImages />
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="overlay card-thumbnail">
          <Img src={randomPhoto.thumbnail} initial={randomPhoto.blurred} opacity={0.8} />
          <BigMonth date={trip.start} className="text-shadowed" />
        </div>
        {/* {!!trip.tags.length && <TagsDisplay tags={trip.tags} />} */}
      </div>
    </Link>
  );
};
