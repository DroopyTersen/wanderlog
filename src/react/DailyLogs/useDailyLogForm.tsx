import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { TripModel, DailyLogModel } from "../../models";
import { useModelForm } from "../shared/useModelForm";
import { TagsInput, TagsDisplay } from "../shared/tags/tags";
import { HighlightsInput, HightlightsDisplay } from "./highlights";
import { useParams } from "react-router-dom";
import useAsyncData from "../shared/useAsyncData";

// 1. Get the Date!
// Is there a Daily Log Id?
// Yes -> get the date from that

// Is there a Trip Id?
// Yes -> show a dropdown of Trip days and make them pick
//    - Default to the first open day

// No Trip Id and No  Daily Log Id?
// Show a full date date picker, defaulted to

// 2. When the date changes, need to reset the form
// - put a key around everything but date?)
// - we need to see if there is already a trip at that date and show that trip in edit mode
// - If not do we clear out the other stuff?

export function useDailyLogFormDate() {
  let { tripId, logId } = useParams();
  let [date, setDate] = useState("");

  let { data: dateOptions, isLoading } = useAsyncData(
    async (tripId) => {
      if (!tripId) return [];

      let trip = await TripModel.load(tripId);
      return trip.getTripDates().map((date, index) => ({
        value: dayjs(date).format("YYYY-MM-DD"),
        text: `${dayjs(date).format("ddd M/DD/YYYY")}`,
      }));
    },
    [tripId],
    []
  );
  let DateInput = <input type="date" name="date" onChange={(e) => setDate(e.target.value)} />;
  if (tripId) {
    DateInput = (
      <select name="date" value={date} onChange={(e) => setDate(e.target.value)}>
        <option></option>
        {dateOptions.map((dateOption) => (
          <option key={dateOption.value} value={dateOption.value}>
            {dateOption.text}
          </option>
        ))}
      </select>
    );
  }
  // If logId set the date to the log's date
  // If tripId, set the date to the first available trip date

  return [date, DateInput];
  // let Input =
}

function useDailyLogForm() {}
