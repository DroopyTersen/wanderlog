import React, { useState, useRef } from "react";
import Popup from "../../components/surfaces/Popup";
import "./AddButton.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../../components/inputs/buttons";

export default function AddButton({ children }) {
  let { ref: popupRef, isOpen, setIsOpen, close } = Popup.usePopup();

  return (
    <div ref={popupRef}>
      <Button onClick={() => setIsOpen((val) => !val)} className="add-trigger">
        <AiOutlinePlus size={22} />
      </Button>
      <Popup
        className="add-links from-right"
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        title="Add New"
      >
        {children}
      </Popup>
    </div>
  );
}
