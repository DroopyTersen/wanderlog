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
}

type PhotoStatus = "empty" | "previewing" | "saving" | "success" | "errored";

export function PhotoUploader({ date, tripId, onSuccess }: Props) {
  let [status, setStatus] = useState<PhotoStatus>("empty");
  // TODO: add support for multiple
  let { HiddenInput, previews, open, clear, files } = useImageUploader();

  let hasFiles = previews?.length;
  const imgSrc = previews?.[0];

  const save = async () => {
    if (hasFiles) {
      try {
        setStatus("saving");
        let photo = await processImageFile(files[0], { tripId, date });
        if (date) {
          photo.date = date;
        }
        if (tripId) {
          photo.tripId = tripId;
        }
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
        "photo-uploader overlay relative hover:brightness-125 brightness-90 " +
        status
      }
    >
      {status === "empty" && (
        <button
          className="gold large font-bold absolute inset-0"
          onClick={open}
        >
          Add Photo
        </button>
      )}
      {HiddenInput}
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
      {imgSrc && <img src={imgSrc} />}
    </div>
  );
}
