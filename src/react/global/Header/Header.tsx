import React, { useRef } from "react";
import "./Header.scss";
import { Link, useRoutes, useLocation, useNavigate } from "react-router-dom";
import useClickOutside from "../../shared/useClickOutside";

export default function Header({ title = "Wanderlog" }) {
  let { pathname } = useLocation();
  let navigate = useNavigate();
  let backLink = "";
  if (pathname !== "/") {
    backLink = pathname.substr(0, pathname.lastIndexOf("/"));
    console.log("Header -> backLink", backLink);
  }

  return (
    <nav className="header border fixed split-nav">
      {pathname !== "/" && (
        // <Link to={backLink}>Back</Link>
        <button className="back-button" onClick={() => history.back()}>
          BACK
        </button>
      )}
      <div className="nav-brand">
        <div className="app-title">
          <Link to="/">Wanderlog</Link>
        </div>
      </div>
      <div className="collapsible" key={pathname}>
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
              <Link to="/trips" className={getActiveClass(pathname, "/trips")}>
                Trips
              </Link>
            </li>
            <li>
              <Link to="/places" className={getActiveClass(pathname, "/places")}>
                Places
              </Link>
            </li>
            <li>
              <Link to="/photos" className={getActiveClass(pathname, "/photos")}>
                Photos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

const getActiveClass = (pathname: string, linkPath: string) => {
  return pathname.toLowerCase().startsWith(linkPath.toLowerCase()) ? "active" : "";
};

export function LinkButton({ to = "", children, ...rest }) {
  let navigate = useNavigate();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
