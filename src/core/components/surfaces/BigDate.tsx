import React from "react";
import dayjs from "dayjs";
import "./BigDate.scss";

export type BigDateVariant = "month" | "day-date-month" | "date-month";
export interface BigDateProps {
  date: string | Date;
  className?: string;
  variant?: BigDateVariant;
}
export function BigDate({ date, className = "", variant = "date-month" }: BigDateProps) {
  return (
    <div className={"big-date " + className}>
      {variant === "day-date-month" && <div className="day">{dayjs(date).format("ddd")}</div>}
      {variant !== "month" && <div className="date-number">{dayjs(date).format("DD")}</div>}
      <div className="month-year">
        <div className="month">
          {dayjs(date)
            .format("MMM")
            .split("")
            .map((c) => (
              <span>{c}</span>
            ))}
        </div>
        <div className="year">
          {dayjs(date)
            .format("YYYY")
            .split("")
            .map((c) => (
              <span>{c}</span>
            ))}
        </div>
      </div>
    </div>
  );
}
