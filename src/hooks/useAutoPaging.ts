import { useEffect, useState } from "react";
import useInterval from "./useInterval";

export default function useAutoPaging(goForward, delay = 5000) {
  let [pageDelay, setPageDelay] = useState(delay);

  useEffect(() => {
    setPageDelay(delay);
  }, [delay]);

  useInterval(goForward, pageDelay);

  const start = () => setPageDelay(delay);
  const stop = () => setPageDelay(0);

  return {
    pauseEvents: {
      onMouseEnter: stop,
      onMouseLeave: start,
    },
    startPaging: start,
    stopPaging: stop,
  };
}
