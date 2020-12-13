import React from "react";

export function MemoriesDisplay({ memories, className = "", ...rest }) {
  let items = typeof memories === "string" ? memories.trim().split("\n").filter(Boolean) : memories;
  return (
    <div {...rest} className={"memories stack " + className}>
      {items?.map((item) => (
        <div key={item} className="card memory">
          {item}
        </div>
      ))}
    </div>
  );
}

export function MemoriesPreview({ memories, className = "", ...rest }) {
  let items = typeof memories === "string" ? memories.trim().split("\n").filter(Boolean) : memories;
  return (
    <div {...rest} className={"memories " + className}>
      {items?.map((item) => (
        <div key={item} className="truncate">
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
