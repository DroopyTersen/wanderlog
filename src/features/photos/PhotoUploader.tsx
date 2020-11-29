import { Button } from "core/components";
import useImageUploader from "core/hooks/useImageUploader";
import { useAuth } from "features/auth/auth.provider";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "urql";

const FULL_SIZE = 1400;
const THUMB_SIZE = 500;

export interface PhotoFormValues {
  id?: string;
  date: string;
  url: string;
  thumbnail: string;
}

interface Props {
  date?: string;
  onSuccess: () => void;
}

type PhotoStatus = "empty" | "previewing" | "saving" | "success" | "errored";

export function PhotoUploader({ date, onSuccess }: Props) {
  let { currentUser } = useAuth();
  let [status, setStatus] = useState<PhotoStatus>("empty");
  let { HiddenInput, previews, open, clear, files } = useImageUploader();

  const [insertResult, insertMutation] = useMutation(INSERT_MUTATION);

  let hasFiles = previews?.length;
  const imgSrc = previews?.[0];

  const save = async () => {
    if (hasFiles && date) {
      try {
        setStatus("saving");
        let { url, thumbnail } = await resizeAndUpload(files[0], currentUser.username);
        let photo = { date, url, thumbnail };
        await insertMutation({ object: photo });
        clear();
        setStatus("empty");
        onSuccess();
      } catch (err) {
        console.error("PHOTO SAVE ERROR", err);
        setStatus(err);
      }
    }
  };

  useEffect(() => {
    if (hasFiles) {
      setStatus("previewing");
    } else setStatus("empty");
  }, [hasFiles]);
  return (
    <div className={"photo-uploader overlay " + status}>
      {HiddenInput}
      {status === "empty" && (
        <button className="gold large" onClick={open}>
          Add Photo
        </button>
      )}
      {status === "previewing" && (
        <>
          <button className="large gold save-button" onClick={() => save()}>
            Save
          </button>
          <Button className="clear" onClick={clear}>
            <IoMdClose />
          </Button>
        </>
      )}
      {status !== "empty" && status !== "previewing" && <div className="status">{status}</div>}

      {imgSrc && <img src={imgSrc} />}
    </div>
  );
}

const resizeAndUpload = async (file: File, username: string) => {
  let fullSizeUrl = `/api/photos/${username}/${file.name}`;
  let thumbnailUrl = `/api/photos/${username}/thumbnail.${file.name}`;

  let thumbnailImage = await resize(file, THUMB_SIZE);
  await fetch(thumbnailUrl, {
    method: "POST",
    body: thumbnailImage,
  });

  let fullsizedImage = await resize(file, FULL_SIZE);
  await fetch(fullSizeUrl, {
    method: "POST",
    body: fullsizedImage,
  });

  return {
    url: fullSizeUrl,
    thumbnail: thumbnailUrl,
  };
};

const resize = (file: File, maxSize): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Ensure it's an image
    if (file.type.match(/image.*/)) {
      console.log("An image has been loaded");

      // Load the image
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = function (imageEvent) {
          console.log("🚀 | doAsync | maxSize", maxSize);
          // Resize the image
          var canvas = document.createElement("canvas"),
            width = image.width,
            height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        image.src = readerEvent.target.result as any;
      };
      reader.readAsDataURL(file);
    }
  });
};

const INSERT_MUTATION = `
mutation AddPhoto($object: photos_insert_input!) {
    insert_photos_one(object: $object) {
      id
      thumbnail
      url
      date
    }
  }
  
`;
