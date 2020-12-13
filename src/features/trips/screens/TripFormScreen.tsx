import React from "react";
import { useParams } from "react-router-dom";
import { TripForm, TripFormValues } from "../components/TripForm";
import { pick } from "core/utils";
import { useResourceWithTags } from "features/shared/useResource";
import { Loader } from "core/components";

export function TripFormScreen() {
  let { tripId = 0 } = useParams();
  let { data, fetching, error, save, loading, deleteItem } = useResourceWithTags<ScreenData>({
    resourceId: tripId,
    query: { query: QUERY, variables: { id: tripId } },
    INSERT,
    UPDATE,
    DELETE,
    tagKey: "trip_id",
    successRedirect: (data) => `/trips/${data.trip.id}`,
    deleteRedirect: (data) => "/trips",
  });

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (loading) {
    return <Loader />;
  }

  return (
    <TripForm
      fetching={fetching}
      deleteItem={deleteItem}
      values={toFormValues(data?.trip)}
      save={save}
      availableTags={data?.tags}
    />
  );
}

interface ScreenData {
  trip?: {
    id: Number;
    title: string;
    start: string;
    end: string;
    destination?: string;
    tags: { tag: { name: string; id: number } }[];
  };
  tags: { name: string; id: number }[];
}

const QUERY = `
query hydrateTripForm($id:Int!) {
    trip: trips_by_pk(id: $id) {
        id
        title
        start
        end
        destination
        tags {
          tag_id
          trip_id
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
}
  `;

const UPDATE = `
mutation updateTrip($id: Int!, $updates: trips_set_input!, $tagsInput: [tag_trip_insert_input!]!) {
    delete_tag_trip(where: {trip_id: {_eq: $id}}) {
      affected_rows
    }
    insert_tag_trip(objects: $tagsInput) {
      returning {
        created_at
        trip_id
        tag_id
        tag {
          name
          id
        }
      }
    }
    trip: update_trips_by_pk(pk_columns: {id: $id}, _set: $updates) {
      id
      title
      start
      end
      destination
      tags {
          tag {
              name
              id
          }
      }
    }
  }
`;

export const INSERT = `
mutation insertTrip($object: trips_insert_input!) {
    trip: insert_trips_one(object: $object) {
        id
        title
        start
        end
        destination
        tags {
            tag {
                name
                id
            }
        }
    }
}`;

export const DELETE = `
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

export const EMPTY_TRIP: TripFormValues = {
  title: "",
  start: "", //dayjs().add(-14, "day").startOf("day").format("YYYY-MM-DD"),
  end: "", //dayjs().startOf("day").format("YYYY-MM-DD"),
  destination: "",
  tags: [],
};

const toFormValues = (item): TripFormValues => {
  if (!item) return EMPTY_TRIP;
  return {
    ...pick(item, ["id", "title", "destination", "start", "end"]),
    tags: item?.tags?.map(({ tag }) => tag),
  };
};
