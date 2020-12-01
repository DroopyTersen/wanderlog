import { Button, Img } from "core/components";
import { useDisableBodyScroll } from "core/hooks/useDisableBodyScroll";
import React, { useEffect } from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "urql";
import { PhotoUploader } from "./PhotoUploader";

export function PhotoGrid({ photos = [], date, onChange }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [{ fetching: isDeleting }, deleteMutation] = useMutation(DELETE_MUTATION);

  const deletePhoto = async () => {
    let photo = photos[selectedPhoto];
    if (photo) {
      await Promise.all([await deletePhotoBlobs(photo), await deleteMutation({ id: photo.id })]);
      setSelectedPhoto(null);
      // onChange();
    }
  };
  useDisableBodyScroll(selectedPhoto !== null);
  return (
    <>
      <div className="photo-grid">
        <PhotoUploader date={date} onSuccess={onChange} />
        {(photos || []).map((photo, index) => (
          <div key={photo.id} onClick={() => setSelectedPhoto(index)}>
            <Img initial={photo.blurred} src={photo.thumbnail} />
          </div>
        ))}
      </div>
      {selectedPhoto !== null && (
        <div className="photo-overlay">
          <Button className="close" onClick={() => setSelectedPhoto(null)}>
            <IoMdClose />
          </Button>
          <Img src={photos[selectedPhoto].url} />
          <div className="footer">
            <button className="delete scary" disabled={isDeleting} onClick={deletePhoto}>
              Delete
            </button>
          </div>
        </div>
      )}
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
