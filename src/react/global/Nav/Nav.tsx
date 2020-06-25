import React from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";
import { useScreenMode } from "../../hooks/useScreenMode";
import AddButton from "../AddButton/AddButton";

export default function Nav() {
  let { size, orientation } = useScreenMode();
  let position = size === "large" ? "top" : "bottom";
  let cssClass = ["nav", position].join(" ");
  return (
    <nav className={cssClass}>
      <div className="nav-item nav-item-search">Search</div>
      <div className="nav-item">
        <Link role="button" to="/trips">
          Trips
        </Link>
      </div>

      <div>
        <Link to="/places">Places</Link>
      </div>
      <div className="nav-item">
        <AddButton direction={position === "top" ? "down" : "up"} />
      </div>
      <div className="nav-item">More</div>
    </nav>
  );
}
