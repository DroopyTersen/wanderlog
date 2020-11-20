import dayjs from "dayjs";

function dec2hex(dec) {
  return dec < 10 ? "0" + String(dec) : dec.toString(16);
}

// generateId :: Integer -> String
export function generateId(len = 6) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

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

export function getFiles(fileList: FileList): File[] {
  if (!fileList || !fileList.length) return [];
  let files = [];
  for (var i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }
  return files;
}
