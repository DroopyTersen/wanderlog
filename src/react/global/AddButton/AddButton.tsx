import React, { useState } from "react";
import Popup from "../../components/surfaces/Popup";
import "./AddButton.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../../components/inputs/buttons";
export default function AddButton({ children }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
