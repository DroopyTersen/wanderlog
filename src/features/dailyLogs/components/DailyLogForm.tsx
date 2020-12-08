import dayjs from "dayjs";
import React, { useEffect } from "react";
import { PageTitle, Tag, TagPicker, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { getDaysInRange } from "core/utils";
import { MemoriesDisplay } from "./Memories";
import { Footer } from "global/components";
import { PickerSingle } from "core/components/inputs/Picker";
import { useNavigate } from "react-router";
import { useMutation } from "urql";
import { FaRegTrashAlt } from "react-icons/fa";

export function DailyLogForm({ trip, values, save, availableTags, mode }: DailyLogFormProps) {
  let form = useFormStateMachine<DailyLogFormValues>({
    values,
    validate: validate,
    submit: save,
  });
  let [deleteDailyLog, isDeleting] = useDelete(values?.id, trip?.id);

  let dateOptions = trip
    ? getDaysInRange(trip.start, trip.end).map((d) => ({
        label: `Day ${dayjs(d).diff(dayjs(trip.start), "day") + 1}: ${dayjs(d).format(
          "MM/DD/YYYY"
        )}`,
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
            <PickerSingle
              value={values.date}
              onChange={(value) => form.actions.updateField({ field: "date", value })}
              options={dateOptions}
              isDisabled={mode === "edit"}
            />
          ) : (
            // <select {...form.getInputProps("date")}>
            //   <option></option>
            //   {dateOptions.map((dateOption) => (
            //     <option key={dateOption.value} value={dateOption.value}>
            //       {dateOption.text}
            //     </option>
            //   ))}
            // </select>
            <input type="date" {...form.getInputProps("date")} />
          )}
        </label>
        <label htmlFor="tags">
          Tags
          <TagPicker
            key={availableTags.length}
            availableTags={availableTags}
            values={values.tags.map((t) => t.id)}
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
  trip?: { start: string; end: string; id: number };
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

function useDelete(id, tripId) {
  let navigate = useNavigate();
  let [deleteResult, deleteMutation] = useMutation(DELETE_MUTATION);

  useEffect(() => {
    if (deleteResult?.data?.delete_dailylogs) {
      navigate("/trips/" + tripId);
    }
  }, [deleteResult.data, tripId]);

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
      }
    }
  }
`;
