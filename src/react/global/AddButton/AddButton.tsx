import React, { useState, useRef } from "react";
import Popup from "../../components/surfaces/Popup";
import "./AddButton.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../../components/inputs/buttons";
import useOnClickOutside from "../../hooks/useOnClickOutside";
export default function AddButton({ children }) {
  let popupRef = useRef(null);
  let [isOpen, setIsOpen] = useState(false);
  useOnClickOutside(popupRef, () => setIsOpen(false));

  return (
    <div ref={popupRef}>
      <Button onClick={() => setIsOpen((val) => !val)} className="add-trigger">
        <AiOutlinePlus size={20} />
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
