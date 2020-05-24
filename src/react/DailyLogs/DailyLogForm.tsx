import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { TripModel, DailyLogModel } from "../../models";
import { useModelForm } from "../shared/useModelForm";
import { TagsInput, TagsDisplay } from "../shared/tags/tags";
import { HighlightsInput, HightlightsDisplay } from "./highlights";
import { useParams } from "react-router-dom";
import { useDailyLogFormDate } from "./useDailyLogForm";
import { displayDate } from "../../core/utils";
import { FormActions } from "../shared/useForm";

export default function DailyLogForm({ onSuccess = () => {}, onCancel }) {
  let [date, DateInput] = useDailyLogFormDate();
  let form = useModelForm<DailyLogModel>([date], DailyLogModel.loadByDate);
  if (form.uiStatus === "success") {
    setTimeout(() => {
      // onSuccess();
    }, 0);
  }

  if (form.uiStatus === "loading") return <div>Loading...</div>;
  console.log(form?.uiStatus);

  // TODO: show the Trip info with a link back to the trip if the date is within a trip range

  return (
    <form {...form.formProps}>
      <label htmlFor="date">
        Date
        {DateInput}
      </label>
      {/* <form.ModelInput name="date" label="Date" form={form} type="hidden" required /> */}

      <TagsInput
        onChange={(tags) => form.update("tags", tags)}
        initialTags={form.model?.item?.tags}
      />

      <TagsDisplay style={{ margin: "-10px 0 20px 0" }} tags={form?.model?.item?.tags} />

      <HighlightsInput
        onChange={(highlights) => form.update("highlights", highlights)}
        initialHighlights={form?.model?.item?.highlights}
      />

      <HightlightsDisplay
        style={{ margin: "-10px 0 20px 0" }}
        highlights={form?.model?.item?.highlights}
      />

      <FormActions isValid={form.uiStatus === "valid"} />
    </form>
  );
}
