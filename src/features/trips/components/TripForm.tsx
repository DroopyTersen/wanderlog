import React from "react";
import { PageTitle, Tag, TagPicker, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { Footer } from "global/components";
import { DatePicker } from "core/components/inputs/DatePicker";

export function TripForm({ values, save, availableTags }: TripFormProps) {
  let form = useFormStateMachine<TripFormValues>({
    values,
    validate: validateTrip,
    submit: save,
  });

  console.log("values", values);
  return (
    <>
      <PageTitle>{values.id ? "Edit Trip" : "New Trip"}</PageTitle>
      <form onSubmit={form.onSubmit}>
        <label htmlFor="title">
          Trip Title
          <textarea rows={2} {...form.getInputProps("title")} autoComplete="off" required />
        </label>
        <label htmlFor="start">
          Start Date
          <DatePicker
            value={form.values.start}
            onChange={(value) => form.actions.updateField({ field: "start", value })}
          />
        </label>

        <label htmlFor="start">
          Start Date
          <DatePicker
            value={form.values.start}
            onChange={(value) => form.actions.updateField({ field: "start", value })}
          />
        </label>

        <label htmlFor="end">
          End Date
          <DatePicker
            value={form.values.end}
            onChange={(value) => form.actions.updateField({ field: "end", value })}
          />
        </label>
        <label htmlFor="tags">
          Tags
          <TagPicker
            availableTags={availableTags}
            values={form.values.tags.map((t) => t.id)}
            onChange={(value) => form.actions.updateField({ field: "tags", value })}
          />
        </label>
        <label htmlFor="destination">
          Primary Destination
          <textarea rows={3} {...form.getInputProps("destination")} />
        </label>
      </form>
      <Footer>
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
export interface TripFormValues {
  id?: Number;
  title: string;
  start: string;
  end: string;
  destination?: string;
  tags: Tag[];
}

interface TripFormProps {
  values: TripFormValues;
  save: (values: TripFormValues) => Promise<any>;
  availableTags: Tag[];
}

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
