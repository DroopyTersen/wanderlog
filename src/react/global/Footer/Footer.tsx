import React from "react";
import "./Footer.scss";

export default function Footer({ children }) {
  return (
    <footer>
      <div className="gradient"></div>

      {children}
    </footer>
  );
}
