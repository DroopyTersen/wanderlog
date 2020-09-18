import React from "react";
import { useDailyLog } from "../dailyLogs.hooks";
import { useDailyLogForm } from "./useDailyLogForm";

export default function DailyLogForm() {
  let { form, DateInput, trip } = useDailyLogForm();
  if (form.uiStatus === "loading") return <div>Loading...</div>;

  return (
    <form>
      <label htmlFor="date">
        Date
        <input type="date" name="date" />
      </label>
    </form>
  );
}
