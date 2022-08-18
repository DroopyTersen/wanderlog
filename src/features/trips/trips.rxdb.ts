import type { RxJsonSchema } from "rxdb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { RxCollectionDefinition } from "~/database/database.types";
import { baseTripSchema, TripDto, tripSchema } from "./trip.types";

const schema: RxJsonSchema<any> = {
  title: "Trips",
  version: 2,
  primaryKey: "id",
  ...(zodToJsonSchema(tripSchema, "Trip").definitions.Trip as any),
  additionalProperties: false,
};

const PULL_QUERY = `query GetLatestTrips($lastSync:timestamptz!, $batchSize:Int) {
  trips(where:{updatedAt:{_gt:$lastSync}} limit: $batchSize orderBy: [{ updatedAt:asc}]) {
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
    deleted
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
const PUSH_QUERY = `mutation UpsertTrips($objects:[TripsInsertInput!]!, $tripIds: [String!]) {
  deleteTripCompanions(where:{tripId:{ _in: $tripIds  }}) {
  	affected_rows
  }
  insertTrips(objects: $objects, onConflict: { constraint: trips_pkey, update_columns: [title, destination,start,end,deleted,updatedAt] }) {
    returning {
      id
      title
      destination
      start
      end
      deleted
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
const tripHasuraInsertSchema = baseTripSchema.extend({
  id: z.string(),
  deleted: z.boolean().optional().default(false),
  companions: z.object({
    data: z.array(
      z.object({
        userId: z.string(),
      })
    ),
  }),
});

type TripHasuraInsertInput = z.infer<typeof tripHasuraInsertSchema>;

const buildPushQuery = (items) => {
  console.log("🚀 | buildPushQuery | items", items);
  let objects: TripHasuraInsertInput[] = items.map(
    (item: TripDto & { deleted: boolean }) => {
      let object: TripHasuraInsertInput = {
        id: item?.id,
        title: item.title,
        destination: item.destination,
        start: item.start,
        end: item.end,
        deleted: item?.deleted,
        companions: {
          data: item?.companions || [],
        },
      };
      return object;
    }
  );

  return {
    query: PUSH_QUERY,
    variables: {
      objects,
      tripIds: items.map((item) => item.id),
    },
  };
};

const buildPullQuery = async (doc) => {
  let lastSync = doc?.updatedAt || new Date(0).toUTCString();
  return {
    query: PULL_QUERY,
    variables: {
      lastSync,
      batchSize: BATCH_SIZE,
    },
  };
};
const BATCH_SIZE = 100;

export const tripsCollection: RxCollectionDefinition = {
  name: "trips",
  batchSize: BATCH_SIZE,
  schema,
  buildPullQuery,
  buildPushQuery,
  liveInterval: 20000,
};
