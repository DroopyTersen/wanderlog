import { generateId } from "~/common/utils";
import {
  findOneEntity,
  queryCollection,
  useCollection,
} from "~/database/data.helpers";
import { db } from "~/database/database";
import { auth } from "../auth/auth.client";
import { PhotoDto, PhotoSaveInput, photoSchema } from "./photo.types";

const currentUserId = auth.getCurrentUser()?.id;

const photoQueries = {
  getAll: () => {
    return db.photos.find({
      sort: [{ createdAt: "desc" }],
    });
  },
  getById: (id: string) => {
    return db.photos.findOne({
      selector: {
        id,
      },
    });
  },
  getByTrip: (tripId: string) => {
    return db.photos.find({
      selector: {
        tripId,
      },
      sort: [{ createdAt: "asc" }],
    });
  },
  getByTripAndDate: (tripId: string, date: string) => {
    return db.photos.find({
      selector: {
        tripId,
        date,
      },
      sort: [{ createdAt: "asc" }],
    });
  },
};

export const usePhotos = (tripId: string, date: string) => {
  return useCollection(
    photoQueries.getByTripAndDate(tripId, date),
    (r) => r?.data?.photos,
    photoSchema,
    sortTimestampAsc
  );
};
export const useTripPhotos = (tripId: string) => {
  return useCollection(
    photoQueries.getByTrip(tripId),
    (r) => r?.data?.tripPhotos,
    photoSchema,
    sortTimestampAsc
  );
};

export const photoService = {
  getById: (photoId: string) => {
    return findOneEntity(photoQueries.getById(photoId), photoSchema);
  },
  getByTrip: async (tripId: string) => {
    return queryCollection(
      photoQueries.getByTrip(tripId),
      photoSchema,
      sortTimestampAsc
    );
  },
  getAll: async () => {
    return queryCollection(
      photoQueries.getAll(),
      photoSchema,
      sortTimestampDesc
    );
  },
  getByTripAndDate: (tripId: string, date: string) => {
    return queryCollection(
      photoQueries.getByTripAndDate(tripId, date),
      photoSchema,
      sortTimestampAsc
    );
  },
  insert: async (input: PhotoSaveInput) => {
    if (!input.id) {
      input.id = generateId();
    }
    let fullInput = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: currentUserId,
    };
    await db.photos.insert(fullInput);
    return fullInput;
  },
  update: async (input: Partial<PhotoSaveInput>) => {
    let existing = await photoService.getById(input?.id + "");
    console.log("🚀 | update: | existing", existing);
    console.log("🚀 | update: | existing", input);

    let fullInput = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await db.photos.upsert(fullInput);
  },
  remove: async (id: string) => {
    await photoQueries.getById(id).remove();
  },
};

const sortTimestampAsc = (a: PhotoDto, b: PhotoDto) => {
  return (a?.exif?.timestamp || a?.createdAt) <
    (b?.exif?.timestamp || b?.createdAt)
    ? -1
    : 1;
};

const sortTimestampDesc = (a: PhotoDto, b: PhotoDto) => {
  return sortTimestampAsc(a, b) * -1;
};
