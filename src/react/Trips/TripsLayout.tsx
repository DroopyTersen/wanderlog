import React from "react";
import { Outlet } from "react-router-dom";

export default function TripsLayout() {
  return (
    <>
      <h1>Trips</h1>
      <Outlet />
    </>
  );
}
