import { PageTitle, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { getDaysInRange } from "core/utils";
import dayjs from "dayjs";
import useTags from "features/tags/useTags";
import { GET_TRIP_BY_ID_QUERY } from "features/trips/trips.mutations";
import React from "react";
import { useParams } from "react-router";
import { useQuery } from "urql";
import { MemoriesDisplay } from "./components/Memories";

export function NewDailyLogScreen() {
  let { tripId } = useParams();
  let existingTags = useTags();
  let [{ data: tripData, fetching }] = useQuery({
    query: GET_TRIP_BY_ID_QUERY,
    variables: { id: tripId },
    pause: !tripId,
  });
  console.log("NewDailyLogScreen -> existingTags", existingTags);

  if (tripId && tripData?.trip?.start) {
    return (
      <DailyLogForm
        values={EMPTY_DAILY_LOG}
        save={() => {}}
        dateRange={{ start: tripData.trip.start, end: tripData.trip.end }}
      />
    );
  } else if (!tripId && !fetching) {
    return <DailyLogForm values={EMPTY_DAILY_LOG} save={() => {}} />;
  }
  return null;
}

interface DailyLogFormProps {
  dateRange?: {
    start: string | Date;
    end: string | Date;
  };
  values: any;
  save: any;
}

export interface DailyLogFormValues {
  id?: Number;
  date: string;
  tags: string[];
  memories: string;
}

export const EMPTY_DAILY_LOG = {
  date: "",
  tags: [],
  memories: "",
};

export const validateDailyLog = (values: DailyLogFormValues) => {
  const errors = [];
  if (!values.date) {
    errors.push("Date is required");
  }
  return errors;
};

export function DailyLogForm({ dateRange, values, save }: DailyLogFormProps) {
  console.log("Date range", dateRange);
  let form = useFormStateMachine<DailyLogFormValues>({
    values,
    validate: validateDailyLog,
    submit: save,
  });
  let dateOptions = dateRange
    ? getDaysInRange(dateRange.start, dateRange.end).map((d) => ({
        text: dayjs(d).format("MM/DD/YYYY"),
        value: dayjs(d).format("YYYY-MM-DD"),
      }))
    : [];
  return (
    <>
      <PageTitle>{values.id ? "Edit Daily Log" : "New Daily Log"}</PageTitle>
      <form onSubmit={form.onSubmit}>
        <label htmlFor="date">
          Date
          {!!dateOptions.length ? (
            <select {...form.getInputProps("date")}>
              <option></option>
              {dateOptions.map((dateOption) => (
                <option key={dateOption.value} value={dateOption.value}>
                  {dateOption.text}
                </option>
              ))}
            </select>
          ) : (
            <input type="date" {...form.getInputProps("date")} />
          )}
        </label>
        <TagsInput
          name="tags"
          initialTags={form.values.tags}
          onChange={(value) => form.actions.updateField({ field: "tags", value })}
        />
        <label htmlFor="memories">
          Memories
          <textarea rows={6} {...form.getInputProps("memories")} />
        </label>
        <MemoriesDisplay memories={form.values.memories} />
      </form>
    </>
  );
}
