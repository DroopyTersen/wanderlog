import { PageTitle, TagsDisplay, TagsInput } from "core/components";
import { Footer, Header } from "global/components";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNewTrip } from "./useTripForm";

export function NewTripForm() {
  let {
    formProps,
    submit,
    result: { error, fetching, data },
  } = useNewTrip();

  let navigate = useNavigate();
  useEffect(() => {
    if (data && data.newTrip && data.newTrip.id) {
      navigate("/trips/" + data.newTrip.id);
    }
  }, [data]);

  return (
    <>
      <Header title={`Trips`} />
      <PageTitle>New Trip</PageTitle>
      <form {...formProps}>
        <label htmlFor="title">
          Trip Title
          <input name="title" required />
        </label>

        <label htmlFor="start">
          Start Date
          <input type="date" name="start" required />
        </label>

        <label htmlFor="end">
          End Date
          <input type="date" name="end" required />
        </label>

        <label htmlFor="destination">
          Primary Destination
          <input name="destination" />
        </label>
      </form>
      <Footer>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button type="button" className="gold" onClick={submit} disabled={fetching}>
          Save
        </button>
      </Footer>
    </>
  );
}
