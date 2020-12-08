import React, { useEffect } from "react";
import { PageTitle, Tag, TagPicker, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { Footer } from "global/components";
import { DatePicker } from "core/components/inputs/DatePicker";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

export function TripForm({ values, save, availableTags }: TripFormProps) {
  let form = useFormStateMachine<TripFormValues>({
    values,
    validate: validateTrip,
    submit: save,
  });
  let mode = values.id ? "Edit" : "New";
  let [deleteTrip, isDeleting] = useDelete(values.id);
  return (
    <>
      <PageTitle>{`${mode} Trip`}</PageTitle>
      <form onSubmit={form.onSubmit}>
        <label htmlFor="title">
          Trip Title
          <textarea rows={2} {...form.getInputProps("title")} autoComplete="off" required />
        </label>
        <label htmlFor="start">
          Start Date
          <DatePicker
            placeholder="Start Date"
            value={form.values.start}
            onChange={(value) => form.actions.updateField({ field: "start", value })}
          />
        </label>
        <label htmlFor="end">
          End Date
          <DatePicker
            placeholder="End Date"
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
        {mode === "Edit" && (
          <button className="scary" onClick={deleteTrip} disabled={isDeleting}>
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

function useDelete(id) {
  let navigate = useNavigate();
  let [deleteResult, deleteMutation] = useMutation(DELETE_MUTATION);
  useEffect(() => {
    if (deleteResult?.data?.delete_trips) {
      navigate("/trips");
    }
  }, [deleteResult.data]);

  let deleteItem = () => {
    if (window.confirm("Are you sure?!")) {
      deleteMutation({ id }, {});
    }
  };

  return [deleteItem, deleteResult.fetching] as [() => void, boolean];
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

export const DELETE_MUTATION = `
mutation DeleteTrip($id:Int!) {
  delete_tag_trip(where: {trip_id: {_eq: $id }}) {
    affected_rows
  }
  delete_trips(where: {id: {_eq: $id }}) {
    affected_rows
    returning {
      id
    }
  }
}
`;
