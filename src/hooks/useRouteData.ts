import { useMatches } from "react-router-dom";

export type RouteSelector = <T>(
  route: ReturnType<typeof useMatches>[0] & { data: any }
) => T;

export const useRouteData = (selector: RouteSelector) => {
  return selectRouteData(useMatches(), selector);
};

export const selectRouteData = (
  matches: ReturnType<typeof useMatches>,
  selector: RouteSelector
) => {
  let match = matches.reverse()?.find(selector);
  return match ? selector(match) : null;
};
