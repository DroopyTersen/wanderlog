import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().or(z.number()),
  username: z.string(),
  name: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
