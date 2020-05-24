import React, { useState, useEffect } from "react";

export function HightlightsDisplay({ highlights, ...rest }) {
  return (
    <ul>
      {highlights?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function HighlightsInput({ onChange, initialHighlights = [] }) {
  let [value, setValue] = useState(initialHighlights.join("\n"));
  useEffect(() => {
    let highlights = value
      .split("\n")
      .map((str) => str.trim())
      .filter(Boolean);
    onChange(highlights);
  }, [value]);

  return (
    <label>
      Highlights
      <textarea onChange={(event) => setValue(event.target.value)} value={value}></textarea>
    </label>
  );
}
