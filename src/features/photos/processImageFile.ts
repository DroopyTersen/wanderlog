import dayjs from "dayjs";
import { generateId } from "~/common/utils";
import { auth } from "../auth/auth.client";
import { ExifData, PhotoSaveInput } from "./photo.types";

const THUMB_SIZE = 460;
const FULL_SIZE = 3000;

let currentUser = auth?.getCurrentUser()?.username + "";

export const processImageFile = async (file: File): Promise<PhotoSaveInput> => {
  let filename = generateFileName(file.name);
  let fullSizeUrl = `/api/photos/${currentUser}/${filename}`;
  console.log("🚀 | processImageFile | fullSizeUrl", fullSizeUrl);
  console.log("STARTING RESIZE", file.name);
  let fullFile = await readFile(file);
  let fullsizedImage = await resizeImage(fullFile, FULL_SIZE);
  console.log("🚀 | processImageFile | fullsizedImage", fullsizedImage);
  let exifData: ExifData | null = null; //await parseExif({ src: fullsizedImage });
  console.log("🚀 | processImageFile | exifData", exifData);

  let thumbnailImage = await resizeImage(fullsizedImage, THUMB_SIZE);
  console.log("END RESIZE", file.name);
  await fetch(fullSizeUrl, {
    method: "POST",
    body: fullsizedImage,
  });

  return {
    date:
      // dayjs(exifData?.timestamp).format("YYYY-MM-DD") ||
      dayjs().format("YYYY-MM-DD"),
    url: fullSizeUrl,
    thumbnail: thumbnailImage,
    exif: exifData,
  };
};
const generateFileName = (filename: string) => {
  let [name] = filename.split(".");
  return `${name}-${generateId()}.jpg`;
};

const readFile = (file: File): Promise<string> => {
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
