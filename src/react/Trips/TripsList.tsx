import React, { useState, useEffect, useRef } from "react";
import { TripModel } from "../../models";
import { Link } from "react-router-dom";
import { useSyncListener } from "../shared/useSyncListener";
import useAsyncData from "../hooks/useAsyncData";
import dayjs from "dayjs";
import { getCloudinaryImageUrl } from "../Photos/cloudinary";

export default function TripsList() {
  let { data: trips, isLoading } = useTrips();

  if (isLoading) return null;

  return (
    <div>
      <h1>Trips</h1>
      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr)",
        }}
      >
        {trips?.map((trip) => (
          <TripCard key={trip.item.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

function useTrips() {
  let refreshToken = useSyncListener(["trips"]);
  return useAsyncData<TripModel[]>(TripModel.loadAll, [refreshToken], null);
}

function TripCard({ trip }: { trip: TripModel }) {
  let coverPhotos = [
    getCloudinaryImageUrl(trip?.photos?.[0]?.item?.publicId) || "/images/mountains.png",
    getCloudinaryImageUrl(trip?.photos?.[1]?.item?.publicId) || "/images/mountains.png",
    getCloudinaryImageUrl(trip?.photos?.[2]?.item?.publicId) || "/images/mountains.png",
  ];
  return (
    <Link to={trip.item.id}>
      <div className="card">
        <div style={{ display: "grid", gap: "1px", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {coverPhotos.map((imgUrl) => (
            <img
              src={imgUrl}
              alt="Trip Cover Photo"
              style={{ height: "130px", objectFit: "cover", width: "100%" }}
            />
          ))}
        </div>

        <div className="card-body">
          <h4 className="card-title">{trip.item.title}</h4>
          <h5
            className="card-subtitle"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>{trip.item.destination}</span>
            <span>
              <div>{dayjs(trip.item.start).format("MM/DD/YY")}</div>
              <div>{dayjs(trip.item.end).format("MM/DD/YY")}</div>
            </span>
          </h5>
          <p className="card-text"></p>

          <Link to={trip.item.id + "/dailyLogs/new"}>+ Daily Log</Link>
          <Link to={trip.item.id + "/edit"}>Edit Trip</Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              trip.remove();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
}
