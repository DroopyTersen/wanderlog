import React from "react";

export function Grid({ width = "250px", gap = "10px", children, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${width}, 100%), 1fr)`,
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  );
}
