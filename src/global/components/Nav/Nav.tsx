import React, { useState, useRef, useCallback } from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";
import MenuTrigger from "./MenuTrigger";
import { useScreenMode } from "core/hooks/useScreenMode";
import { Popup } from "core/components";

export default function Nav() {
  let { size, orientation } = useScreenMode();
  let position = size === "large" ? "top" : "bottom";
  let cssClass = ["nav", position].join(" ");
  let { isOpen, setIsOpen, close, ref: menuRef } = Popup.usePopup();
  const links = (
    <>
      <Link to="/trips">Trips</Link>
      {/* <Link to="/places">Places</Link>
      <Link to="/Photos">Photos</Link>
      <Link to="/dailylogs">Daily Logs</Link> */}
      <Link to="/profile">Profile</Link>
    </>
  );
  return (
    <nav className={cssClass}>
      <div ref={menuRef}>
        <MenuTrigger isActive={isOpen} setIsActive={setIsOpen} />

        <Popup className="menu-items" title="Wanderlog" titleHref="/" isOpen={isOpen} close={close}>
          {links}
        </Popup>
      </div>
      <div className="desktop-links">{links}</div>
    </nav>
  );
}
