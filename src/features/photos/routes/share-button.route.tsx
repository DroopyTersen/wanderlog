import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import { Button } from "~/components/inputs/buttons";
import { TripDto } from "~/features/trips/trip.types";
import { photoService } from "../photo.service";
import { PhotoDto } from "../photo.types";

export default function PhotoShareRoute() {
  let data = useLoaderData() as { photo: PhotoDto };
  let photo = data.photo;
  if (!photo) {
    return null;
  }
  return <PhotoShareButton photo={photo} />;
}

export const loader = async ({ request }) => {
  let url = new URL(request.url);
  let photoId = url.searchParams.get("photoId");
  if (photoId) {
    let photo = await photoService.getById(photoId);
    return {
      photo,
    };
  }
};
function PhotoShareButton({
  photo,
  trip,
  className = "",
}: {
  photo: PhotoDto;
  trip?: TripDto;
  className?: string;
}) {
  let [blob, setBlob] = useState<Blob | null>(null);
  let hasStartedBlobLoad = useRef(false);
  let [err, setErr] = useState<Error | null>(null);
  useEffect(() => {
    if (!hasStartedBlobLoad.current) {
      hasStartedBlobLoad.current = true;
      fetch(
        photo.full.replace("https://wanderlog.droopy.workers.dev/", "/api/")
      )
        .then((r) => r.blob())
        .then((result) => setBlob(result))
        .catch((err) => {
          setErr(err);
        });
    }
  }, [photo.full]);

  let date = dayjs(photo.exif?.timestamp || photo.createdAt);
  let filename = `${date.format("YYYY-MM-DD")}_${photo.id.substring(0, 5)}.jpg`;

  const handleShare = async () => {
    if (!blob) return;
    // console.log("🚀 | handleShare | blob", blob);

    const data = {
      files: [
        new File([blob], filename, {
          type: "image/jpeg",
        }),
      ],
      title: `${trip ? trip.title + " - " : ""} ${date
        .toDate()
        .toLocaleDateString()}`,
      text: `Wanderlog photo from ${date.toDate().toLocaleDateString()}`,
    };
    try {
      if (!navigator.canShare(data)) {
        throw new Error("Can't share data.");
      }
      await navigator.share(data);
    } catch (err) {
      console.log("share error", err.name, err.message);
      if (err?.name === "NotAllowedError") {
      }
    }
  };
  if (err) {
    return <div>{err.message}</div>;
  }
  return (
    <Button
      disabled={!navigator.canShare || !blob}
      key={"share-button" + photo.id}
      className={className}
      variants={["circle", "primary"]}
      onClick={() => {
        handleShare();
      }}
    >
      <BsDownload size={24} />
    </Button>
  );
}
