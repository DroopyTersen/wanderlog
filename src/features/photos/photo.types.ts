import { z } from "zod";

export const exifSchema = z.object({
  device: z.string().optional().default(""),
  width: z.number().or(z.null()).optional().default(null),
  height: z.number().or(z.null()).optional().default(null),
  timestamp: z.string().optional().default(""),
  coordinates: z
    .tuple([z.number(), z.number()])
    .or(z.null())
    .optional()
    .default(null),
  altitude: z.number().or(z.null()).optional().default(null),
  orientation: z
    .literal("landscape")
    .or(z.literal("portrait"))
    .or(z.literal(""))
    .optional()
    .default(""),
  raw: z.any().optional(),
});

export const basePhotoSchema = z.object({
  url: z.string(),
  thumbnail: z.string(),
  tripId: z.string().optional(),
  date: z.string(),
  exif: exifSchema.or(z.null()).optional().default(null),
});

export const photoSchema = basePhotoSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdById: z.string(),
});

export type PhotoDto = z.infer<typeof photoSchema>;

export const photoSaveSchema = basePhotoSchema.extend({
  id: z.string().optional(),
});
export type PhotoSaveInput = z.infer<typeof photoSaveSchema>;

export type ExifData = z.infer<typeof exifSchema>;
export type Orientation = ExifData["orientation"];
