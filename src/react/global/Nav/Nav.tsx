import React from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav border">
      <div className="nav-item nav-item-search">Search</div>
      <div className="nav-item">
        <Link to="/trips">Trips</Link>
      </div>

      <div>
        <Link to="/places">Places</Link>
      </div>
      <div className="nav-item">Add</div>
      <div className="nav-item">More</div>
    </nav>
  );
}
