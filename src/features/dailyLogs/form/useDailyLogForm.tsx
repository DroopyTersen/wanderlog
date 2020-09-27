import React from "react";
import { useNavigate, useParams } from "react-router";
import useAsyncData from "core/hooks/useAsyncData";
import { DailyLogModel } from "../dailyLogs.models";
import { useModelForm } from "features/_shared/useModelForm";
import { TripModel } from "features/trips/trips.models";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export function useDailyLogForm() {
  let navigate = useNavigate();

  let { dailyLogId, startDate, endDate } = useParams();

  let form = useModelForm<DailyLogModel>([dailyLogId], DailyLogModel.load);
  // redirect after success
  if (form.uiStatus === "success" && form?.model?.item?.key) {
    setTimeout(() => {
      navigate("/dailyLogs/" + form.model.item.key);
    }, 0);
  }

  return {
    form,
    // date,
    // DateInput,
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

const dateToOption = (date: string | Date) => {
  return {
    value: dayjs(date).format("YYYY-MM-DD"),
    text: `${dayjs(date).format("ddd M/DD/YYYY")}`,
  };
};
