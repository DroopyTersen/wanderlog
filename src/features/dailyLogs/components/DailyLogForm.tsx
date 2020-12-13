import dayjs from "dayjs";
import React, { useEffect } from "react";
import { DatePicker, PageTitle, Tag, TagPicker, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { getDaysInRange } from "core/utils";
import { MemoriesDisplay } from "./Memories";
import { Footer } from "global/components";
import { PickerSingle } from "core/components/inputs/Picker";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";
import { FaRegTrashAlt } from "react-icons/fa";

export function DailyLogForm({ trip, values, save, availableTags, mode }: DailyLogFormProps) {
  let form = useFormStateMachine<DailyLogFormValues>({
    values,
    validate: validate,
    submit: save,
  });
  let [deleteDailyLog, isDeleting] = useDelete(values?.id);

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
      </form>
      <Footer>
        {mode === "edit" && (
          <button className="scary" onClick={deleteDailyLog} disabled={isDeleting}>
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

function useDelete(id) {
  let navigate = useNavigate();
  let [deleteResult, deleteMutation] = useMutation(DELETE_MUTATION);

  useEffect(() => {
    if (deleteResult?.data?.delete_dailylogs) {
      let tripId = deleteResult?.data?.delete_dailylogs?.returning?.[0]?.trip_id;
      let path = tripId ? `/trips/${tripId}` : "/dailylogs";
      navigate(path);
    }
  }, [deleteResult.data]);

  let deleteItem = () => {
    if (window.confirm("Are you sure?!")) {
      deleteMutation({ id }, {});
    }
  };
  return [deleteItem, deleteResult.fetching] as [() => void, boolean];
}

const DELETE_MUTATION = `
mutation DeleteDailyLog($id:Int!) {
  delete_tag_dailylog(where: {dailylog_id: {_eq: $id }}) {
    affected_rows
  }
  delete_dailylogs(where: {id: {_eq: $id }}) {
    affected_rows
    returning {
      id
      trip_id
    }
  }
}
`;
