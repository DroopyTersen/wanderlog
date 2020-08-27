import { useRef, useState, useEffect } from "react";

export function useSyncListener(collections: string[] = []) {
  let channelRef = useRef(new BroadcastChannel("sw-messages"));
  let [forceRefresh, setForceRefresh] = useState(Date.now());

  useEffect(() => {
    const handler = (event) => {
      // console.log("useSyncListener -> event", event);
      alert("Sync event: " + event?.data?.collection);
      if (
        event?.data?.type === "sync" &&
        (collections.length === 0 || collections.some((c) => c === event?.data.collection))
      ) {
        setForceRefresh(Date.now());
      }
    };
    channelRef?.current?.addEventListener?.("message", handler);

    () => channelRef?.current?.removeEventListener?.("message", handler);
  }, [channelRef.current, collections.toString()]);

  return forceRefresh;
}
