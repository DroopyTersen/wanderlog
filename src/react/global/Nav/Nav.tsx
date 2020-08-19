import React, { useState } from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";
import { useScreenMode } from "../../hooks/useScreenMode";
import { FaRoad, FaRegEdit, FaEllipsisV } from "react-icons/fa";
import { RiRoadMapLine, RiSearchLine } from "react-icons/ri";
import { Menu, MenuDirection } from "../../components/Menu/Menu";
import { FiPlus } from "react-icons/fi";
import { RiMenu4Line } from "react-icons/ri";

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
      {/*       
      <button className="nav-item clear">
        <RiSearchLine />
      </button>
      <Link className="nav-item clear" role="button" to="/trips">
        <FaRoad />
        <span>Trips</span>
      </Link>

      <Link className="nav-item clear" role="button" to="/places">
        <RiRoadMapLine />
        <span>Places</span>
      </Link>

      <Menu direction={direction}>
        <Menu.Trigger className="nav-item clear">
          <FiPlus />
          <span>New</span>
        </Menu.Trigger>
        <Menu.Submenu>
          <Link to="/trips/new">
            <FaRoad />
            Add Trip
          </Link>
          <Link to="/photos/upload">Add Photo</Link>
          <Link to="/places/new">Add Place</Link>
          <Link to="/dailyLogs/new">Add Daily Log</Link>
        </Menu.Submenu>
      </Menu> */}
    </nav>
  );
}
