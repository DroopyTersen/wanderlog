import dayjs from "dayjs";
import React, { useEffect } from "react";
import { DatePicker, PageTitle, Tag, TagPicker, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { getDaysInRange } from "core/utils";
import { MemoriesDisplay } from "./Memories";
import { Footer } from "global/components";
import { FaRegTrashAlt } from "react-icons/fa";

export function DailyLogForm({
  trip,
  values,
  save,
  availableTags,
  mode,
  deleteItem,
  fetching,
}: DailyLogFormProps) {
  let form = useFormStateMachine<DailyLogFormValues>({
    values,
    validate: validate,
    submit: save,
  });

  let tripDates =
    getDaysInRange(trip?.start, trip?.end).map((d) => dayjs(d).format("YYYY-MM-DD")) || [];
  let usedDates = trip?.dailyLogs?.map((dl) => dl.date) || [];
  let availableDates = tripDates.filter((d) => !usedDates.includes(d));

  useEffect(() => {
    if (!form.values.date) {
      form.actions.updateField({ field: "date", value: availableDates?.[0] });
    }
  }, [availableDates?.[0], form.values.date]);

  return (
    <>
      <PageTitle>
        {values.id ? `Edit: ${dayjs(values.date).toDate().toLocaleDateString()}` : "New Daily Log"}
      </PageTitle>
      <form onSubmit={form.onSubmit}>
        <fieldset disabled={fetching}>
          {!values.id && (
            <label htmlFor="date">
              Date
              <DatePicker
                value={form.values.date}
                onChange={(value) => form.actions.updateField({ field: "date", value })}
                options={{
                  checkEnabled: (date) =>
                    tripDates.length > 0 ? availableDates.includes(date) : true,
                  getDayClass: (date) =>
                    `${usedDates.includes(date) ? "existing-dailylog-date" : ""} ${
                      tripDates.includes(date) ? "trip-date" : ""
                    }`,
                }}
              />
            </label>
          )}
          <label htmlFor="tags">
            Tags
            <TagPicker
              key={availableTags.length}
              availableTags={availableTags}
              values={form.values.tags.map((t) => t.id)}
              onChange={(value) => form.actions.updateField({ field: "tags", value })}
            />
          </label>
          <label htmlFor="memories">
            Memories
            <textarea rows={6} {...form.getInputProps("memories")} />
          </label>
          <MemoriesDisplay memories={form.values.memories} />
        </fieldset>
      </form>
      <Footer>
        {mode === "edit" && (
          <button className="scary" onClick={deleteItem} disabled={fetching}>
            <FaRegTrashAlt />
          </button>
        )}
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button
          type="button"
          className="gold"
          onClick={form.onSubmit}
          disabled={form.status !== "VALID"}
        >
          Save
        </button>
      </Footer>
    </>
  );
}

export interface DailyLogFormValues {
  id?: Number;
  date: string;
  tags: Tag[];
  memories: string;
}

export interface DailyLogFormProps {
  values: DailyLogFormValues;
  save: (value: DailyLogFormValues) => Promise<any>;
  fetching: boolean;
  deleteItem: () => void;
  trip?: { start: string; end: string; id: number; dailyLogs: { date: string; id: number }[] };
  availableTags: Tag[];
  mode?: "edit" | "new";
}

export const validate = (values: DailyLogFormValues) => {
  const errors = [];
  if (!values.date) {
    errors.push("Date is required");
  }
  return errors;
};
