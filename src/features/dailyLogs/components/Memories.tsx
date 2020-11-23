import React, { useState, useEffect } from "react";

export function MemoriesDisplay({ memories, ...rest }) {
  let items = typeof memories === "string" ? memories.trim().split("\n").filter(Boolean) : memories;
  return (
    <div {...rest} className="memories stack">
      {items?.map((item) => (
        <div key={item} className="card">
          {item}
        </div>
      ))}
    </div>
  );
}

// function MemoriesInput({ onChange, initialValue = "" }) {
//   let [value, setValue] = useState(ini);
//   useEffect(() => {
//     let memories = value
//       .split("\n")
//       .map((str) => str.trim())
//       .filter(Boolean);
//     onChange(memories);
//   }, [value]);

//   return (
//     <label>
//       Memories
//       <textarea onChange={(event) => setValue(event.target.value)} value={value}></textarea>
//     </label>
//   );
// }

// export const Memories = {
//   Input: MemoriesInput,
//   Display: MemoriesDisplay,
// };
