import React from "react";
import { Outlet } from "react-router-dom";

export default function TripsLayout() {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
}
