import { z, ZodError, ZodObject, ZodRawShape } from "zod";
import { LoginSchema } from "~/features/auth/auth.types";

export const parseFormValues = <
  Schema extends ZodObject<T>,
  T extends ZodRawShape
>(
  body: string,
  schema: Schema
) => {
  let formData = Object.fromEntries(new URLSearchParams(body || ""));
  let formValues: z.infer<typeof schema> = null;
  try {
    formValues = schema.parse(formData);
    return formValues;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      throw {
        message: err.issues[0].message,
        formData,
      };
    }
    throw err;
  }
};
