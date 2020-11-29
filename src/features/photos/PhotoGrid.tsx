import { Button } from "core/components";
import { Footer } from "global/components";
import React from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { PhotoUploader } from "./PhotoUploader";

export function PhotoGrid({ photos = [], date, onSuccess }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  return (
    <>
      <div className="photo-grid">
        <PhotoUploader date={date} onSuccess={onSuccess} />
        {(photos || []).map((photo, index) => (
          <div key={photo.id} onClick={() => setSelectedPhoto(index)}>
            <img src={photo.thumbnail} />
          </div>
        ))}
      </div>
      {selectedPhoto !== null && (
        <div className="photo-overlay">
          <Button className="close" onClick={() => setSelectedPhoto(null)}>
            <IoMdClose />
          </Button>
          <img src={photos[selectedPhoto].url} />
          <button className="delete scary">Delete</button>
        </div>
      )}
    </>
  );
}
