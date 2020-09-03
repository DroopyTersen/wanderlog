import React from "react";

export default function Grid({ width = "250px", gap = "10px", children, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(auto-fill, minmax(${width}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}
