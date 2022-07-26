import React, { useRef } from "react";
import "./Header.scss";
import { Link, useRoutes, useLocation, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { motion, useMotionTemplate, useTransform, useViewportScroll } from "framer-motion";

const variants = {
  shadowed: {
    boxShadow: "0 8px 20px -11px rgba(0,0,0,.25)",
  },
  unshadowed: {
    boxShadow: "none",
  },
};
function useHeaderShadow() {
  let { scrollY } = useViewportScroll();
  let boxShadowOpacity = useTransform(scrollY, [0, 50], [0, 0.3]);
  let boxShadow = useMotionTemplate`0 8px 20px -11px rgba(0,0,0,${boxShadowOpacity})`;
  return {
    boxShadow,
  };
}
export function Header({ title = "Wanderlog" }) {
  let { pathname } = useLocation();
  let style = useHeaderShadow();
  let backLink = "";
  if (pathname !== "/") {
    backLink = "/" + pathname.substr(0, pathname.lastIndexOf("/"));
  }
  // console.log("Back link ", backLink, pathname);

  return (
    <motion.div className="header" style={style}>
      {backLink ? (
        <Link to={backLink} className="back">
          <MdArrowBack size={22} />
        </Link>
      ) : (
        <div></div>
      )}
      <h1 className="header-title">{title}</h1>
      <div></div>
    </motion.div>
  );
}
