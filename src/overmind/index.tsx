import React from "react";
import { IConfig, createOvermind, IAction, IOnInitialize, Config } from "overmind";
import { namespaced } from "overmind/config";
import * as auth from "./auth";
import { onInitialize } from "./onInitialize";
import {
  createHook,
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
  Provider,
} from "overmind-react";

export const config = {
  onInitialize,
  ...namespaced({
    auth,
  }),
};

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>();
export const useState = createStateHook<typeof config>();
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
