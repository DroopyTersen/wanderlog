import type { RxJsonSchema } from "rxdb";
import zodToJsonSchema from "zod-to-json-schema";
import { RxCollectionDefinition } from "~/database/database.types";
import { TripHasuraInsertInput, TripItem, tripSchema } from "./trip.types";

const schema: RxJsonSchema<any> = {
  title: "Trips",
  version: 0,
  primaryKey: "id",
  ...(zodToJsonSchema(tripSchema, "Trip").definitions.Trip as any),
  additionalProperties: false,
};

const PULL_QUERY = `query GetLatestTrips($lastSync:timestamptz!) {
  trips(where:{updatedAt:{_gt:$lastSync}}) {
    id
    title
    destination
    start
    end
  	createdAt
    createdById
    updatedAt
    updatedById
    companions {
      userId
    }
  }
}`;

// {
//   "objects": [
//     {
//       "id": 1,
//       "title": "updated title",
//       "destination": "CO",
//       "start": "2022-06-16",
//       "end": "2022-06-21",
//       "companions": { "data": [{ "userId": 4 }] }
//     }
//   ]
// }

// Delete the companions then re-insert them
const PUSH_QUERY = `mutation UpsertTrips($objects:[TripsInsertInput!]!) {
  deleteTripCompanions(where:{tripId:{_eq:1}}) {
  	affected_rows
  }
  insertTrips(objects: $objects, onConflict: { constraint: trips_pkey, update_columns: [title, destination,start,end] }) {
    returning {
      id
      title
      destination
      start
      end
      createdAt
      createdById
      updatedAt
      updatedById
      companions {
        userId
      }
    }
  }
}`;

const buildPushQuery = (items) => {
  let objects: TripHasuraInsertInput[] = items.map((item: TripItem) => {
    let object: TripHasuraInsertInput = {
      title: item.title,
      destination: item.destination,
      start: item.start,
      end: item.end,
      companions: {
        data: item?.companions || [],
      },
    };
    if (item?.id) {
      object.id = parseInt(item.id);
    }
    return {
      id: item?.id ? parseInt(item.id) : undefined,
    };
  });

  return {
    query: PUSH_QUERY,
    variables: {
      objects,
    },
  };
};

const buildPullQuery = async (doc) => {
  let lastSync = doc?.updatedAt || new Date(0).toUTCString();
  return {
    query: PULL_QUERY,
    variables: {
      lastSync,
    },
  };
};

export const tripsCollection: RxCollectionDefinition = {
  name: "trips",
  schema,
  buildPullQuery,
  buildPushQuery,
};
