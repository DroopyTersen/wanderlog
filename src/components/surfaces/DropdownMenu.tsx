import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Link } from "react-router-dom";

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
      <RadixDropdownMenu.Content asChild>
        <ul
          // className={`z-10 sm:absolute mt-1 shadow-xl bg-primary-700 ring-1 ring-primary ring-opacity-5 focus:outline-none menu p-3 rounded-box`}
          className={`m-1 shadow-xl bg-primary-700 menu p-2 rounded-lg`}
        >
          {children}
        </ul>
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Root>
  );
}
export const Dropdown = RadixDropdownMenu;

export function ContextMenu(props: Omit<DropdownMenuProps, "label">) {
  return (
    <DropdownMenu
      {...(props as any)}
      label={
        <button
          className="bg-gray-100 rounded-full btn btn-ghost hover:bg-gray-200"
          title="Context menu"
        >
          <BsThreeDotsVertical />
        </button>
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
