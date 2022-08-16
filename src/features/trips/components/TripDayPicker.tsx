import dayjs from "dayjs";
import { formatDateId, getDaysInRange } from "~/common/utils";
import { SelectField, SelectFieldProps } from "~/components/inputs/SelectField";
import { TripDto } from "../trip.types";

interface TripDayPickerProps extends Omit<SelectFieldProps, "children"> {
  trip: TripDto;
}

export function TripDayPicker({ trip, ...rest }: TripDayPickerProps) {
  let tripDates = getDaysInRange(trip.start, trip.end);

  return (
    <SelectField {...(rest as any)}>
      <option value="">Select a date</option>
      {tripDates.map((date, index) => (
        <option key={formatDateId(date)} value={formatDateId(date)}>
          Day {index + 1} {dayjs(date).format("ddd MMM D, YYYY")}
        </option>
      ))}
    </SelectField>
  );
}
