import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import "./GlobalNav.scss";
export const GlobalNav = ({ children }) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div className="drawer drawer-end">
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300/0 justify-end">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              <li>
                <a>Trips</a>
              </li>
              <li>
                <a>Photos</a>
              </li>
              <li>
                <a>Locations</a>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>
      <div className={`drawer-side ${!isOpen ? "pointer-events-none" : ""}`}>
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <div className="menu p-4 overflow-y-auto w-80 bg-base-100 rounded-l-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div className="title-text text-4xl ml-3">Menu</div>
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <MdOutlineClose size={24} />
            </label>
          </div>
          <ul>
            <li>
              <a>Trips</a>
            </li>
            <li>
              <a>Photos</a>
            </li>
            <li>
              <a>Locations</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
