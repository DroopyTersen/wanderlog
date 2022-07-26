import dayjs from "dayjs";

export const VALUE_FORMAT = "YYYY-MM-DD";

export const formatValue = (d) => dayjs(d).format(VALUE_FORMAT);
type Unit = "month" | "week" | "day";

export const prev = (date: string, unit: Unit) =>
  formatValue(dayjs(date).add(-1, unit));
export const next = (date: string, unit: Unit) =>
  formatValue(dayjs(date).add(1, unit));
