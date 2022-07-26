import React, { useState, useEffect, useMemo } from "react";
import slugify from "slugify";
import { PickerOption } from "../inputs/picker";
import PickerMulti from "../inputs/picker/PickerMulti";
import "./tags.scss";

export interface TagsInputProps {
  onChange: (tagNames: string[]) => void;
  initialTags: string[];
}

const processTags = (tagsStr) => {
  return Array.from(
    new Set(
      tagsStr
        .replace(/, /g, ",")
        .replace(/ /g, ",")
        .split(",")
        .map((tag) => slugify(tag.trim().toLowerCase()))
        .filter(Boolean)
    )
  );
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
      <textarea
        {...rest}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}

export function TagsDisplay({ tags, ...rest }) {
  return (
    <div className="tags" {...rest}>
      {tags?.map((tag) => (
        <div key={tag?.tag?.id ?? tag} className="tag">
          {tag?.tag?.name || tag}
        </div>
      ))}
    </div>
  );
}

export interface Tag {
  name: string;
  id: number;
}

interface TagPickerProps {
  values: number[];
  availableTags: Tag[];
  onChange: (newTags: Tag[]) => void;
}
const toOption = (tag: Tag): PickerOption => ({
  label: tag.name,
  value: tag.id + "",
});
const toTag = (option: PickerOption): Tag => ({
  id: (option.__isNew__ ? -1 : option.value) as any,
  name: option.label,
});
export function TagPicker({
  values = [],
  onChange,
  availableTags,
}: TagPickerProps) {
  let options = useMemo(() => {
    return availableTags.map(toOption);
  }, [availableTags]);
  let chosenOptions = useMemo(() => {
    return values
      .map((id) => {
        return options.find((o) => o.value === id + "");
      })
      .filter(Boolean);
  }, [availableTags, values]);
  return (
    <PickerMulti
      onChange={(options) => {
        console.log("CHANGED TAG", options);
        onChange(options.map(toTag));
      }}
      value={chosenOptions}
      options={options}
      creatable={true}
    />
  );
}
