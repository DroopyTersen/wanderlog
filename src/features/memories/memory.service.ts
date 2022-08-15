import { generateId } from "~/common/utils";
import {
  findOneEntity,
  queryCollection,
  useCollection,
} from "~/database/data.helpers";
import { db } from "~/database/database";
import { auth } from "../auth/auth.client";
import { MemorySaveInput, memorySchema } from "./memory.types";

const currentUserId = auth.getCurrentUser()?.id;

const memorieQueries = {
  getById: (memoryId: string) => {
    return db.memories.findOne({
      selector: {
        id: memoryId,
      },
    });
  },
  getByTrip: (tripId: string) => {
    return db.memories.find({
      selector: {
        tripId,
      },

      sort: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  getByTripAndDate: (tripId: string, date: string) => {
    return db.memories.find({
      selector: {
        tripId,
        date,
      },
      sort: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
};

export const useMemories = (tripId: string, date: string) => {
  return useCollection(
    memorieQueries.getByTripAndDate(tripId, date),
    (r) => r?.data?.memories,
    memorySchema
  );
};
export const useTripMemories = (tripId: string) => {
  return useCollection(
    memorieQueries.getByTrip(tripId),
    (r) => r?.data?.tripMemories,
    memorySchema
  );
};

export const memoryService = {
  getById: (memoryId: string) => {
    return findOneEntity(memorieQueries.getById(memoryId), memorySchema);
  },
  getByTrip: async (tripId: string) => {
    return queryCollection(memorieQueries.getByTrip(tripId), memorySchema);
  },
  getByTripAndDate: (tripId: string, date: string) => {
    return queryCollection(
      memorieQueries.getByTripAndDate(tripId, date),
      memorySchema
    );
  },
  insert: async (input: MemorySaveInput) => {
    if (!input.id) {
      input.id = generateId();
    }
    let fullInput = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: currentUserId,
    };
    await db.memories.insert(fullInput);
    return fullInput;
  },
  update: async (input: MemorySaveInput) => {
    let existing = await memoryService.getById(input?.id + "");
    console.log("🚀 | update: | existing", existing);

    let fullInput = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await db.memories.upsert(fullInput);
  },
  remove: async (id: string) => {
    await memorieQueries.getById(id).remove();
  },
};
