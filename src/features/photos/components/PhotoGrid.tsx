import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useIsOnline } from "~/common/isOnline";
import { BigDate, Img } from "~/components";
import { CarouselSlider } from "~/components/carousel/CarouselSlider";
import { Button } from "~/components/inputs/buttons";
import { TripDayPicker } from "~/features/trips/components/TripDayPicker";
import { TripDto } from "~/features/trips/trip.types";
import { useDisableBodyScroll } from "~/hooks/useDisableBodyScroll";
import { groupPhotosByDate, photoService } from "../photo.service";
import { PhotoDto } from "../photo.types";
import { PhotoUploader } from "./PhotoUploader";

interface Props {
  photos: PhotoDto[];
  date?: string;
  trip?: TripDto;
}

export function PhotoGrid({ photos = [], date = "", trip }: Props) {
  let isOnline = useIsOnline();
  let containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>("");
  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  const deletePhoto = async () => {
    if (selectedPhoto && window.confirm("Are you sure!?!")) {
      Promise.all([
        photoService.deleteBlobs(selectedPhoto),
        photoService.remove(selectedPhoto.id),
      ]);
      setSelectedPhotoId("");
    }
  };
  useDisableBodyScroll(!!selectedPhoto);

  useEffect(() => {
    if (selectedPhotoId && !selectedPhoto) {
      setSelectedPhotoId("");
    }
  }, [selectedPhotoId, selectedPhoto]);
  const groupedPhotos = groupPhotosByDate(photos);
  return (
    <>
      <div
        className="photo-grid grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]"
        ref={containerRef}
      >
        {trip && isOnline && <PhotoUploader date={date} tripId={trip?.id} />}
        {groupedPhotos.map((group) => (
          <React.Fragment key={group.date}>
            {groupedPhotos?.length > 1 && (
              <div
                className={
                  "overlay relative brightness-90 drop-shadow-sm bg-black/50 grid place-items-center"
                }
              >
                <BigDate variant="date-month" date={group.date} />
              </div>
            )}
            {(group.photos || []).map((photo, index) => (
              <div
                className="grid place-items-center lg:saturate-[0.95] lg:brightness-100 lg:hover:saturate-100 lg:hover:brightness-105"
                key={group.date + photo.id}
                onClick={() => {
                  setSelectedPhotoId(photo.id);
                }}
              >
                <Img
                  src={isOnline ? photo.mid : photo.small}
                  initial={photo.small}
                  className="cursor-pointer"
                />
                {!photo.date && (
                  <div className="overlay bg-black/40 drop-shadow-sm font-semibold uppercase">
                    Set Date
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence exitBeforeEnter={true}>
        {selectedPhoto && (
          <div
            className="photo-overlay bg-black"
            style={{
              paddingTop: "var(--safeContentTop)",
            }}
            // transition={{ duration: 0.08 }}
          >
            <div
              className="header absolute top-4 left-4 z-10"
              style={{
                paddingTop: "var(--safeContentTop)",
              }}
            >
              <Button
                variants={["danger"]}
                // disabled={isDeleting}
                onClick={deletePhoto}
              >
                Delete
              </Button>
            </div>
            <Button
              className="close btn-ghost z-10"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
              }}
              variants={["circle"]}
              onClick={() => setSelectedPhotoId("")}
            >
              <IoMdClose size={32} />
            </Button>

            <CarouselSlider
              startingIndex={photos.findIndex((p) => p.id === selectedPhoto.id)}
              onChange={(index) => {
                setSelectedPhotoId(photos[index]?.id || "");
              }}
            >
              {photos.map((photo) => (
                <div className="relative">
                  <Img
                    key={"slider" + photo.id}
                    className="bg-black"
                    initial={photo.small}
                    src={isOnline ? photo.full : photo.small}
                  />
                </div>
              ))}
            </CarouselSlider>
            <div className="footer flex justify-between items-center">
              {trip ? (
                <TripDayPicker
                  key={"selected" + selectedPhotoId}
                  trip={trip}
                  name="date"
                  onChange={async (event) => {
                    await photoService.updateDate(
                      selectedPhoto.id,
                      event.currentTarget.value
                    );
                  }}
                  defaultValue={selectedPhoto?.date}
                />
              ) : (
                <input
                  type="date"
                  onChange={async (event) => {
                    await photoService.updateDate(
                      selectedPhoto.id,
                      event.currentTarget.value
                    );
                  }}
                  defaultValue={selectedPhoto?.date}
                />
              )}
              {isOnline && (
                <div>
                  <iframe
                    key={"iframe" + selectedPhoto.id}
                    className="w-11 h-11 rounded-full mr-6 relative bottom-1 transition-opacity opacity-0"
                    src={`/photo-share?photoId=${selectedPhoto.id}`}
                    onLoad={(event) => {
                      let iframe: any = event.target;
                      setTimeout(() => {
                        iframe.classList.add("opacity-100");
                      }, 300);
                    }}
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
