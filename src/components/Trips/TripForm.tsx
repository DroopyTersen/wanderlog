import React, { useState, useEffect, useMemo, useReducer } from "react";
import { TripModel } from "../../models";
import { useModelForm } from "../shared/useModelForm";
import { useNavigate, useParams } from "react-router";

export default function TripForm({ id = "" }) {
  let navigate = useNavigate();
  let form = useModelForm<TripModel>(id, TripModel.load);
  let { ModelInput, uiStatus, formProps } = form;
  if (uiStatus === "loading") return <div>Loading...</div>;
  console.log("valid form", form.model.checkIsValid(), uiStatus);

  if (uiStatus === "success") {
    setTimeout(() => {
      navigate("/trips/" + form.model.item.id);
    }, 0);
  }
  return (
    <form {...formProps}>
      <ModelInput name="title" label="Trip Title" form={form} required />
      <ModelInput name="destination" label="Primary Destination" form={form} required />

      <ModelInput name="start" label="Start Date" type="date" form={form} required />

      <ModelInput name="end" label="End Date" type="date" form={form} required />

      <input type="submit" disabled={uiStatus !== "valid"} />
    </form>
  );
}

export function NewTripScreen() {
  return (
    <div>
      <h1>New Trip</h1>
      <TripForm />
    </div>
  );
}

export function EditTripScreen() {
  let { id } = useParams();
  return (
    <div>
      <h1>Edit Trip</h1>
      <TripForm id={id} />
    </div>
  );
}
