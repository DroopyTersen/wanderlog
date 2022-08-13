import dayjs, { Dayjs } from "dayjs";

export const getClassName = (classNames: string[]) =>
  classNames.filter(Boolean).join(" ");

export const getDateMidpoint = (
  { start, end }: { start: Dayjs | null; end: Dayjs | null } = {
    start: null,
    end: null,
  }
) => {
  if (!start || !end) return null;
  return start.add(end.diff(start) / 2);
};

export const isBetween = (date, start, end) => {
  let day = dayjs(date);
  return (
    (day.isSame(start) || day.isAfter(start)) &&
    (day.isSame(end) || day.isBefore(end))
  );
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

function dec2hex(dec) {
  return dec < 10 ? "0" + String(dec) : dec.toString(16);
}

// generateId :: Integer -> String
export function generateId(len = 6) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

export function displayDate(date: string | Date, format = "M/DD/YYYY") {
  return dayjs(date).format(format);
}
export function displayDateRange(start: string | Date, end: string | Date) {
  if (calcNumDays(start, end) === 1) {
    return displayDate(start);
  }
  // TODO: Make this better
  return `${displayDate(start)} - ${displayDate(end)}`;
}

export function calcNumDays(start: string | Date, end: string | Date): number {
  return dayjs(end).diff(dayjs(start), "day") + 1;
}
export function checkInDateRange(
  date: string | Date,
  start: string | Date,
  end: string | Date
) {
  if (!date || !start || !end) return false;
  return (
    (dayjs(date).isAfter(start) || dayjs(date).isSame(start)) &&
    (dayjs(date).isBefore(end) || dayjs(date).isSame(end))
  );
}

export function getDaysInRange(start: string | Date, end: string | Date) {
  if (!start || !end) return [];
  let cur = dayjs(start);
  let endDate = dayjs(end);
  let dates: Date[] = [];

  while (cur.isBefore(endDate) || cur.isSame(endDate)) {
    dates.push(cur.toDate());
    cur = cur.add(1, "day");
  }
  return dates;
}

export function getFiles(fileList: FileList): File[] {
  if (!fileList || !fileList.length) return [];
  let files: File[] = [];
  for (var i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }
  return files;
}

export function formToObject(form: HTMLFormElement) {
  if (!form) return null;
  let formData = new FormData(form);
  var object = {};
  formData.forEach((value, key) => {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  return object;
}

export function pick(obj: any, keys: string[]): any {
  return keys.reduce((newObj, key) => {
    newObj[key] = obj[key];
    return newObj;
  }, {});
}
