import React, { useState, useRef, useMemo, useEffect } from "react";

const clearBlobs = (previews = []) => {
  previews.forEach((preview) => {
    try {
      console.log("revoking url", preview);
      URL.revokeObjectURL(preview);
    } catch (err) {
      console.error(err);
    }
  });
};
export default function useImageUploader({ multiple = false } = {}) {
  let inputRef = useRef<HTMLInputElement>(null);
  let [previews, setPreviews] = useState([]);
  let [files, setFiles] = useState([]);

  let clear = () => {
    if (inputRef?.current) {
      inputRef.current.value = "";
      clearBlobs(previews);
      setPreviews([]);
    }
  };
  let open = () => inputRef?.current?.click();

  let onFileChange = (event) => {
    setFiles(event?.target?.files ?? []);
    setPreviews([]);
  };

  useEffect(() => {
    let isUnmounted = false;
    let doAsync = async () => {
      let newPreviews = [];
      for (var i = 0; i < files.length; i++) {
        let newPreview = URL.createObjectURL(files[i]);
        if (isUnmounted) return;
        newPreviews.push(newPreview);
      }
      setPreviews(newPreviews);
    };
    doAsync();
    return () => {
      isUnmounted = true;
    };
  }, [files]);

  let HiddenInput = (
    <input
      type="file"
      ref={inputRef}
      onChange={onFileChange}
      multiple={multiple}
      accept="image/*"
      style={{ display: "none" }}
    />
  );

  return {
    HiddenInput,
    previews,
    clear,
    open,
    inputRef,
    files,
  };
}
