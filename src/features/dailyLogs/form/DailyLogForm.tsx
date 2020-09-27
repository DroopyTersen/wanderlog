import { PageTitle, TagsDisplay, TagsInput } from "core/components";
import { Footer, Header } from "global/components";
import React from "react";
import { Link } from "react-router-dom";
import { Memories } from "../components/Memories";
import { useDailyLog } from "../dailyLogs.hooks";
import { useDailyLogForm } from "./useDailyLogForm";

export default function DailyLogForm({ title = "" }) {
  let { form } = useDailyLogForm();
  if (form.uiStatus === "loading" || !form.model) return <div>Loading...</div>;

  return (
    <>
      <Header title={`Daily Log`} />
      {title && <PageTitle>{title}</PageTitle>}
      <form {...form.formProps}>
        <label htmlFor="date">
          Date
          <input type="date" name="date" value={form.model.item.date} />
        </label>

        <TagsInput
          onChange={(tags) => form.update("tags", tags)}
          initialTags={form.model?.item?.tags}
        />

        <TagsDisplay style={{ margin: "-10px 0 20px 0" }} tags={form?.model?.item?.tags} />

        <Memories.Input
          onChange={(memories) => form.update("memories", memories)}
          initialMemories={form?.model?.item?.memories}
        />

        <Memories.Display
          style={{ margin: "-10px 0 20px 0" }}
          memories={form?.model?.item?.memories}
        />
      </form>
      <Footer>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button
          type="button"
          className="gold"
          disabled={form.uiStatus !== "valid"}
          onClick={form.formProps.onSubmit}
        >
          Save
        </button>
      </Footer>
    </>
  );
}
