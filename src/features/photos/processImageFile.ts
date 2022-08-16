import dayjs from "dayjs";
import * as md5 from "spark-md5";
import { auth } from "../auth/auth.client";
import { parseExif } from "./exif";
import { ExifData, PhotoSaveInput } from "./photo.types";
const THUMB_SIZE = 460;
const FULL_SIZE = 3000;

let currentUser = auth?.getCurrentUser()?.username + "";
const FILE_URL_PREFIX = `https://wanderlog.droopy.workers.dev/photos`;
const UPLOAD_FILE_URL_PREFIX = `/api/photos`;
const generateFileName = (thumbnail: string, tripId = "", date = "") => {
  return md5.hash(thumbnail + tripId + date) + ".jpg";
};
export const processImageFile = async (
  file: File,
  { tripId, date }
): Promise<PhotoSaveInput> => {
  console.log("STARTING RESIZE", file.name);
  let exifData: ExifData | null = await parseExif(file);
  console.log("🚀 | processImageFile | exifData", exifData);
  let fullFile = await readFileAsDataURL(file);
  let fullsizedImage = await resizeImage(fullFile, FULL_SIZE);

  let thumbnailImage = await resizeImage(fullsizedImage, THUMB_SIZE);
  let filename = generateFileName(thumbnailImage);
  let blobPath = `/${currentUser}/${filename}`;
  let fileUrl = `${FILE_URL_PREFIX}${blobPath}`;
  let uploadUrl = `${UPLOAD_FILE_URL_PREFIX}${blobPath}`;
  console.log("END RESIZE", file.name);
  await fetch(uploadUrl, {
    method: "POST",
    body: fullsizedImage,
  });

  return {
    id: filename,
    date:
      date ||
      (exifData?.timestamp
        ? dayjs(exifData?.timestamp).format("YYYY-MM-DD")
        : ""),
    tripId,
    url: fileUrl,
    thumbnail: thumbnailImage,
    exif: exifData,
  };
};
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Ensure it's an image
    if (file.type.match(/image.*/)) {
      console.log("An image has been loaded");

      // Load the image
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
        console.log("DONE READING");
        resolve(readerEvent?.target?.result as string);
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
      let canvas = document.createElement("canvas");
      let width = image.width;
      let height = image.height;
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
      canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.src = imgSrc;
  });
};
