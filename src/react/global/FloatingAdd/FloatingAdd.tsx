import React, { useState, useRef } from "react";
import "./FloatingAdd.scss";
import { useNavigate, useParams } from "react-router";
import useClickOutside from "../../shared/useClickOutside";
export default function FloatingAdd() {
  let { tripId, logId } = useParams();
  let navigate = useNavigate();
  let ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));

  let buttons = [
    { label: "+ Trip", path: "/trips/new" },
    { label: "+ Photo", path: "/photos/new" },
    { label: "+ Place", path: "/places/new" },
    { label: "+ Daily Log", path: "/dailyLogs/new" },
  ];
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div className={"floating-add " + (isOpen ? "open" : "closed")}>
      <div className="submenu ">
        {buttons.map((button) => (
          <button
            key={button.path}
            className="shadow btn-secondary"
            onClick={() => navigate(button.path)}
          >
            {button.label}
          </button>
        ))}
      </div>

      <button
        ref={ref}
        className="btn-warning shadow shadow-small"
        onClick={() => setIsOpen((val) => !val)}
      >
        ADD
      </button>
    </div>
  );
}
