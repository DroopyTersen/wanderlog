import cookie from "cookie";
import { parseFormValues } from "~/common/response.utils";
import { AUTH_COOKIE, LoginSchema } from "~/features/auth/auth.types";
import { createJWT } from "~/features/auth/hasuraAuth.server";
import { User } from "~/features/users/user.types";

import { Event } from "@netlify/functions/dist/function/event";
import dayjs from "dayjs";
import {
  createUser,
  verifyCredentials,
} from "~/features/auth/usersAuth.server";

export const handler = async (event: Event) => {
  let requestUrl = new URL(event.rawUrl);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }
  try {
    let formValues = parseFormValues(event?.body || "", LoginSchema);
    let user: User | null;
    if (formValues.mode === "signup") {
      user = await createUser(
        formValues.username.toLowerCase(),
        formValues.password,
        formValues.name
      );
    } else {
      user = await verifyCredentials(
        formValues.username.toLowerCase(),
        formValues.password
      );
      if (!user) {
        throw {
          message: "Invalid username or password",
          formData: formValues,
        };
      }
    }
    let jwt = createJWT(user);
    // Set cookie and redirect
    let redirectTo = formValues.returnTo || new URL(event.rawUrl)?.origin;

    return {
      statusCode: 302,
      headers: {
        Location: redirectTo,
        "Set-Cookie": cookie.serialize(AUTH_COOKIE, jwt, {
          secure: process.env.NODE_ENV === "production",
          httpOnly: false,
          expires: dayjs().add(1, "year").toDate(),
          path: "/",
        }),
      },
    };
  } catch (err: any) {
    console.log("LOGIN ERROR", err);
    let error = err?.message || "Invalid username or password";
    let returnUrl = new URL(
      requestUrl.origin + "/" + (err?.formData?.mode || "login")
    );
    returnUrl.searchParams.set("error", error);
    if (err?.formData?.username) {
      returnUrl.searchParams.set("username", err.formData.username);
    }
    if (err?.formData?.name) {
      returnUrl.searchParams.set("name", err.formData.name);
    }
    return {
      statusCode: 302,
      headers: {
        Location: returnUrl.toString(),
      },
    };
  }
};
