import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { TripModel, DailyLogModel } from "../../models";
import { useModelForm } from "../shared/useModelForm";
import { TagsInput, TagsDisplay } from "../components/tags/tags";
import { HighlightsInput, HightlightsDisplay } from "./highlights";
import { useParams, useNavigate } from "react-router-dom";
import useAsyncData from "../hooks/useAsyncData";

export function useDailyLogForm() {
  let navigate = useNavigate();
  let { trip, dailyLog } = useModels();
  let [date, DateInput] = useDailyLogFormDate(trip, dailyLog);
  let form = useModelForm<DailyLogModel>([date], DailyLogModel.loadByDate);
  if (form.uiStatus === "success") {
    setTimeout(() => {
      navigate("/dailyLogs/" + dailyLog.item.id);
    }, 0);
  }

  return {
    trip,
    form,
    date,
    DateInput,
  };
}

export function useDailyLogFormDate(trip: TripModel, dailyLog: DailyLogModel) {
  let { tripId } = useParams();

  let [dateOptions, setDateOptions] = useState(() => {
    return (trip?.getTripDates?.() || []).map(dateToOption);
  });

  let [date, setDate] = useState(() => {
    return dailyLog?.item?.date || "";
  });

  useEffect(() => {
    setDateOptions((trip?.getTripDates?.() || []).map(dateToOption));
  }, [trip?.item?.id]);

  let DateInput = (
    <input type="date" value={date} name="date" onChange={(e) => setDate(e.target.value)} />
  );

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
  useEffect(() => {
    let logDate = dailyLog?.item?.date;
    if (logDate) {
      setDate(logDate);
    }
  }, [dailyLog?.item?.date]);

  // TODO: If tripId, set the date to the first available trip date

  return [date, DateInput];
  // let Input =
}

function useModels() {
  let { tripId, logId } = useParams();
  let { data, isLoading } = useAsyncData<{ trip?: TripModel; dailyLog?: DailyLogModel }>(
    async (tripId, logId) => {
      let trip = null;

      if (tripId) {
        trip = await TripModel.load(tripId);
      }

      let dailyLog = await DailyLogModel.load(logId);

      return {
        trip,
        dailyLog,
      };
    },
    [tripId, logId],
    {}
  );
  return data;
}

const dateToOption = (date: string | Date) => {
  return {
    value: dayjs(date).format("YYYY-MM-DD"),
    text: `${dayjs(date).format("ddd M/DD/YYYY")}`,
  };
};
