import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { HomeScreen } from "features/home/HomeScreen";
import { ProfileScreen } from "features/auth/ProfileScreen";
import Nav from "./components/Nav/Nav";
import { EditTripForm, NewTripForm } from "features/trips/TripForm";
import { Header } from "./components";
import { TripsScreen } from "features/trips/TripsScreen";
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
        <Route path="/trips" element={<TripsLayout />}>
          <Route path="/" element={<TripsScreen />} />
          <Route path="/*" element={<TripsScreen />} />
          <Route path="new" element={<NewTripForm />} />
          <Route path=":tripId/edit" element={<EditTripForm />} />
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

function TripsLayout() {
  return (
    <div className="content">
      <Header title={`Trips`} />

      <Outlet />
    </div>
  );
}
