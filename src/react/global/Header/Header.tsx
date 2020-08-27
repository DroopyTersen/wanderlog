import React, { useRef } from "react";
import "./Header.scss";
import { Link, useRoutes, useLocation, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

export default function Header({ title = "Wanderlog" }) {
  let { pathname } = useLocation();
  let backLink = "";
  if (pathname !== "/") {
    backLink = "/" + pathname.substr(0, pathname.lastIndexOf("/"));
  }
  // console.log("Back link ", backLink, pathname);

  return (
    <div className="header">
      {backLink ? (
        <Link to={backLink} className="back">
          <MdArrowBack size={22} />
        </Link>
      ) : (
        <div></div>
      )}
      <h1 className="header-title">{title}</h1>
      <div></div>
    </div>
  );
}
