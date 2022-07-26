import dayjs, { Dayjs } from "dayjs";

export const getClassName = (classNames: string[]) => classNames.filter(Boolean).join(" ");

export const getDateMidpoint = (
  { start, end }: { start: Dayjs; end: Dayjs } = { start: null, end: null }
) => {
  if (!start || !end) return null;
  return start.add(end.diff(start) / 2);
};

export const isBetween = (date, start, end) => {
  let day = dayjs(date);
  return (day.isSame(start) || day.isAfter(start)) && (day.isSame(end) || day.isBefore(end));
};

export const formatTimestampDisplay = (date) => {
  if (!date) return "";
  return dayjs(date).format("M/D/YYYY h:mm a");
};

export const wait = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
};
