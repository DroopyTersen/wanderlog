import React from "react";
import { Outlet } from "react-router-dom";
import AppBackground from "../global/AppBackground/AppBackground";

export default function TripsLayout() {
  return (
    <>
      <AppBackground variant="blurred" />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}
