import React, { useRef, useState, useCallback } from "react";
import "./Popup.scss";
import { Button } from "../inputs/buttons";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export default function Popup({ isOpen, close, title, children, className = "" }) {
  let handleClick = useCallback(
    (event) => {
      if (event.target.tagName === "A") {
        close();
      }
    },
    [children, close]
  );
  return (
    <div className={["popup", className, isOpen ? "open" : "closed"].filter(Boolean).join(" ")}>
      <Button className="popup-close" onClick={close}>
        <IoMdClose />
      </Button>
      {title && <h2 className="popup-title">{title}</h2>}
      <div className="popup-content" onClick={handleClick}>
        {children}
      </div>
    </div>
  );
}

export function usePopup() {
  let ref = useRef();
  let [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));
  let close = useCallback(() => setIsOpen(false), []);
  return {
    isOpen,
    setIsOpen,
    close,
    ref,
  };
}

Popup.usePopup = usePopup;
