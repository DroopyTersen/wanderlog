import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useIsOnline } from "~/common/isOnline";
import { Img } from "~/components";
import { CarouselSlider } from "~/components/carousel/CarouselSlider";
import { Button } from "~/components/inputs/buttons";
import { useDisableBodyScroll } from "~/hooks/useDisableBodyScroll";
import { photoService } from "../photo.service";
import { PhotoDto } from "../photo.types";
import { PhotoUploader } from "./PhotoUploader";

interface Props {
  photos: PhotoDto[];
  date?: string;
  tripId?: string;
  allowUpload?: boolean;
  onChange?: () => void;
}
export function PhotoGrid({
  photos = [],
  date = "",
  tripId = "",
  onChange = undefined,
}: Props) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  let [carouselPhotos, setCarouselPhotos] = useState<PhotoDto[]>(photos);
  const selectedPhoto =
    selectedPhotoIndex !== null ? photos?.[selectedPhotoIndex] : null;
  console.log("🚀 | selectedPhotoIndex", selectedPhotoIndex);

  const deletePhoto = async () => {
    if (selectedPhoto && window.confirm("Are you sure!?!")) {
      await Promise.all([
        deletePhotoBlobs(selectedPhoto),
        photoService.remove(selectedPhoto.id),
      ]);
      setSelectedPhotoIndex(null);
    }
  };
  useDisableBodyScroll(!!selectedPhoto);
  let isOnline = useIsOnline();

  return (
    <>
      <AnimateSharedLayout>
        <div className="photo-grid">
          {date && isOnline && (
            <PhotoUploader date={date} onSuccess={onChange} tripId={tripId} />
          )}
          {(photos || []).map((photo, index) => (
            <motion.div
              layoutId={`photo-${photo.id}`}
              key={photo.id}
              onClick={() => {
                let reorderedPhotos = [
                  ...photos.slice(index),
                  ...photos.slice(0, index),
                ];
                setCarouselPhotos(reorderedPhotos);
                setSelectedPhotoIndex(index);
              }}
            >
              <Img src={photo.thumbnail} />
            </motion.div>
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

              <CarouselSlider onChange={setSelectedPhotoIndex}>
                {carouselPhotos.map((photo) => (
                  <img
                    key={photo.id}
                    className="bg-black"
                    // initial={photo.thumbnail}
                    src={photo.url}
                  />
                ))}
              </CarouselSlider>
              {/* <Img src={selectedPhoto.url} /> */}
              <div className="footer">
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

const DELETE_MUTATION = `
mutation deletePhoto($id: Int!) {
  delete_photos_by_pk(id: $id) {
    id
  }
}
`;
