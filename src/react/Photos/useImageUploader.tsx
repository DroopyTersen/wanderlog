import React, { useState, useRef } from "react";

export default function useImageUploader() {
  let inputRef = useRef(null);
  let [previews, setPreviews] = useState([]);

  let open = () => {
    inputRef?.current?.click();
  };
  let onFileChange = (event) => {
    let urls = [];
    let files = event?.target?.files ?? [];
    for (var i = 0; i < files.length; i++) {
      urls.push(URL.createObjectURL(files[i]));
    }
    setPreviews(urls);
  };

  let HiddenInput = (
    <input
      type="file"
      ref={inputRef}
      onChange={onFileChange}
      multiple={true}
      accept="image/*"
      style={{ display: "none" }}
    />
  );

  return {
    HiddenInput,
    previews,
    open,
    inputRef,
  };
}
