import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { HomeScreen } from "features/home/HomeScreen";
import { ProfileScreen } from "features/auth/ProfileScreen";
import Nav from "./components/Nav/Nav";
import { Header } from "./components";
import { TripsScreen, TripDetailsScreen, TripFormScreen } from "features/trips/screens";
import { DailyLogFormScreen } from "features/dailyLogs/screens/DailyLogFormScreen";

export default function AuthenticatedRoutes() {
  return (
    <>
      <Routes>
        <Route path="*" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/trips" element={<Layout title="Trips" />}>
          <Route path="/" element={<TripsScreen />} />
          <Route path="/*" element={<TripsScreen />} />
          <Route path=":tripId" element={<TripDetailsScreen />} />
          <Route path=":tripId/dailylogs/new" element={<DailyLogFormScreen />} />
          <Route path="new" element={<TripFormScreen />} />
          <Route path=":tripId/edit" element={<TripFormScreen />} />
          {/* <Route path="/" element={<DailyLogsScreen />} />
          <Route path="new" element={<NewDailyLogScreen />} />
          <Route path="/:logId/edit" element={<EditDailyLogScreen />} />
          <Route path="/:logId" element={<DailyLogDetailsScreen />} /> */}
        </Route>
        <Route path="/dailylogs" element={<Layout title="Daily Logs" />}>
          <Route path="new" element={<DailyLogFormScreen />} />
          <Route path=":dailyLogId/edit" element={<DailyLogFormScreen />} />
        </Route>
      </Routes>
      <Nav />
    </>
  );
}

function Layout({ title }) {
  return (
    <div className="content">
      <Header title={title} />

      <Outlet />
    </div>
  );
}
