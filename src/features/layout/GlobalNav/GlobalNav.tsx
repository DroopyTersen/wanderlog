import { useEffect, useRef, useState } from "react";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { Button, LinkButton } from "~/components/inputs/buttons";
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
    <div className="drawer">
      <input
        id="global-nav-drawer"
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <div className="drawer-content flex flex-col h-screen">
        <div className="flex-none fab-container left lg:hidden">
          <Button
            as="label"
            variants={["blue", "circle"]}
            htmlFor="global-nav-drawer"
            className="lg:hidden"
          >
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
                d="M5 6h15M5 12h16M5 18h13"
              ></path>
            </svg>
          </Button>
        </div>
        <div className="w-full navbar  hidden lg:flex justify-end bg-base-300/0 fixed pt-[calc(var(--safeTop)+8px)] lg:z-10">
          <ul className="menu menu-horizontal">
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/trips">Trips</Link>
                </li>
                <li>
                  <a>Photos</a>
                </li>
                {/* <li>
                  <a>Locations</a>
                </li> */}
                <li>
                  <button
                    className="btn btn-ghost"
                    onClick={() => auth.logout()}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="font-bold rounded-lg">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
        {children}
      </div>
      <div className={`drawer-side ${!isOpen ? "pointer-events-none" : ""}`}>
        <label
          ref={overlayRef}
          htmlFor="global-nav-drawer"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 overflow-y-auto w-80 bg-base-100 rounded-l-lg shadow-lg pt-[calc(var(--safeTop)+16px)]">
          <div className="flex justify-between items-center">
            <Link to="/">
              <div className="title-text text-3xl ml-1">
                {location.pathname === "/" ? "Menu" : "Wanderlog"}
              </div>
            </Link>
            <label
              htmlFor="global-nav-drawer"
              className="btn btn-square btn-ghost"
            >
              <MdOutlineClose size={24} />
            </label>
          </div>
          {!isLoggedIn && (
            <div className="pt-8">
              <LinkButton to="/login" variants={["primary"]}>
                <HiOutlineFingerPrint size={17}></HiOutlineFingerPrint>
                Sign In
              </LinkButton>
            </div>
          )}
          {isLoggedIn ? (
            <>
              <ul className=" mt-4 tracking-wider">
                <li>
                  <Link className="rounded" to="/trips">
                    Trips
                  </Link>
                </li>
                <li>
                  <a>Photos</a>
                </li>
                {/* <li>
                  <a>Locations</a>
                </li> */}
              </ul>
              <div className="mt-12">
                <div className="font-medium text-center w-full">
                  {auth.getCurrentUser()?.name}
                </div>
                <button
                  className="btn w-full btn-primary btn-ghost rounded-full text-gold-400"
                  onClick={() => auth.logout()}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};
