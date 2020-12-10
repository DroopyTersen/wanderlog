import React from "react";
import { pick } from "core/utils";
import { useResourceWithTags } from "features/shared/mutationHelpers";
import { useParams } from "react-router";
import { DailyLogForm, DailyLogFormValues } from "../components/DailyLogForm";
import dayjs from "dayjs";

export function DailyLogFormScreen() {
  let { tripId = 0, dailyLogId = 0 } = useParams();
  let { data, fetching, save } = useResourceWithTags<ScreenData>({
    resourceId: dailyLogId,
    query: { query: QUERY, variables: { id: dailyLogId, tripId } },
    INSERT,
    UPDATE,
    tagKey: "dailylog_id",
    successRedirect: (data) =>
      tripId ? `/trips/${tripId}/dailyLogs-${data.dailyLog.id}` : `/dailyLogs/${data.dailyLog.id}`,
  });
  console.log("🚀 | DailyLogFormScreen | tripId", tripId, data, fetching);

  if (data?.tags) {
    return (
      <DailyLogForm
        key={tripId}
        values={toFormValues(data?.dailyLog)}
        save={save}
        trip={data?.trip}
        availableTags={data?.tags}
        mode={dailyLogId ? "edit" : "new"}
      />
    );
  }
  return <div>Loading...</div>;
}

interface ScreenData {
  trip?: {
    id: number;
    start: string;
    end: string;
    dailyLogs: { date: string; id: number }[];
  };
  dailyLog?: {
    id: number;
    date: string;
    memories: string;
    tags: { tag: { name: string; id: number } }[];
  };
  tags: { name: string; id: number }[];
}

const EMPTY_DAILY_LOG = {
  date: "",
  tags: [],
  memories: "",
};

const toFormValues = (item: any): DailyLogFormValues => {
  if (!item) {
    return EMPTY_DAILY_LOG;
  }
  return {
    ...pick(item, ["id", "date", "memories"]),
    tags: item?.tags?.map(({ tag }) => tag),
  };
};

const QUERY = `
query HydrateDailyLogForm($id: Int!, $tripId: Int!) {
  dailyLog: dailylogs_by_pk(id: $id) {
    id
    date
    memories
    tags {
      tag_id
      dailylog_id
      tag {
        name
        id
      }
    }
  }
  tags {
    name
    id
  }
  trip: trips_by_pk(id: $tripId) {
    id
    title
    start
    end
    dailyLogs {
      id
      date
    }
  }
}

`;

const UPDATE = `
mutation updateDailyLog($id: Int!, $updates: dailylogs_set_input! $tagsInput: [tag_dailylog_insert_input!]!) {
  delete_tag_dailylog(where: {dailylog_id: {_eq: $id }}) {
    affected_rows
  }
  insert_tag_dailylog(objects: $tagsInput) {
    returning {
      tag_id
      dailylog_id
      tag {
        name
        id
      }
    }
  }
  dailyLog: update_dailylogs_by_pk(pk_columns: { id:$id }, _set: $updates ) {
    id
    memories
    date
    tags {
      tag {
        name
        id
      }
    }
  }
}
`;

const INSERT = `
mutation insertDailyLog($object: dailylogs_insert_input!) {
  dailyLog: insert_dailylogs_one(object: $object) {
    id
    memories
    date
    tags {
      tag {
        name
        id
      }
    }
  }
}
`;
