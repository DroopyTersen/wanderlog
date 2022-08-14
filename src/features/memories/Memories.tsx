import { MotionGrid } from "~/components";

export function MemoriesDisplay({ memories, className = "", ...rest }) {
  let items =
    typeof memories === "string"
      ? memories.trim().split("\n").filter(Boolean)
      : memories;
  console.log("🚀 | MemoriesDisplay | items", items);
  return (
    <MotionGrid width="600px" {...rest} className={"memories " + className}>
      {(items || [])?.map((item) => (
        <MotionGrid.Item key={item} className="card memory">
          {item}
        </MotionGrid.Item>
      ))}
    </MotionGrid>
  );
}

export function MemoriesPreview({ memories, className = "", ...rest }) {
  let items =
    typeof memories === "string"
      ? memories.trim().split("\n").filter(Boolean)
      : memories;
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
