import React from "react";
import "./Popup.scss";
import { Button } from "../inputs/buttons";

export default function Popup({ isOpen, close, title, children, className = "" }) {
  return (
    <div className={["popup", className, isOpen ? "open" : "closed"].filter(Boolean).join(" ")}>
      <Button className="popup-close" onClick={close}>
        x
      </Button>
      {title && <h2 className="popup-title">{title}</h2>}
      <div className="popup-content">{children}</div>
    </div>
  );
}
