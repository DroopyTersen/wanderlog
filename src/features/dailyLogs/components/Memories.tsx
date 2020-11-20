import React, { useState, useEffect } from "react";

function MemoriesDisplay({ memories, ...rest }) {
  return (
    <div {...rest} className="stack">
      {memories?.map((item) => (
        <div key={item} className="card">
          {item}
        </div>
      ))}
    </div>
  );
}
function MemoriesInput({ onChange, initialMemories = [] }) {
  let [value, setValue] = useState(initialMemories.join("\n"));
  useEffect(() => {
    let memories = value
      .split("\n")
      .map((str) => str.trim())
      .filter(Boolean);
    onChange(memories);
  }, [value]);

  return (
    <label>
      Memories
      <textarea onChange={(event) => setValue(event.target.value)} value={value}></textarea>
    </label>
  );
}

export const Memories = {
  Input: MemoriesInput,
  Display: MemoriesDisplay,
};
