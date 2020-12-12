import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function useConditionalEffect<T>(conditionalData: T, cb: (conditionalData: T) => void) {
  let cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => {
    if (conditionalData && cbRef.current) {
      cbRef.current(conditionalData);
    }
  }, [conditionalData]);
}

export function useConditionalRedirect(data: any, getPath: (data) => string) {
  let navigate = useNavigate();
  useConditionalEffect(data, (data) => navigate(getPath(data)));
}
