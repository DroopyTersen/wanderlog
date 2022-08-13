import { generateId } from "~/common/utils";
import { findOneEntity } from "~/database/data.helpers";
import { db } from "~/database/database";
import { auth } from "../auth/auth.client";
import { TripSaveInput, tripSchema } from "./trip.types";

const currentUserId = auth.getCurrentUser()?.id;

export const tripQueries = {
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

export const tripMutations = {
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
    let existing = await findOneEntity(tripQueries.getById(id), tripSchema);

    let fullInput = {
      ...existing,
      _deleted: true,
      updatedAt: new Date().toISOString(),
      updatedById: currentUserId,
    };
    await db.trips.upsert(fullInput);
  },
};
