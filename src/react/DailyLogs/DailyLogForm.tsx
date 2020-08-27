import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { TripModel, DailyLogModel } from "../../models";
import { useModelForm } from "../shared/useModelForm";
import { TagsInput, TagsDisplay } from "../components/tags/tags";
import { HighlightsInput, HightlightsDisplay } from "./highlights";
import { useDailyLogForm } from "./useDailyLogForm";

import { FormActions } from "../shared/useForm";
import { Link } from "react-router-dom";
import AppBackground from "../global/AppBackground/AppBackground";
import Footer from "../global/Footer/Footer";
import Header from "../global/Header/Header";

export default function DailyLogForm({ onSuccess = () => {}, onCancel, mode = "Edit" }) {
  let { form, DateInput, trip } = useDailyLogForm(onSuccess);
  if (form.uiStatus === "loading") return <div>Loading...</div>;

  // TODO: show the Trip info with a link back to the trip if the date is within a trip range

  return (
    <>
      <AppBackground variant="blurred" />
      <Header title={mode} />

      <form {...form.formProps}>
        {trip?.item?.title && (
          <div className="trip">
            <Link to={"/trips/" + trip?.item?.id}>
              <h3>{trip.item.title}</h3>
            </Link>
          </div>
        )}

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

        <div className="memories" style={{ marginTop: "-20px" }}>
          {form?.model?.item?.highlights.map((memory) => (
            <div key={memory} className="memory">
              {memory}
            </div>
          ))}
        </div>
      </form>
      <Footer className="solid">
        <FormActions isValid={form.uiStatus === "valid"} onSave={form.formProps.onSubmit} />
      </Footer>
    </>
  );
}
