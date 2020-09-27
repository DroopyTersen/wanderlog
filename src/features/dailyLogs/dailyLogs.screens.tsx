import React from "react";
import "./dailyLogs.scss";
import DailyLogForm from "./form/DailyLogForm";

export const NewDailyLogScreen = () => {
  return <DailyLogForm title="Add new" />;
};

export const EditDailyLogScreen = () => {
  return <h2>Edit Daily Log</h2>;
};

export const DailyLogDetailsScreen = () => {
  return <h2>DailyLog Details</h2>;
};

export const DailyLogsScreen = () => {
  return <h2>DailyLogs List</h2>;
};
