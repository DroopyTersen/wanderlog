import dayjs from "dayjs";
import * as md5 from "spark-md5";
import { auth } from "../auth/auth.client";
import { parseExif } from "./exif";
import { photoService } from "./photo.service";
import { ExifData, PhotoSaveInput } from "./photo.types";
const SMALL_SIZE = 460;
const MID_SIZE = 1260;
const FULL_SIZE = 3000;

let currentUser = auth?.getCurrentUser()?.username + "";
const generateFileName = (thumbnail: string, tripId = "", date = "") => {
  return md5.hash(thumbnail + tripId + date) + ".jpg";
};
export const processImageFile = async (
  file: File,
  { tripId, date }
): Promise<PhotoSaveInput> => {
  console.log("STARTING RESIZE", file.name);
  let exifData: ExifData | null = await parseExif(file);
  if (exifData && !exifData?.timestamp) {
    let now = dayjs();
    exifData.timestamp = date
      ? dayjs(date)
          .set("hour", now.get("hour"))
          .set("minute", now.get("minute"))
          .set("second", now.get("second"))
          .toISOString()
      : now.toISOString();
  }
  console.log("🚀 | processImageFile | exifData", exifData);
  let fullFile = await readFileAsDataURL(file);
  let fullsizedImage = await resizeImage(fullFile, FULL_SIZE);

  let smallImg = await resizeImage(fullsizedImage, SMALL_SIZE, 0.5);
  let midImg = await resizeImage(fullsizedImage, MID_SIZE, 0.6);
  let filename = generateFileName(smallImg, tripId, date);

  let midUrl = await photoService.uploadImage(midImg, filename, "mid");
  let fullUrl = await photoService.uploadImage(
    fullsizedImage,
    filename,
    "full"
  );
  return {
    id: filename,
    date:
      date ||
      (exifData?.timestamp
        ? dayjs(exifData?.timestamp).format("YYYY-MM-DD")
        : ""),
    tripId,
    full: fullUrl,
    mid: midUrl,
    small: smallImg,
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

const resizeImage = (
  imgSrc: string,
  maxSize: number,
  compression?: number
): Promise<string> => {
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
      resolve(canvas.toDataURL("image/jpeg", compression));
    };
    image.src = imgSrc;
  });
};
