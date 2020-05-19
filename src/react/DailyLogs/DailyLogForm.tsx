import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router";
import { TripModel, DailyLogModel } from "../../models";
import { useModelForm } from "../shared/useModelForm";
import slugify from "slugify";
import useAsyncData from "../shared/useAsyncData";

export default function DailyLogForm({
  start = "",
  end = "",
  id = "",
  onSuccess = () => {},
  onCancel,
}) {
  let form = useModelForm<DailyLogModel>(id, DailyLogModel.load);

  if (form.uiStatus === "success") {
    setTimeout(() => {
      onSuccess();
    }, 0);
  }

  if (form.uiStatus === "loading") return <div>Loading...</div>;
  return (
    <form {...form.formProps}>
      <form.ModelInput
        name="date"
        label="Date"
        form={form}
        type="date"
        required
        min={start}
        max={end}
      />

      <TagsInput
        onChange={(tags) => form.update("tags", tags)}
        initialTags={form.model?.item?.tags}
      />

      <div className="tags">
        {form.model?.item?.tags?.map((tag) => (
          <div key={tag}>{tag}</div>
        ))}
      </div>

      <HighlightsInput
        onChange={(highlights) => form.update("highlights", highlights)}
        initialHighlights={form?.model?.item?.highlights}
      />

      <ul>
        {form.model.item?.highlights?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {onCancel && (
        <button className="button-outline" type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
      <button type="submit" disabled={form.uiStatus !== "valid"}>
        Save
      </button>
    </form>
  );
}

export function TagsInput({ onChange, initialTags = [] }) {
  let [value, setValue] = useState(initialTags.join(", "));

  useEffect(() => {
    let tags = value
      .replace(/, /g, ",")
      .replace(/ /g, ",")
      .split(",")
      .map((tag) => slugify(tag.trim().toLowerCase()))
      .filter(Boolean);
    onChange(tags);
  }, [value]);

  return (
    <label>
      Tags
      <input name={name} value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export function HighlightsInput({ onChange, initialHighlights = [] }) {
  let [value, setValue] = useState(initialHighlights.join("\n"));
  useEffect(() => {
    let highlights = value
      .split("\n")
      .map((str) => str.trim())
      .filter(Boolean);
    onChange(highlights);
  }, [value]);

  return (
    <label>
      Highlights
      <textarea onChange={(event) => setValue(event.target.value)} value={value}></textarea>
    </label>
  );
}

export function NewDailyLogScreen() {
  let { tripId, logId } = useParams();
  let navigate = useNavigate();
  let navigateToTrip = () => navigate("/trips/" + tripId);
  let { data: trip } = useAsyncData<TripModel>(TripModel.load, [tripId], null);

  return (
    <div>
      <h2>New Trip Log</h2>
      {trip && (
        <DailyLogForm
          start={trip.item.start}
          end={trip.item.end}
          id={logId}
          onSuccess={navigateToTrip}
          onCancel={navigateToTrip}
        />
      )}
    </div>
  );
}

export function EditDailyLogScreen() {
  let { tripId, logId } = useParams();
  let navigate = useNavigate();
  let navigateToTrip = () => navigate("/trips/" + tripId);
  let { data: trip } = useAsyncData<TripModel>(TripModel.load, [tripId], null);

  return (
    <div>
      <h2>Edit Trip Log</h2>
      {trip && (
        <DailyLogForm
          start={trip.item.start}
          end={trip.item.end}
          id={logId}
          onSuccess={navigateToTrip}
          onCancel={navigateToTrip}
        />
      )}
    </div>
  );
}
