import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Link } from "react-router-dom";
import { Button } from "../inputs/buttons";

export function DropdownMenu({
  label,
  children,
  className,
  align = "left",
}: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root modal={false}>
      {typeof label === "string" ? (
        <RadixDropdownMenu.Trigger className={`btn btn-ghost ${className}`}>
          {label}
        </RadixDropdownMenu.Trigger>
      ) : (
        <RadixDropdownMenu.Trigger asChild={true}>
          {label}
        </RadixDropdownMenu.Trigger>
      )}
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content asChild>
          <ul
            style={{
              background: "var(--popupBackground)",
            }}
            // className={`z-10 sm:absolute mt-1 shadow-xl bg-primary-700 ring-1 ring-primary ring-opacity-5 focus:outline-none menu p-3 rounded-box`}
            className={`m-1 shadow-xl bg-primary-700 menu p-2 rounded-lg min-w-[120px] z-20`}
          >
            {children}
          </ul>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}
export const Dropdown = RadixDropdownMenu;

export function ContextMenu(props: Omit<DropdownMenuProps, "label">) {
  return (
    <DropdownMenu
      {...(props as any)}
      label={
        <Button
          className="btn-ghost"
          variants={["circle"]}
          title="Context menu"
        >
          <BsThreeDotsVertical />
        </Button>
      }
    />
  );
}

export function DropdownMenuItem({ children, to = "", ...rest }) {
  let Elem: any = to ? Link : "span";
  return (
    <RadixDropdownMenu.Item asChild {...rest}>
      <li className="w-auto overflow-hidden font-medium">
        {to ? (
          <Link className="truncate" to={to}>
            {children}
          </Link>
        ) : (
          children
        )}
      </li>
    </RadixDropdownMenu.Item>
  );
}
ContextMenu.Item = DropdownMenuItem;
DropdownMenu.Item = DropdownMenuItem;

interface DropdownMenuProps {
  children: React.ReactNode;
  label: JSX.Element | string;
  className?: string;
  align?: "left" | "right";
  [key: string]: any;
}
