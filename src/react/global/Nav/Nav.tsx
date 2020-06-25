import React from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";
import { useScreenMode } from "../../hooks/useScreenMode";
import { FaRoad, FaRegEdit, FaEllipsisV } from "react-icons/fa";
import { RiRoadMapLine, RiSearchLine } from "react-icons/ri";
import { Menu, MenuDirection } from "../../components/Menu/Menu";
import { FiPlus } from "react-icons/fi";

export default function Nav() {
  let { size, orientation } = useScreenMode();
  let position = size === "large" ? "top" : "bottom";
  let cssClass = ["nav", position].join(" ");
  let direction: MenuDirection = position === "top" ? "down" : "up";
  return (
    <nav className={cssClass}>
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
      </Menu>

      <Menu direction={direction}>
        <Menu.Trigger className="nav-item clear">
          <FaEllipsisV />
          {/* <span>More</span> */}
        </Menu.Trigger>
        <Menu.Submenu>
          <Link to="/">Home</Link>
          <Link to="#">People</Link>
          <Link to="#">Settings</Link>
          <Link to="#">Sign out</Link>
        </Menu.Submenu>
      </Menu>
    </nav>
  );
}
