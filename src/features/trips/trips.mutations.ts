import { TripFormValues } from "./trips.data";

const TRIP_FIELDS_FRAGMENT = `
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
`;
export const DELETE_TRIP_MUTATION = `
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
export const INSERT_TRIP_MUTATION = `
mutation insertTrip($object: trips_insert_input!) {
    trip: insert_trips_one(object: $object) {
        ${TRIP_FIELDS_FRAGMENT}
    }
}`;

export const GET_TRIP_BY_ID_QUERY = `
query getTripById($id:Int!) {
    trip: trips_by_pk(id: $id) {
      ${TRIP_FIELDS_FRAGMENT}
    }
}
  `;

export const UPDATE_TRIP_MUTATION = `
mutation updateTrip($tripId: Int!, $updates: trips_set_input!, $tagsInput: [tag_trip_insert_input!]!) {
    delete_tag_trip(where: {trip_id: {_eq: $tripId}}) {
      affected_rows
    }
    insert_tag_trip(objects: $tagsInput) {
      returning {
        created_at
        trip_id
        tag {
          name
          id
        }
      }
    }
    trip: update_trips_by_pk(pk_columns: {id: $tripId}, _set: $updates) {
      ${TRIP_FIELDS_FRAGMENT}
    }
  }
`;

export const updateTrip = async (values: TripFormValues, mutation, existingTags) => {
  let { tags = [], id, ...formFields } = values;

  let { existingTagIds, newTagNames } = processTags(tags, existingTags);
  let tagsInput = [
    ...newTagNames.map((name) => ({
      tag: {
        data: { name },
      },
      trip_id: id,
    })),
    ...existingTagIds.map((tag_id) => ({ tag_id, trip_id: id })),
  ];
  let variables = {
    tripId: id,
    updates: formFields,
    tagsInput,
  };
  let { error, data } = await mutation(variables);
  if (error) throw error;
  return data;
};

const processTags = (tagNames: string[], existingTags: { name: string; id: number }[]) => {
  let newTagNames = tagNames.filter((tagName) => !existingTags.find((t) => t.name === tagName));
  let existingTagIds = tagNames
    .map((tagName) => existingTags.find((t) => t.name === tagName))
    .filter(Boolean)
    .map((t) => t.id);

  return {
    newTagNames,
    existingTagIds,
  };
};
export const insertTrip = async (values: TripFormValues, mutation, existingTags) => {
  let { tags: tagNames = [], ...formFields } = values;
  let { newTagNames, existingTagIds } = processTags(tagNames, existingTags);
  let tagsInput = [
    ...newTagNames.map((name) => ({ tag: { data: { name } } })),
    ...existingTagIds.map((tag_id) => ({ tag_id })),
  ];
  let variables = {
    object: {
      ...formFields,
      tags: {
        data: tagsInput,
      },
    },
  };
  let { error, data } = await mutation(variables);
  if (error) throw error;
  return data;
};
