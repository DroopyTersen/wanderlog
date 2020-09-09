import React from "react";
import { Routes, Route } from "react-router-dom";
import { LoginScreen } from "features/auth/LoginScreen";
import { HomeScreen } from "features/home/HomeScreen";

export default function AnonymousRoutes() {
  return (
    <Routes>
      <Route path="*" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}
