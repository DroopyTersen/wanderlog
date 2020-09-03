import React from "react";
import "./Card.scss";

export default function Card({ children, className = "", ...rest }) {
  let cssClass = ["card", className].filter(Boolean).join(" ");

  return (
    <div className={cssClass} {...rest}>
      {children}
    </div>
  );
}
