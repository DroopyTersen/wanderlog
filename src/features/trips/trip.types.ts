import { z } from "zod";

const baseTripSchema = z.object({
  title: z.string(),
  destination: z.string(),
  start: z.string(),
  end: z.string(),
});

export const tripSchema = baseTripSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdById: z.number(),
  updatedById: z.number(),
  companions: z.array(z.object({ userId: z.number() })),
});

export type TripItem = z.infer<typeof tripSchema>;

export const tripSaveSchema = baseTripSchema.extend({
  id: z.string().optional(),
  companions: z.array(z.object({ userId: z.string() })),
});

export type TripSaveInput = z.infer<typeof tripSaveSchema>;

export const tripHasuraInsertSchema = baseTripSchema.extend({
  id: z.number().or(z.undefined()),
  companions: z.object({
    data: z.array(
      z.object({
        userId: z.number(),
      })
    ),
  }),
});

export type TripHasuraInsertInput = z.infer<typeof tripHasuraInsertSchema>;
