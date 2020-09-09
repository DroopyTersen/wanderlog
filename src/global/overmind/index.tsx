import React from "react";
import { IConfig, createOvermind, IAction, IOnInitialize, Config } from "overmind";
import { namespaced, merge } from "overmind/config";
import auth from "features/auth/auth.overmind";
import dailyLogs from "features/dailyLogs/dailyLogs.overmind";

import { onInitialize } from "./onInitialize";
import {
  createHook,
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
  Provider,
} from "overmind-react";

export const config = merge(
  { onInitialize, state: {} },
  namespaced({
    auth,
    dailyLogs,
  })
);
console.log("config", config);

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>();
export const useOvermindState = createStateHook<typeof config>();
export const useActions = createActionsHook<typeof config>();
export const useEffects = createEffectsHook<typeof config>();
export const useReaction = createReactionHook<typeof config>();

export interface OnInitialize extends IOnInitialize<Config> {}
export interface Action<Input = void, Output = void> extends IAction<Config, Input, Output> {}
export interface AsyncAction<Input = void, Output = void>
  extends IAction<Config, Input, Promise<Output>> {}

export const overmind = createOvermind(config);
export const OvermindProvider = ({ children }) => {
  return <Provider value={overmind}>{children}</Provider>;
};
