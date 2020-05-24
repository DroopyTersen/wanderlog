import React from "react";
import { NewDailyLogScreen, EditDailyLogScreen } from "./DailyLogs/dailyLogsScreens";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import TripForm, { NewTripScreen, EditTripScreen } from "./Trips/TripForm";
import TripsLayout from "./Trips/TripsLayout";
import TripsList from "./Trips/TripsList";
import TripDetails from "./Trips/TripDetails";
import NetworkStatusProvider, { useNetworkStatus } from "./global/NetworkStatusProvider";
import Header from "./global/Header/Header";
import FloatingAdd from "./global/FloatingAdd/FloatingAdd";
import DailyLogDetails from "./DailyLogs/DailyLogDetails";
function App({}) {
  return (
    <div className="app">
      <NetworkStatusProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="*" element={<HomeScreen />} />

            <Route path="/trips" element={<TripsLayout />}>
              <Route path="/" element={<TripsList />} />
              <Route path="new" element={<NewTripScreen />} />
              <Route path=":id" element={<TripDetails />} />
              <Route path=":id/edit" element={<EditTripScreen />} />
              <Route path=":tripId/dailyLogs/new" element={<NewDailyLogScreen />} />
              <Route path=":tripId/dailyLogs/:logId" element={<DailyLogDetails />} />
              <Route path=":tripId/dailyLogs/:logId/edit" element={<EditDailyLogScreen />} />
            </Route>

            <Route path="/dailyLogs">
              <Route path="new" element={<NewDailyLogScreen />} />
              <Route path="/:logId/edit" element={<EditDailyLogScreen />} />
              <Route path="/:logId" element={<DailyLogDetails />} />
            </Route>

            <Route path="/places" element={<PlacesLayout />}>
              <Route path="/" element={<PlacesScreen />} />
              <Route path="new" element={<NewPlace />} />
              <Route path=":id" element={<PlaceDetails />} />
              <Route path=":id/edit" element={<EditPlace />} />
            </Route>
          </Routes>
          <FloatingAdd />
          {/* <Nav /> */}
        </Router>
      </NetworkStatusProvider>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="content centered">
      <h1>Home</h1>
    </div>
  );
}

function PlacesLayout() {
  return (
    <div className="content">
      <h1>Places</h1>
      <Outlet />
    </div>
  );
}

function PlacesScreen() {
  return <h2>Places List</h2>;
}
function NewPlace() {
  return <h2>New Place</h2>;
}
function EditPlace() {
  let { id } = useParams();
  return <h2>Edit Place: {id}</h2>;
}
function PlaceDetails() {
  let { id } = useParams();
  return <h2>Place Details: {id}</h2>;
}

export default App;
