import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { HomeScreen } from "features/home/HomeScreen";
import { ProfileScreen } from "features/auth/ProfileScreen";
import Nav from "./components/Nav/Nav";
import { Header } from "./components";
import { TripsScreen, TripDetailsScreen, TripFormScreen } from "features/trips/screens";
import { DailyLogFormScreen } from "features/dailyLogs/screens/DailyLogFormScreen";
import DailyLogDetails from "features/dailyLogs/screens/DailyLogDetails";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";

export default function AuthenticatedRoutes() {
  return (
    <>
      <AnimatePresence>
        <Routes>
          <AnimatedRoute path="*" element={<HomeScreen />} key="home" />
          <AnimatedRoute path="/profile" element={<ProfileScreen />} key="profile" />
          <Route path="/trips" element={<ContentLayout title="Trips" key="trips-layout" />}>
            <AnimatedRoute path="/*" element={<TripsScreen />} key="trips-fallback" />
            <AnimatedRoute path="/" element={<TripsScreen />} key="trips-index" />
            <AnimatedRoute path=":tripId" element={<TripDetailsScreen />} key="trip-details" />
            <AnimatedRoute path="new" element={<TripFormScreen />} key="new-trip" />
            <AnimatedRoute path=":tripId/edit" element={<TripFormScreen />} key="edit-trip" />
            {/* NESTED TRIP DAILY LOGS */}
            <AnimatedRoute
              key="new-daily-log-from-trip"
              path=":tripId/dailylogs-new"
              element={<DailyLogFormScreen />}
            />
            <AnimatedRoute
              key="daily-log-from-trip"
              path=":tripId/dailylogs-:dailyLogId"
              element={<DailyLogDetails />}
            />
            <AnimatedRoute
              path=":tripId/dailylogs-:dailyLogId/edit"
              element={<DailyLogFormScreen />}
            />
          </Route>
          <Route
            key="dailylogs-layout"
            path="/dailylogs"
            element={<ContentLayout title="Daily Logs" />}
          >
            <AnimatedRoute
              key="new-dailylog"
              path="new"
              element={<DailyLogFormScreen />}
              id="new-dailylog"
            />
            <AnimatedRoute
              key="dailylog-details"
              path=":dailyLogId"
              element={<DailyLogDetails />}
            />
            <AnimatedRoute
              key="edit-dailylog"
              path=":dailyLogId/edit"
              element={<DailyLogFormScreen />}
            />
          </Route>
        </Routes>
      </AnimatePresence>
      <Nav />
    </>
  );
}

function AnimatedRoute({ path, element, children = undefined, ...props }) {
  return (
    <Route
      {...props}
      path={path}
      element={
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {element}
        </motion.div>
      }
    >
      {children}
    </Route>
  );
}

function ContentLayout({ title }) {
  return (
    <div className="content">
      {title && <Header title={title} />}
      <Outlet />
    </div>
  );
}
function HeaderLayout({ title }) {
  return (
    <>
      <Header title={title} />
      <Outlet />
    </>
  );
}
