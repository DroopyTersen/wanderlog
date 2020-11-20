import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { HomeScreen } from "features/home/HomeScreen";
import { ProfileScreen } from "features/auth/ProfileScreen";
import Nav from "./components/Nav/Nav";
import { NewTripForm } from "features/trips/TripForm";
// import {
//   NewDailyLogScreen,
//   EditDailyLogScreen,
//   DailyLogDetailsScreen,
//   DailyLogsScreen,
// } from "features/dailyLogs/dailyLogs.screens";

export default function AuthenticatedRoutes() {
  return (
    <>
      <Routes>
        <Route path="*" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/trips" element={<Layout />}>
          <Route path="new" element={<NewTripForm />} />
          {/* <Route path="/" element={<DailyLogsScreen />} />
          <Route path="new" element={<NewDailyLogScreen />} />
          <Route path="/:logId/edit" element={<EditDailyLogScreen />} />
          <Route path="/:logId" element={<DailyLogDetailsScreen />} /> */}
        </Route>
      </Routes>
      <Nav />
    </>
  );
}

function Layout() {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
}
