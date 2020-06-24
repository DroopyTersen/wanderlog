import React, { useState, useEffect, useRef } from "react";
import "./AppBackground.scss";
import useWindowSize from "../../hooks/useWindowSize";
function AppBackground({ variant = "" }) {
  let [status, setStatus] = useState("loading");
  let { width, height } = useWindowSize();
  let imgRef = useRef();
  let mode = width < 800 && width < height ? "portrait" : "desktop";
  let src = `/images/mountain-road.${mode}.jpg`;
  return (
    <div className={["app-background", variant, status].join(" ")}>
      <img src={BASE_64} className="blurred" />
      {variant !== "blurred" && (
        <img ref={imgRef} onLoad={() => setStatus("success")} src={src} className="sharp" />
      )}
    </div>
  );
}

export default React.memo(AppBackground);

const BASE_64 =
  "data:image/jpeg;base64,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";
