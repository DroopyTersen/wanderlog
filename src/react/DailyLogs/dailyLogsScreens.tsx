import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router";
import { TripModel, DailyLogModel } from "../../models";
import useAsyncData from "../hooks/useAsyncData";
import DailyLogForm from "./DailyLogForm";

export function NewDailyLogScreen() {
  // Get the Date!
  // Is there a Daily Log Id?
  // Yes -> get the date from that

  // Is there a Trip Id?
  // Yes -> show a dropdown of Trip days and make them pick
  //    - Default to the first open day

  // No Trip Id and No  Daily Log Id?
  // Show a full date date picker, defaulted to today

  let { tripId, logId } = useParams();
  let navigate = useNavigate();
  let navigateToTrip = () => navigate("/trips/" + tripId);
  let { data: trip } = useAsyncData<TripModel>(TripModel.load, [tripId], null);

  return (
    <div>
      <h2>New Daily Log</h2>
      {trip && <DailyLogForm onSuccess={navigateToTrip} onCancel={navigateToTrip} />}
    </div>
  );
}

export function EditDailyLogScreen() {
  let { tripId, logId } = useParams();
  let navigate = useNavigate();
  let navigateToTrip = () => navigate("/trips/" + tripId);
  let { data: trip } = useAsyncData<TripModel>(TripModel.load, [tripId], null);

  return (
    <div>
      <h2>Edit Daily Log</h2>
      {trip && <DailyLogForm onSuccess={navigateToTrip} onCancel={navigateToTrip} />}
    </div>
  );
}
