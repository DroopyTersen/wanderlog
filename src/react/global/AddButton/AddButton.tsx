import React, { useState, useRef } from "react";
import "./AddButton.scss";
import { useNavigate, useParams } from "react-router";
import useClickOutside from "../../shared/useClickOutside";
import { Button } from "../../components/inputs/buttons";
import { useMenu, Menu } from "../../components/Menu/Menu";
import { Link } from "react-router-dom";

export default function AddButton({ direction = "up" }: { direction: "up" | "down" }) {
  let { tripId, logId } = useParams();

  let buttons = [
    { label: "+ Trip", path: "/trips/new" },
    { label: "+ Photo", path: "/photos/upload" },
    { label: "+ Place", path: "/places/new" },
    { label: "+ Daily Log", path: "/dailyLogs/new" },
  ];
  return (
    <Menu direction={direction} className="add-button">
      <Menu.Trigger>New!</Menu.Trigger>
      <Menu.Submenu>
        <Link to="/trips/new">Add Trip</Link>
        <Link to="/photos/upload">Add Photo</Link>
        <Link to="/places/new">Add Place</Link>
        <Link to="/dailyLogs/new">Add Daily Log</Link>
      </Menu.Submenu>
    </Menu>
  );
}
