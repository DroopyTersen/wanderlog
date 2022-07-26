import React, { useState } from "react";
import { motion } from "framer-motion";
import "./MenuTrigger.scss";

const MenuTrigger = function ({ isActive, setIsActive }) {
  return (
    <>
      <motion.label
        className="menu-trigger"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <div>
          <div>
            <span></span>
            <span></span>
          </div>
          <svg dangerouslySetInnerHTML={{ __html: `<use xlink:href="#path"/>` }} />
          <svg dangerouslySetInnerHTML={{ __html: `<use xlink:href="#path"/>` }} />
        </div>
      </motion.label>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" id="path">
          <path d="M22,22 L2,22 C2,11 11,2 22,2 C33,2 42,11 42,22"></path>
        </symbol>
      </svg>
    </>
  );
};

export default React.memo(MenuTrigger);
