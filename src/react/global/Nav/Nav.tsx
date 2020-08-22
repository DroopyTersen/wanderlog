import React, { useState } from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";
import { useScreenMode } from "../../hooks/useScreenMode";

import MenuTrigger from "./MenuTrigger";
import Popup from "../../components/surfaces/Popup";

export default function Nav() {
  let { size, orientation } = useScreenMode();
  let position = size === "large" ? "top" : "bottom";
  let cssClass = ["nav", position].join(" ");
  let [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={cssClass}>
      <MenuTrigger isActive={isOpen} setIsActive={setIsOpen} />

      <Popup
        className="menu-items"
        title="Wanderlog"
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      >
        <Link to="/Trips">Trips</Link>
        <Link to="/places">Places</Link>
        <Link to="/Photos">Photos</Link>
        <Link to="/dailylogs">Daily Logs</Link>
      </Popup>
      <div className="desktop-links">
        <Link to="/Trips">Trips</Link>
        <Link to="/places">Places</Link>
        <Link to="/Photos">Photos</Link>
        <Link to="/dailylogs">Daily Logs</Link>
      </div>
    </nav>
  );
}
