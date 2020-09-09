import React from "react";
import dayjs from "dayjs";
import "./BigDate.scss";

export function BigDate({ date }) {
  return (
    <div className="big-date">
      <div className="date-number">{dayjs(date).format("DD")}</div>
      <div>
        <div className="month">{dayjs(date).format("MMM")}</div>
        <div className="year">{dayjs(date).format("YYYY")}</div>
      </div>
    </div>
  );
}
