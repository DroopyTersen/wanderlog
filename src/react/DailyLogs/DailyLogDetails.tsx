import React from "react";
import { useParams } from "react-router-dom";
import useAsyncData from "../shared/useAsyncData";
import { DailyLogModel } from "../../models";
import dayjs from "dayjs";
import { HightlightsDisplay } from "./highlights";
import { TagsDisplay } from "../shared/tags/tags";
import { LinkButton } from "../global/Header/Header";

export default function DailyLogDetails() {
  let { logId } = useParams();
  let { data: dailyLog, isLoading } = useAsyncData<DailyLogModel>(
    DailyLogModel.load,
    [logId],
    null
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="content">
      <h1>{dailyLog.title}</h1>
      <div>
        <LinkButton to="edit">Edit</LinkButton>
      </div>
      <TagsDisplay tags={dailyLog.item.tags} />
      <HightlightsDisplay highlights={dailyLog.item.highlights} />
    </div>
  );
}
