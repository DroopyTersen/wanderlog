import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
