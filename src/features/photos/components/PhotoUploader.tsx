import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
// import { useMutation } from "urql";
import { Button } from "~/components/inputs/buttons";
import useImageUploader from "~/hooks/useImageUploader";
import { photoService } from "../photo.service";
import { processImageFile } from "../processImageFile";

// const FULL_SIZE = 1400;
// const THUMB_SIZE = 500;

interface Props {
  date?: string;
  tripId?: string;
  onSuccess?: () => void;
  inputProps?: any;
}

type PhotoStatus = "empty" | "previewing" | "saving" | "success" | "errored";

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

export function PhotoUploader({ date, tripId, onSuccess, inputProps }: Props) {
  let [status, setStatus] = useState<PhotoStatus>("empty");
  // TODO: add support for multiple
  let { renderInput, previews, open, clear, files } = useImageUploader();

  let hasFiles = previews?.length;
  const imgSrc = previews?.[0];

  const save = async () => {
    if (hasFiles) {
      try {
        setStatus("saving");
        let photo = await processImageFile(files[0], { tripId, date });

        await photoService.insert(photo);
        clear();
        setStatus("empty");
        if (onSuccess) {
          onSuccess();
        }
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
      {status === "previewing" && (
        <>
          <button
            className="large gold save-button uppercase font-bold absolute inset-0"
            onClick={() => save()}
          >
            Save
          </button>
          <Button className="clear btn-ghost absolute" onClick={clear}>
            <IoMdClose />
          </Button>
        </>
      )}
      {status !== "empty" && status !== "previewing" && (
        <div className="status opacity-pulse">{status}</div>
      )}
      {status !== "success" && imgSrc && <img src={imgSrc} />}
    </div>
  );
}
