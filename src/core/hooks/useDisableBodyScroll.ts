import { useEffect } from "react";

export function useDisableBodyScroll(condition: boolean) {
  useEffect(() => {
    const hasNoScroll = document.body.classList.contains("noscroll");

    if (condition && !hasNoScroll) {
      document.body.classList.add("noscroll");
    } else if (!condition && hasNoScroll) {
      document.body.classList.remove("noscroll");
    }
  }, [condition]);
}
// Assumes a CSS rule like this
// body.noscroll {
//     overflow: hidden;
// }
