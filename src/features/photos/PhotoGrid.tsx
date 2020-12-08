import { Button, Img } from "core/components";
import { useDisableBodyScroll } from "core/hooks/useDisableBodyScroll";
import React, { useEffect } from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "urql";
import { PhotoUploader } from "./PhotoUploader";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

export function PhotoGrid({ photos = [], date, onChange }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [{ fetching: isDeleting }, deleteMutation] = useMutation(DELETE_MUTATION);

  const deletePhoto = async () => {
    if (window.confirm("Are you sure!?!")) {
      let photo = photos[selectedPhoto];
      if (photo) {
        await Promise.all([await deletePhotoBlobs(photo), await deleteMutation({ id: photo.id })]);
        setSelectedPhoto(null);
      }
    }
  };
  useDisableBodyScroll(selectedPhoto !== null);
  return (
    <>
      <AnimateSharedLayout type="crossfade">
        <div className="photo-grid">
          <PhotoUploader date={date} onSuccess={onChange} />
          {(photos || []).map((photo, index) => (
            <motion.div
              layoutId={`photo-${photo.id}`}
              key={photo.id}
              onClick={() => setSelectedPhoto(index)}
            >
              <Img initial={photo.blurred} src={photo.thumbnail} />
            </motion.div>
          ))}
        </div>
        <AnimatePresence exitBeforeEnter={true}>
          {selectedPhoto !== null && (
            <motion.div
              className="photo-overlay"
              layoutId={`photo-${photos[selectedPhoto].id}`}
              // initial={{ height: "50vw", opacity: 1, width: "50vw", y: "50vh" }}
              // animate={{ height: "100vh", width: "100vw", opacity: 1 }}
              // exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
            >
              <Button className="close" onClick={() => setSelectedPhoto(null)}>
                <IoMdClose />
              </Button>
              <Img src={photos[selectedPhoto].url} />
              <div className="footer">
                <button className="delete scary" disabled={isDeleting} onClick={deletePhoto}>
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  );
}

async function deletePhotoBlobs({ id, url, thumbnail }) {
  return Promise.all([fetch(url, { method: "DELETE" }), fetch(thumbnail, { method: "DELETE" })]);
}

const DELETE_MUTATION = `
mutation deletePhoto($id: Int!) {
  delete_photos_by_pk(id: $id) {
    id
  }
}
`;
