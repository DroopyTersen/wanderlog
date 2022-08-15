import dayjs from "dayjs";
import * as EXIF from "exif-js";
import { ExifData, Orientation } from "./photo.types";

export const parseExif = (file: File | any): Promise<ExifData | null> => {
  return new Promise((resolve, reject) => {
    EXIF.getData(file as any, function (err) {
      if (err) {
        console.error("EXIF ERROR:", err);
        reject(err);
      }
      var allMetaData = EXIF.getAllTags(this);
      console.log(allMetaData);
      let exif = parseRawExif(allMetaData);
      resolve(exif);
    });
  });
};

const parseRawExif = (rawExif): ExifData | null => {
  if (!rawExif) return null;
  let orientation = getOrientation(rawExif?.Orientation);
  return {
    timestamp: getTimestamp(rawExif) || "",
    device:
      rawExif?.Make || rawExif?.model
        ? `${rawExif?.Make} ${rawExif?.Model}`.trim()
        : "",
    orientation: orientation,
    ...getDimensions(rawExif, orientation),
    coordinates: getCoordinates(rawExif),
    altitude: convertMetersToFeet(rawExif?.GPSAltitude),
  };
};
const getTimestamp = (rawExif: any): string => {
  if (!rawExif || (!rawExif?.DateTimeOriginal && !rawExif?.DateTime)) return "";
  let [date, time] = (
    rawExif?.DateTimeOriginal ||
    rawExif?.DateTime ||
    ""
  ).split(" ");

  return dayjs(date.replace(/:/g, "-") + " " + time).toISOString();
};
const getDimensions = (
  rawExif: any,
  orientation: Orientation
): { width: number; height: number } => {
  let dimensions = {
    width: rawExif["PixelXDimension"],
    height: rawExif["PixelYDimension"],
  };

  // Invert if portrait
  if (orientation === "portrait") {
    dimensions = { width: dimensions.height, height: dimensions.width };
  }

  return dimensions;
};

// 1 = Horizontal (normal)
// 2 = Mirror horizontal
// 3 = Rotate 180
// 4 = Mirror vertical
// 5 = Mirror horizontal and rotate 270 CW
// 6 = Rotate 90 CW
// 7 = Mirror horizontal and rotate 90 CW
// 8 = Rotate 270 CW
const PORTRAIT_VALUES = [4, 5, 6, 7, 8];
const getOrientation = (orientationEnum: number): "portrait" | "landscape" => {
  return PORTRAIT_VALUES.indexOf(orientationEnum) > -1
    ? "portrait"
    : "landscape";
};

// Pull out thumbnail.blob

const convertMetersToFeet = (meters: number) => {
  return meters * 3.28084;
};

const convertDmsToDecimal = (dms: [number, number, number]): number => {
  const [degrees, minutes, seconds] = dms;
  return degrees + minutes / 60 + seconds / 3600;
};

// convert gps coordinates from Degress,Minutes,Seconds (DMS) to decimal
const convertDMSCoordinatesToDecimal = (
  latitudeRef: "N" | "S",
  latitudeDMS: [number, number, number],
  longitudeRef: "E" | "W",
  longitudeDMS: [number, number, number]
): [number, number] => {
  let latitude = convertDmsToDecimal(latitudeDMS);
  if (latitudeRef === "S") {
    latitude = -1 * latitude;
  }
  let longitude = convertDmsToDecimal(longitudeDMS);
  if (longitudeRef === "W") {
    longitude = -1 * longitude;
  }
  return [latitude, longitude];
};

const getCoordinates = (rawExif) => {
  if (rawExif.GPSLatitudeRef && rawExif.GPSLongitudeRef) {
    return convertDMSCoordinatesToDecimal(
      rawExif.GPSLatitudeRef,
      rawExif.GPSLatitude,
      rawExif.GPSLongitudeRef,
      rawExif.GPSLongitude
    );
  }
  return null;
};
