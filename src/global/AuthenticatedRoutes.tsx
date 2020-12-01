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
      <AnimateSharedLayout type="crossfade">
        <AnimatePresence>
          <Routes>
            <AnimatedRoute path="*" element={<HomeScreen />} />
            <AnimatedRoute path="/profile" element={<ProfileScreen />} />
            <Route path="/trips" element={<ContentLayout title="Trips" />}>
              <AnimatedRoute path="/*" element={<TripsScreen />} />
              <AnimatedRoute path="/" element={<TripsScreen />} />
              <AnimatedRoute path=":tripId" element={<TripDetailsScreen />} />
              <AnimatedRoute path="new" element={<TripFormScreen />} />
              <AnimatedRoute path=":tripId/edit" element={<TripFormScreen />} />
              {/* NESTED TRIP DAILY LOGS */}
              <AnimatedRoute path=":tripId/dailylogs-new" element={<DailyLogFormScreen />} />
              <AnimatedRoute path=":tripId/dailylogs-:dailyLogId" element={<DailyLogDetails />} />
              <AnimatedRoute
                path=":tripId/dailylogs-:dailyLogId/edit"
                element={<DailyLogFormScreen />}
              />
            </Route>
            <Route path="/dailylogs" element={<ContentLayout title="Daily Logs" />}>
              <Route path="new" element={<DailyLogFormScreen />} />
              <Route path=":dailyLogId" element={<DailyLogDetails />} />
              <Route path=":dailyLogId/edit" element={<DailyLogFormScreen />} />
            </Route>
          </Routes>
          <Nav />
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  );
}

function AnimatedRoute({ path, element, children = undefined, ...props }) {
  return (
    <Route
      {...props}
      path={path}
      key={path}
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
