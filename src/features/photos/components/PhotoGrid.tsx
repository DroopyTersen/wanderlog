import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useIsOnline } from "~/common/isOnline";
import { Img } from "~/components";
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
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>("");
  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  const deletePhoto = async () => {
    if (selectedPhotoId && window.confirm("Are you sure!?!")) {
      let photo = photos.find((p) => p.id === selectedPhotoId);
      if (photo) {
        await Promise.all([
          deletePhotoBlobs(photo),
          photoService.remove(selectedPhotoId),
        ]);
        setSelectedPhotoId("");
      }
    }
  };
  useDisableBodyScroll(!!selectedPhotoId);
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
              onClick={() => setSelectedPhotoId(photo.id)}
            >
              <Img src={photo.thumbnail} />
            </motion.div>
          ))}
        </div>
        <AnimatePresence exitBeforeEnter={true}>
          {selectedPhoto && (
            <motion.div
              className="photo-overlay"
              style={{
                paddingTop: "var(--safeContentTop)",
              }}
              layoutId={`photo-${selectedPhoto.id}`}
              transition={{ duration: 0.08 }}
            >
              <Button
                className="close btn-ghost z-10"
                onClick={() => setSelectedPhotoId("")}
              >
                <IoMdClose />
              </Button>
              <Img src={selectedPhoto.url} />
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
