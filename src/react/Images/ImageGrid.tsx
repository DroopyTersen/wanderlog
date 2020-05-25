import React from "react";

export default function ImageGrid({ imgUrls = [], width = "250px", gap = "10px" }) {
  return (
    <div
      className="image-grid"
      style={{
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(auto-fill, minmax(${width}, 1fr)`,
      }}
    >
      {imgUrls.map((imgUrl) => (
        <img key={imgUrl} src={imgUrl} />
      ))}
    </div>
  );
}
