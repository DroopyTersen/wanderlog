import { MotionGrid } from "core/components";
import React from "react";

export function MemoriesDisplay({ memories, className = "", ...rest }) {
  let items = typeof memories === "string" ? memories.trim().split("\n").filter(Boolean) : memories;
  return (
    <MotionGrid width="600px" {...rest} className={"memories " + className}>
      {items?.map((item) => (
        <MotionGrid.Item key={item} className="card memory">
          {item}
        </MotionGrid.Item>
      ))}
    </MotionGrid>
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
