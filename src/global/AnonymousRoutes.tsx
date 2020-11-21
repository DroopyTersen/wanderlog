import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomeScreen } from "features/home/HomeScreen";

export default function AnonymousRoutes() {
  return (
    <Routes>
      <Route path="*" element={<HomeScreen />} />
    </Routes>
  );
}
