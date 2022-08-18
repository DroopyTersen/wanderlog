import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useIsOnline } from "~/common/isOnline";
import { Img } from "~/components";
import { CarouselSlider } from "~/components/carousel/CarouselSlider";
import { Button } from "~/components/inputs/buttons";
import { TripDayPicker } from "~/features/trips/components/TripDayPicker";
import { TripDto } from "~/features/trips/trip.types";
import { useDisableBodyScroll } from "~/hooks/useDisableBodyScroll";
import { photoService } from "../photo.service";
import { PhotoDto } from "../photo.types";
import { PhotoUploader } from "./PhotoUploader";

interface Props {
  photos: PhotoDto[];
  date?: string;
  trip?: TripDto;
  allowUpload?: boolean;
  onChange?: () => void;
}

export function PhotoGrid({
  photos = [],
  date = "",
  trip,
  onChange = undefined,
}: Props) {
  let isOnline = useIsOnline();
  let containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const selectedPhoto =
    selectedPhotoIndex !== null ? photos?.[selectedPhotoIndex] : null;

  const deletePhoto = async () => {
    if (selectedPhoto && window.confirm("Are you sure!?!")) {
      Promise.all([
        deletePhotoBlobs(selectedPhoto),
        photoService.remove(selectedPhoto.id),
      ]);
      setSelectedPhotoIndex(null);
    }
  };
  useDisableBodyScroll(!!selectedPhoto);

  const selectedPhotoId = selectedPhoto?.id;
  useEffect(() => {
    if (selectedPhotoIndex && !selectedPhoto) {
      setSelectedPhotoIndex(null);
    }
  }, [selectedPhotoIndex, selectedPhoto]);

  return (
    <>
      <AnimateSharedLayout>
        <div className="photo-grid" ref={containerRef}>
          {trip && isOnline && (
            <PhotoUploader date={date} onSuccess={onChange} tripId={trip?.id} />
          )}
          {(photos || []).map((photo, index) => (
            <div
              // layoutId={`photo-${photo.id}`}
              key={photo.id}
              onClick={() => {
                setSelectedPhotoIndex(index);
              }}
            >
              <Img src={photo.thumbnail} />
              {!photo.date && (
                <div className="overlay bg-black/40 drop-shadow-sm font-semibold uppercase">
                  Set Date
                </div>
              )}
            </div>
          ))}
        </div>
        <AnimatePresence exitBeforeEnter={true}>
          {selectedPhoto && (
            <motion.div
              className="photo-overlay bg-black"
              style={{
                paddingTop: "var(--safeContentTop)",
              }}
              layoutId={`photo-${selectedPhoto.id}`}
              transition={{ duration: 0.08 }}
            >
              <Button
                className="close btn-ghost z-10"
                onClick={() => setSelectedPhotoIndex(null)}
              >
                <IoMdClose />
              </Button>

              <CarouselSlider
                startingIndex={selectedPhotoIndex}
                onChange={(index) => {
                  setSelectedPhotoIndex(index);
                }}
              >
                {photos.map((photo) => (
                  <img
                    key={photo.id}
                    className="bg-black"
                    // initial={photo.thumbnail}
                    src={photo.url}
                  />
                ))}
              </CarouselSlider>
              {/* <Img src={selectedPhoto.url} /> */}
              <div className="footer flex justify-between items-center">
                {trip && (
                  <TripDayPicker
                    key={selectedPhotoIndex}
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
                )}
                <Button
                  variants={["danger"]}
                  // disabled={isDeleting}
                  onClick={deletePhoto}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  );
}

async function deletePhotoBlobs({ id, url, thumbnail }) {
  return Promise.all([
    fetch(url, { method: "DELETE" }),
    fetch(thumbnail, { method: "DELETE" }),
  ]);
}
