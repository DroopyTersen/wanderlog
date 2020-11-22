import { PageTitle, TagsDisplay, TagsInput } from "core/components";
import { useFormStateMachine } from "core/hooks/useForm";
import { Footer, Header } from "global/components";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "urql";
import {
  GET_TRIP_BY_ID_QUERY,
  INSERT_TRIP_MUTATION,
  UPDATE_TRIP_MUTATION,
  insertTrip,
  updateTrip,
} from "./trips.mutations";
import { EMPTY_TRIP, toTripFormValues, TripFormValues, validateTrip } from "./trips.data";

export function NewTripForm() {
  let [insertResult, mutation] = useMutation(INSERT_TRIP_MUTATION);
  console.log("NewTripForm -> insertResult", insertResult);
  let existingTags = useTags();
  const save = (values) => insertTrip(values, mutation, existingTags);
  useSuccessRedirect(insertResult.data);
  return <TripForm values={EMPTY_TRIP} save={save} />;
}

export function EditTripForm() {
  let { tripId } = useParams();
  let [{ data, fetching, error }] = useQuery({
    query: GET_TRIP_BY_ID_QUERY,
    variables: { id: tripId },
  });
  let [result, mutation] = useMutation(UPDATE_TRIP_MUTATION);
  let existingTags = useTags();
  const save = (values) => updateTrip(values, mutation, existingTags);
  useSuccessRedirect(result.data);

  if (fetching) {
    return <div>Loading...</div>;
  } else if (data?.trip?.id) {
    console.log("EditTripForm -> data", data.trip.id, fetching);

    return <TripForm values={toTripFormValues(data.trip)} save={save} />;
  }
  return <h1>{tripId}</h1>;
}

const TAGS_QUERY = `query GetTags {
    tags {
      name
      id
      author_id
    }
  }
`;

function useTags() {
  let [{ data }] = useQuery({ query: TAGS_QUERY });
  return data?.tags ?? [];
}

function useSuccessRedirect(data) {
  let navigate = useNavigate();
  useEffect(() => {
    console.log("useSuccessRedirect -> data", data);
    if (data?.trip?.id) {
      navigate(`/trips/${data.trip.id}/edit`);
    }
  }, [data]);
}

interface TripFormProps {
  values: TripFormValues;
  save: (values: TripFormValues) => Promise<any>;
}

function TripForm({ values, save }: TripFormProps) {
  let form = useFormStateMachine<TripFormValues>({
    values,
    validate: validateTrip,
    submit: save,
  });

  console.log("TripForm -> form.status", form.status);
  return (
    <>
      <PageTitle>{values.id ? "Edit Trip" : "New Trip"}</PageTitle>
      <form onSubmit={form.onSubmit}>
        <label htmlFor="title">
          Trip Title
          <textarea rows={2} {...form.getInputProps("title")} autoComplete="off" required />
        </label>
        <div className="row">
          <label htmlFor="start">
            Start Date
            <input {...form.getInputProps("start")} type="date" required />
          </label>

          <label htmlFor="end">
            End Date
            <input {...form.getInputProps("end")} type="date" required autoComplete="off" />
          </label>
        </div>
        <label htmlFor="destination">
          Primary Destination
          <textarea rows={3} {...form.getInputProps("destination")} />
        </label>
        <TagsInput
          name="tags"
          initialTags={form.values.tags}
          onChange={(value) => form.actions.updateField({ field: "tags", value })}
        />
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
