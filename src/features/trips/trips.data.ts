import dayjs from "dayjs";

export interface TripFormValues {
  id?: Number;
  title: string;
  start: string;
  end: string;
  destination?: string;
  tags: string[];
}

export interface TripItem {
  id?: Number;
  title: string;
  start: string;
  end: string;
  destination?: string;
  tags: {}[];
}

export const EMPTY_TRIP: TripFormValues = {
  title: "",
  start: dayjs().add(-14, "day").startOf("day").format("YYYY-MM-DD"),
  end: dayjs().startOf("day").format("YYYY-MM-DD"),
  destination: "",
  tags: [],
};

export const validateTrip = (values: TripFormValues) => {
  const errors = [];
  if (!values.title) {
    errors.push("Title is required");
  }
  if (!values.start) {
    errors.push("Start date is required");
  }
  if (!values.end) {
    errors.push("End date is required");
  }
  return errors;
};

export const toTripFormValues = (tripItem): TripFormValues => {
  return {
    id: tripItem.id,
    title: tripItem.title,
    destination: tripItem.destination,
    start: dayjs(tripItem.start).format("YYYY-MM-DD"),
    end: dayjs(tripItem.end).format("YYYY-MM-DD"),
    tags: tripItem?.tags?.map((data) => data?.tag?.name).filter(Boolean),
  };
};
