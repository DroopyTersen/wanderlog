import React, { useRef } from "react";
import "./Popup.scss";
import { Button } from "../inputs/buttons";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "../../hooks/useOnClickOutside";
export default function Popup({ isOpen, close, title, children, className = "" }) {
  let popupRef = useRef();
  useOnClickOutside(popupRef, close);
  return (
    <div className={["popup", className, isOpen ? "open" : "closed"].filter(Boolean).join(" ")}>
      <Button className="popup-close" onClick={close}>
        <IoMdClose />
      </Button>
      {title && <h2 className="popup-title">{title}</h2>}
      <div ref={popupRef} className="popup-content">
        {children}
      </div>
    </div>
  );
}
