import React from "react";
import { useNavigate, useParams } from "react-router";
import useAsyncData from "core/hooks/useAsyncData";
import { useEffects } from "global/overmind";
import { DailyLogItem, DailyLogModel } from "./dailyLogs.models";
import { useModelForm } from "features/_shared/useModelForm";
import { TripModel } from "features/trips/trips.models";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export function useDailyLog(id = "") {
  let { dailyLogId } = useParams();
  const dailyLogKey = id || dailyLogId;
  const { data, isLoading } = useAsyncData<DailyLogModel>(
    async (logId) => {
      let dailyLog = await DailyLogModel.load(logId);
      return dailyLog;
    },
    [dailyLogKey],
    null
  );
  return data;
}
