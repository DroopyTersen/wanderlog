import React, { useRef } from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import useClickOutside from "../../shared/useClickOutside";

export default function Header({ title = "Wanderlog" }) {
  return (
    <nav className="header border fixed split-nav">
      <div className="nav-brand">
        <h1 className="app-title">
          <a href="/">Wanderlog</a>
        </h1>
      </div>
      <div className="collapsible">
        <input id="collapsible1" type="checkbox" name="collapsible1" />
        <button>
          <label htmlFor="collapsible1">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </label>
        </button>
        <div className="collapsible-body">
          <ul className="inline">
            <li>
              <Link to="/trips">Trips</Link>
            </li>
            <li>
              <Link to="/trips">Places</Link>
            </li>
            <li>
              <Link to="/trips">Photos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
