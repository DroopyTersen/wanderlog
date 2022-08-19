import dayjs from "dayjs";
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
const currentUsername = auth.getCurrentUser()?.username;
const UPLOAD_FILE_URL_PREFIX = `/api/photos`;
const FILE_URL_PREFIX = `https://wanderlog.droopy.workers.dev/photos`;

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
  updateDate: async (photoId: string, date: string) => {
    let existing = await photoService.getById(photoId + "");
    // console.log("🚀 | updateDate: | existing", existing?.exif?.timestamp);
    let prevTimestamp = dayjs(existing?.exif?.timestamp || date);
    // console.log("🚀 | updateDate: | prevTimestamp", prevTimestamp.toString());
    let newTimestamp = dayjs(date)
      .set("hour", prevTimestamp.get("hour"))
      .set("minute", prevTimestamp.get("minute"));
    // console.log(newTimestamp.toString());
    let fullInput: PhotoDto = {
      ...existing,
      exif: {
        ...(existing.exif as any),
        timestamp: newTimestamp.toISOString(),
      },
      date,
      updatedAt: new Date().toISOString(),
    };
    // console.log("UPDATED TO", date);
    await db.photos.upsert(fullInput);
  },
  remove: async (id: string) => {
    await photoQueries.getById(id).remove();
  },
  uploadImage: async (
    img: string,
    filename: string,
    size: "small" | "mid" | "full"
  ) => {
    if (size === "mid" || size === "small") {
      filename = filename.replace(".jpg", `_${size}.jpg`);
    }
    let blobPath = `/${currentUsername}/${filename}`;
    let uploadUrl = `${UPLOAD_FILE_URL_PREFIX}${blobPath}`;

    await fetch(uploadUrl, {
      method: "POST",
      body: img,
    });
    return `${FILE_URL_PREFIX}${blobPath}`;
  },
  deleteBlobs: (photo: PhotoDto) => {
    let fullDeleteUrl = photo.full?.replace(
      FILE_URL_PREFIX,
      UPLOAD_FILE_URL_PREFIX
    );
    let midDeleteUrl = photo.mid?.replace(
      FILE_URL_PREFIX,
      UPLOAD_FILE_URL_PREFIX
    );

    return Promise.all([
      fetch(fullDeleteUrl, { method: "DELETE" }),
      fetch(midDeleteUrl, { method: "DELETE" }),
    ]);
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

export const groupPhotosByDate = (photos: PhotoDto[]) => {
  let photosDateMap: Map<string, PhotoDto[]> = photos.reduce((map, photo) => {
    let date = photo.date;
    if (!map.get(date)) {
      map.set(date, []);
    }
    map.get(date)?.push(photo);
    return map;
  }, new Map());
  let datePhotos: { date: string; photos: PhotoDto[] }[] = [];
  photosDateMap.forEach((photos, date) => {
    datePhotos.push({ date, photos });
  });

  return datePhotos;
};
