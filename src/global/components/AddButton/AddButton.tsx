import React, { useState, useRef } from "react";
import "./AddButton.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Popup } from "core/components";
import { motion } from "framer-motion";
export function AddButton({ children }) {
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
