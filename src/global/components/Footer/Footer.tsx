import React from "react";
import "./Footer.scss";

export function Footer({ children, className = "" }) {
  return (
    <footer className={className}>
      <div className="gradient"></div>

      {children}
    </footer>
  );
}
