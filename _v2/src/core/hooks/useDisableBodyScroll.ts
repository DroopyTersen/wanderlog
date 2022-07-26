import { useEffect } from "react";

export function useDisableBodyScroll(condition: boolean) {
  useEffect(() => {
    if (condition) {
      document.body.classList.add("noscroll");
    } else {
      document.body.classList.remove("noscroll");
    }
    return () => {
      document.body.classList.remove("noscroll");
    };
  }, [condition]);
}
// Assumes a CSS rule like this
// body.noscroll {
//     overflow: hidden;
// }
