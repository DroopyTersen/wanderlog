import React, { ReactNode, useState, useRef, useCallback, useMemo, useContext } from "react";
import "./Menu.scss";
import { Button } from "../inputs/buttons";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export interface MenuSubComponents {
  Trigger: React.FC<{ [key: string]: any }>;
  Submenu: React.FC<{ [key: string]: any }>;
}

export type MenuDirection = "up" | "down";

export interface MenuData {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  direction: MenuDirection;
}

const MenuContext = React.createContext<MenuData>({
  isOpen: false,
  setIsOpen: null,
  direction: "down",
});

export interface MenuProps {
  direction: MenuDirection;
  className?: string;
}

const ParentMenu: React.FC<MenuProps> & MenuSubComponents = ({
  children,
  className = "",
  direction = "down",
}) => {
  let [isOpen, setIsOpen] = useState(false);

  let data = useMemo(() => {
    return {
      isOpen,
      setIsOpen,
      direction,
    };
  }, [isOpen, direction, setIsOpen]);
  return (
    <MenuContext.Provider value={data}>
      <div className={["menu", className].filter(Boolean).join(" ")}>{children}</div>
    </MenuContext.Provider>
  );
};

const Trigger = ({ children, ...rest }) => {
  let ref = useRef(null);
  let { isOpen, setIsOpen } = useContext(MenuContext);
  useOnClickOutside(ref, () => setIsOpen(false));
  let onClick = () => setIsOpen((val) => !val);
  return (
    <Button {...rest} onClick={onClick} ref={ref}>
      {children}
    </Button>
  );
};
const Submenu = ({ children, className = "", ...rest }) => {
  let { direction, isOpen } = useContext(MenuContext);
  let cssClass = [className, "menu-submenu", isOpen ? "open" : "closed", direction]
    .filter(Boolean)
    .join(" ");
  return (
    <div {...rest} className={cssClass}>
      {children}
    </div>
  );
};

ParentMenu.Submenu = Submenu;
ParentMenu.Trigger = Trigger;

export const Menu = ParentMenu;

export function useMenu(direction: "up" | "down" = "down") {
  let [isOpen, setIsOpen] = useState(false);
  console.log("useMenu -> isOpen", isOpen);
  let triggerRef = useRef(null);
  useOnClickOutside(triggerRef, () => setIsOpen(false));

  let triggerProps = useMemo(() => {
    return {
      ref: triggerRef,
      onClick: () => setIsOpen((val) => !val),
    };
  }, [setIsOpen, triggerRef]);

  let submenuProps = useMemo(() => {
    return {
      className: ["menu-submenu", direction, isOpen ? "open" : "closed"].join(" "),
    };
  }, [direction, isOpen]);

  return {
    triggerProps,
    submenuProps,
    isOpen,
    setIsOpen,
  };
}
