import { generateId } from "~/common/utils";
import {
  findOneEntity,
  queryCollection,
  useCollection,
  useEntity,
} from "~/database/data.helpers";
import { db } from "~/database/database";
import { auth } from "../auth/auth.client";
import { TripSaveInput, tripSchema } from "./trip.types";

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
    (r) => r.data.trip,
    tripSchema
  );
};

export const tripService = {
  getById: (tripId: string) => {
    return findOneEntity(tripQueries.getById(tripId), tripSchema);
  },
  getAll: () => {
    return queryCollection(tripQueries.getAll(), tripSchema);
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
