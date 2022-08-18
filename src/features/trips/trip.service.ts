import { generateId, getRandom } from "~/common/utils";
import {
  findOneEntity,
  queryCollection,
  useCollection,
  useEntity,
} from "~/database/data.helpers";
import { db } from "~/database/database";
import { auth } from "../auth/auth.client";
import { photoService } from "../photos/photo.service";
import { TripDto, TripSaveInput, tripSchema } from "./trip.types";

const currentUserId = auth.getCurrentUser()?.id;

const tripQueries = {
  getAll: () =>
    db.trips.find({
      sort: [
        {
          start: "desc",
        },
      ],
    }),
  getById: (tripId: string) => {
    return db.trips.findOne({
      selector: {
        id: tripId,
      },
    });
  },
};

export const useTrips = () => {
  return useCollection(
    tripQueries.getAll(),
    (r) => r?.data?.allTrips,
    tripSchema
  );
};

export const useTrip = (tripId) => {
  return useEntity(
    tripQueries.getById(tripId + ""),
    (r) => r?.data?.trip,
    tripSchema
  );
};

export const tripService = {
  getRandomPhotoForEachTrip: async () => {
    let allTrips = await queryCollection(tripQueries.getAll(), tripSchema);
    let tripIds = allTrips.map((trip) => trip.id);
    let photos = await Promise.all(
      tripIds.map((tripId) =>
        photoService.getByTrip(tripId).then((photos) => getRandom(photos))
      )
    );
    let map = {};
    for (let i = 0; i < tripIds.length; i++) {
      map[tripIds[i]] = photos[i];
    }
    return map;
  },
  getById: (tripId: string) => {
    return findOneEntity(tripQueries.getById(tripId), tripSchema);
  },
  getAll: async () => {
    let allTrips = await queryCollection(tripQueries.getAll(), tripSchema);
  },
  insert: async (input: TripSaveInput) => {
    if (!input.id) {
      input.id = generateId();
    }
    let fullInput = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: currentUserId,
      updatedById: currentUserId,
    };
    await db.trips.insert(fullInput);
    return fullInput;
  },
  update: async (input: TripSaveInput) => {
    let existing = await findOneEntity(
      tripQueries.getById(input.id + ""),
      tripSchema
    );

    let fullInput = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
      updatedById: currentUserId,
    };
    await db.trips.upsert(fullInput);
  },
  remove: async (id: string) => {
    await tripQueries.getById(id).remove();
  },
};

export const sortCompanions = (
  companions: TripDto["companions"] = [],
  allUsers
) => {
  console.log("🚀 | companions", companions);
  return (
    companions?.map((c) => allUsers.find((u) => u.id === c.userId)) || []
  ).sort((a, b) => {
    let [aFirst, aLastName] = (a?.name || a?.username || "")?.split(" ");
    let [bFirst, bLastName] = (b?.name || b?.username || "")?.split(" ");
    if (aLastName === bLastName) {
      return aFirst.localeCompare(bFirst);
    } else {
      return aLastName.localeCompare(bLastName);
    }
  });
};
