import { z } from "zod";

export const baseMemorySchema = z.object({
  date: z.string(),
  content: z.string(),
  tripId: z.string(),
  sortOrder: z.number().optional().default(1),
});

export const memorySchema = baseMemorySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdById: z.string(),
});

export type MemoryDto = z.infer<typeof memorySchema>;

export const memorySaveSchema = baseMemorySchema.extend({
  id: z.string().optional(),
});
export type MemorySaveInput = z.infer<typeof memorySaveSchema>;
