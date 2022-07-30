import { useEffect, useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { auth } from "~/features/auth/auth.client";
import "./GlobalNav.scss";
let isLoggedIn = auth.checkIsLoggedIn();

export const GlobalNav = ({ children }) => {
  let [isOpen, setIsOpen] = useState(false);
  let overlayRef = useRef<HTMLLabelElement>(null);
  let location = useLocation();
  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current) {
        overlayRef.current.click();
      }
    }
  }, [location.pathname]);

  return (
    <div className="drawer drawer-end">
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <div className="drawer-content flex flex-col h-screen">
        <div className="w-full navbar bg-base-300/0 justify-end fixed pt-[calc(var(--safeTop)+8px)] z-10">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/trips">Trips</Link>
                  </li>
                  <li>
                    <a>Photos</a>
                  </li>
                  <li>
                    <a>Locations</a>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login">Log in</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        {children}
      </div>
      <div className={`drawer-side ${!isOpen ? "pointer-events-none" : ""}`}>
        <label
          ref={overlayRef}
          htmlFor="my-drawer-3"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 overflow-y-auto w-80 bg-base-100 rounded-l-lg shadow-lg pt-[calc(var(--safeTop)+16px)]">
          <div className="flex justify-between items-center">
            <div className="title-text text-4xl ml-3">Menu</div>
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <MdOutlineClose size={24} />
            </label>
          </div>
          <div className="pt-8">
            <Link role="button" className="btn btn-primary w-full" to="/login">
              Log in
            </Link>
          </div>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Link className="rounded" to="/trips">
                    Trips
                  </Link>
                </li>
                <li>
                  <a>Photos</a>
                </li>
                <li>
                  <a>Locations</a>
                </li>
              </>
            ) : (
              <div></div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
