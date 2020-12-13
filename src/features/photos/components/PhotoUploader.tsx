import { Button } from "core/components";
import useImageUploader from "core/hooks/useImageUploader";
import { useAuth } from "features/auth/auth.provider";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "urql";
import { v4 as uuid } from "uuid";

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
        let { url, thumbnail, blurred } = await resizeAndUpload(files[0], currentUser.username);
        let photo = { date, url, thumbnail, blurred };
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
      {status !== "empty" && status !== "previewing" && (
        <div className="status opacity-pulse">{status}</div>
      )}
      {imgSrc && <img src={imgSrc} />}
    </div>
  );
}

const resizeAndUpload = async (file: File, username: string) => {
  let filename = uuid() + ".jpg";
  let fullSizeUrl = `/api/photos/${username}/${filename}`;
  let thumbnailUrl = `/api/photos/${username}/thumbnail.${filename}`;
  let start = Date.now();
  console.log("STARTING RESIZE", start);
  let fullsizedImage = await resizeFile(file, FULL_SIZE);
  let thumbnailImage = await resizeImage(fullsizedImage, THUMB_SIZE);
  let blursizedImage = await resizeImage(thumbnailImage, 14);
  console.log("BLUR SIZE BYTES= " + (blursizedImage + "").length);
  console.log(blursizedImage);
  let totalResizeTime = Date.now() - start;
  console.log("TOTAL RESIZE TIME", totalResizeTime);
  await fetch(thumbnailUrl, {
    method: "POST",
    body: thumbnailImage,
  });

  await fetch(fullSizeUrl, {
    method: "POST",
    body: fullsizedImage,
  });

  return {
    url: fullSizeUrl,
    thumbnail: thumbnailUrl,
    blurred: blursizedImage,
  };
};

const resizeFile = (file: File, maxSize): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Ensure it's an image
    if (file.type.match(/image.*/)) {
      console.log("An image has been loaded");

      // Load the image
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
        resolve(resizeImage(readerEvent?.target?.result as string, maxSize));
      };
      reader.readAsDataURL(file);
    }
  });
};

const resizeImage = (imgSrc: string, maxSize): Promise<string> => {
  return new Promise((resolve, reject) => {
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
    image.src = imgSrc;
  });
};

const INSERT_MUTATION = `
mutation AddPhoto($object: photos_insert_input!) {
    insert_photos_one(object: $object) {
      id
      thumbnail
      url
      date
      blurred
    }
  }
  
`;
