import type { RxJsonSchema } from "rxdb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { RxCollectionDefinition } from "~/database/database.types";
import { basePhotoSchema, PhotoDto, photoSchema } from "./photo.types";

const schema: RxJsonSchema<any> = {
  title: "Photos",
  version: 1,
  primaryKey: "id",
  ...(zodToJsonSchema(photoSchema, "Photo").definitions.Photo as any),
  additionalProperties: false,
};

// There is a bug here where if you update a bunch of records at once, then
// the sync paging will only get the first page because it is a `$gt` on lastSync (updated at)
// as opposed to a `$gte`. But gte is challening too because it would repeatedly refetch the first page
// of results. Can't figure out a way to inject an offset since we only have access to query builder
const PULL_QUERY = `query GetLatestPhotos($lastSync:timestamptz!, $batchSize:Int) {
  photos(where:{updatedAt:{_gt:$lastSync}} limit: $batchSize orderBy: [{ updatedAt:asc}]) {
    id
    tripId
    date
    full
    mid
    small
    exif
    createdById
    createdAt
    updatedAt
    deleted
  }
}`;

const PUSH_QUERY = `mutation UpsertPhotos($objects: [PhotosInsertInput!]!) {
  insertPhotos(objects: $objects, onConflict: {constraint: photos_pkey, update_columns: [full,mid,small, date, exif, location, deleted, tripId, updatedAt]}) {
    returning {
      id
      tripId
      date
      full
      mid
      small
      exif
      createdById
      createdAt
      updatedAt
      deleted
    }
  }
}
`;

const hasuraInsertSchema = basePhotoSchema.extend({
  id: z.string(),
  deleted: z.boolean().optional().default(false),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
});

type HasuraInsertInput = z.infer<typeof hasuraInsertSchema>;

const buildPushQuery = (items) => {
  console.log("🚀 | buildPushQuery | Photos", items);
  let objects: any[] = items.map(
    (item: PhotoDto & { deleted: boolean; _meta: any }) => {
      let { _meta, createdById, ...object } = item;
      let insertObject: HasuraInsertInput = {
        ...object,
      };
      if (object?.exif?.coordinates) {
        insertObject.location = {
          type: "Point",
          coordinates: object.exif.coordinates,
        };
      }
      return insertObject;
    }
  );

  return {
    query: PUSH_QUERY,
    variables: {
      objects,
    },
  };
};

const buildPullQuery = async (doc) => {
  let lastSync = doc?.updatedAt || new Date(0).toISOString();
  return {
    query: PULL_QUERY,
    variables: {
      lastSync,
      batchSize: BATCH_SIZE,
    },
  };
};
const BATCH_SIZE = 5;

export const photosCollection: RxCollectionDefinition = {
  name: "photos",
  batchSize: BATCH_SIZE,
  schema,
  buildPullQuery,
  buildPushQuery,
  liveInterval: 12000,
};
