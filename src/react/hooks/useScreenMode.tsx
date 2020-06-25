import { useState, useEffect, useMemo, useContext } from "react";
import React from "react";
import useWindowSize from "./useWindowSize";

const calcScreenMode = (width?, height?): ScreenMode => {
  console.log("calcScreenMode", width, height);
  width = width || window.innerWidth;
  height = height || window.innerHeight;
  let orientation: DeviceOrientation = width >= height ? "landscape" : "portrait";
  let size: ScreenSize = "small";
  if (width > 1200) size = "large";
  else if (width > 600) size = "med";

  return {
    size,
    orientation,
  };
};

const defaultValues: ScreenMode = calcScreenMode();

export const ScreenModeContext = React.createContext(defaultValues);

export function useScreenMode() {
  return useContext(ScreenModeContext);
}

function useScreenModeData(dataParams = "") {
  let [data, setData] = useState(defaultValues);
  console.log("useScreenModeData -> data", data);
  let { width, height } = useWindowSize();
  useEffect(() => {
    let mode = calcScreenMode(width, height);
    console.log("useScreenModeData -> mode", mode);
    setData((oldData) => {
      if (oldData.orientation !== mode.orientation || oldData.size != mode.size) {
        return mode;
      }
      return oldData;
    });
  }, [width, height]);

  return data;
}

export type DeviceOrientation = "portrait" | "landscape";
export type ScreenSize = "small" | "med" | "large";

export interface ScreenMode {
  size: ScreenSize;
  orientation: DeviceOrientation;
}

export function ScreenModeProvider({ children }) {
  let data = useScreenModeData();
  return <ScreenModeContext.Provider value={data}>{children}</ScreenModeContext.Provider>;
}

// Wrap Your app with the Provider
// <ScreenModeProvider>
//    <RestOfApp/>
// </ScreenModeProvider>

// // Use the normal hook anywhere in your app (assuming you've wrapped it in a provider)
// function ChildComponent() {
//   let data = useScreenMode();
//   return <div>{JSON.stringify(data, null, 2)}</div>;
// }
