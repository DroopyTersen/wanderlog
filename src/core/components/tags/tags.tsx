import React, { useState, useEffect } from "react";
import slugify from "slugify";
import "./tags.scss";

export interface TagsInputProps {
  onChange: (tagNames: string[]) => void;
  initialTags: string[];
}
const processTags = (tagsStr) => {
  return tagsStr
    .replace(/, /g, ",")
    .replace(/ /g, ",")
    .split(",")
    .map((tag) => slugify(tag.trim().toLowerCase()))
    .filter(Boolean);
};
export function TagsInput({ onChange, initialTags = [], ...rest }) {
  let [value, setValue] = useState(initialTags.join(", "));

  useEffect(() => {
    let tags = processTags(value);
    onChange(tags);
  }, [value]);

  return (
    <label>
      Tags
      <TagsDisplay tags={processTags(value)} style={{ margin: "10px 0 0" }} />
      <textarea {...rest} value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export function TagsDisplay({ tags, ...rest }) {
  return (
    <div className="tags" {...rest}>
      {tags?.map((tag) => (
        <div key={tag} className="tag">
          {tag}
        </div>
      ))}
    </div>
  );
}
