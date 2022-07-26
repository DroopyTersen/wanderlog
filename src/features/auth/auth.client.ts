import decode from "jwt-decode";
import { User } from "~/common/types";
import { AUTH_COOKIE } from "./auth.types";

const readCookie = (fullCookieString: string, key: string): string => {
  const cookieValue = (
    fullCookieString.split("; ").find((row) => row.startsWith(`${key}=`)) || ""
  ).split?.("=")?.[1];

  return cookieValue || "";
};

const tryParseAuthCookie = (): { accessToken: string; user: User } => {
  let accessToken = readCookie(document.cookie, AUTH_COOKIE);
  if (!accessToken) return null;
  let payload = decode<any>(accessToken);
  return {
    accessToken,
    user: payload?.user,
  };
};

const deleteAuthCookie = () => {
  document.cookie = `${AUTH_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const auth = {
  getAccessToken: () => {
    return readCookie(document.cookie, AUTH_COOKIE);
  },
  checkIsLoggedIn: () => {
    let payload = tryParseAuthCookie();
    return !!payload?.user?.id && !!payload?.accessToken;
  },
  getCurrentUser: () => {
    let payload = tryParseAuthCookie();
    return payload?.user;
  },
  logout: () => {
    deleteAuthCookie();
    window.location.href = "/";
  },
};
