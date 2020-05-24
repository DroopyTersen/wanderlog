import dayjs from "dayjs";

export const generateId = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

export const wait = (delay = 100) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

export function displayDate(date: string | Date, format = "M/DD/YYYY") {
  return dayjs(date).format(format);
}

export function checkInDateRange(date: string | Date, start: string | Date, end: string | Date) {
  if (!date || !start || !end) return false;
  return (
    (dayjs(date).isAfter(start) || dayjs(date).isSame(start)) &&
    (dayjs(date).isBefore(end) || dayjs(date).isSame(end))
  );
}
