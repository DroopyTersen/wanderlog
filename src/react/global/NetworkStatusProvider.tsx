import { useState, useEffect, useMemo, useContext } from "react";
import React from "react";

export const NetworkContext = React.createContext(window.navigator.onLine);

export function useNetworkStatus() {
  return useContext(NetworkContext);
}

export default function NetworkStatusProvider({ children }) {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);

  useEffect(() => {
    let handler = () => setNetwork(window.navigator.onLine);

    window.addEventListener("offline", handler);
    window.addEventListener("online", handler);

    return () => {
      window.removeEventListener("offline", handler);
      window.removeEventListener("online", handler);
    };
  }, []);
  return <NetworkContext.Provider value={isOnline}>{children}</NetworkContext.Provider>;
}
