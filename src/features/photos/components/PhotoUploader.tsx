import { useEffect, useState } from "react";
// import { useMutation } from "urql";
import useImageUploader from "~/hooks/useImageUploader";
import { photoService } from "../photo.service";
import { processImageFile } from "../processImageFile";

// const FULL_SIZE = 1400;
// const THUMB_SIZE = 500;

interface Props {
  date?: string;
  tripId?: string;
  inputProps?: any;
}

type PhotoStatus = "empty" | "saving" | "success" | "errored";

export const delayedOpenFilePicker = (
  selector = ".photo-grid input[type='file']"
) => {
  setTimeout(() => {
    let fileInput = document.querySelector(selector) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, 200);
};

export function PhotoUploader({ date, tripId, inputProps }: Props) {
  let [status, setStatus] = useState<PhotoStatus>("empty");
  let [imgSrc, setImgSrc] = useState<string>("");
  // TODO: add support for multiple
  let { renderInput, previews, open, clear, files } = useImageUploader({
    multiple: true,
  });

  let hasFiles = previews?.length;

  const save = async () => {
    if (hasFiles) {
      try {
        for (let i = 0; i < files.length; i++) {
          setStatus("saving");
          setImgSrc(previews[i]);
          let photo = await processImageFile(files[i], { tripId, date });
          await photoService.insert(photo);
        }

        clear();
        setImgSrc("");
        setStatus("empty");
      } catch (err) {
        console.error("PHOTO SAVE ERROR", err);
        setStatus(err);
      }
    }
  };

  useEffect(() => {
    if (hasFiles) {
      save();
      // setStatus("previewing");
    } else setStatus("empty");
  }, [hasFiles]);
  return (
    <div
      className={
        "photo-uploader text-white hover:brightness-125 bg-primary-600 overlay relative drop-shadow-sm " +
        status
      }
    >
      {status === "empty" && (
        <button
          className="gold large font-semibold absolute inset-0 uppercase"
          onClick={open}
        >
          Add Photo
        </button>
      )}
      {renderInput(inputProps)}
      {status !== "empty" && (
        <div className="status opacity-pulse">{status}</div>
      )}
      {status !== "success" && imgSrc && <img src={imgSrc} />}
    </div>
  );
}
