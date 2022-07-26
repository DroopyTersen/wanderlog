import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string().optional(),
  mode: z.enum(["login", "signup"]).default("login"),
  returnTo: z.string().optional(),
});
export type LoginFormValues = z.infer<typeof LoginSchema>;

export const AUTH_COOKIE = "wanderlog-auth";
