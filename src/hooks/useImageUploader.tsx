import { useEffect, useRef, useState } from "react";

const clearBlobs = (previews: string[] = []) => {
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
  let [previews, setPreviews] = useState<string[]>([]);
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
      let newPreviews: string[] = [];
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
      className="absolute inset-0 opacity-0 cursor-pointer"
      style={{}}
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
