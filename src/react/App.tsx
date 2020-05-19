import React from "react";
import DailyLogForm, { NewDailyLogScreen, EditDailyLogScreen } from "./DailyLogs/DailyLogForm";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import TripForm, { NewTripScreen, EditTripScreen } from "./Trips/TripForm";
import TripsLayout from "./Trips/TripsLayout";
import TripsList from "./Trips/TripsList";
import TripDetails from "./Trips/TripDetails";
import NetworkStatusProvider, { useNetworkStatus } from "./global/NetworkStatusProvider";
function App({}) {
  return (
    <div className="app">
      <NetworkStatusProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path="*" element={<HomeScreen />} />

            <Route path="/trips" element={<TripsLayout />}>
              <Route path="/" element={<TripsList />} />
              <Route path="new" element={<NewTripScreen />} />
              <Route path=":id" element={<TripDetails />} />
              <Route path=":id/edit" element={<EditTripScreen />} />
              <Route path=":tripId/logs/new" element={<NewDailyLogScreen />} />
              <Route path=":tripId/logs/:logId" element={<EditDailyLogScreen />} />
              <Route path=":tripId/logs/:logId/edit" element={<EditDailyLogScreen />} />
            </Route>

            <Route path="/places" element={<PlacesLayout />}>
              <Route path="/" element={<PlacesScreen />} />
              <Route path="new" element={<NewPlace />} />
              <Route path=":id" element={<PlaceDetails />} />
              <Route path=":id/edit" element={<EditPlace />} />
            </Route>
          </Routes>
        </Router>
      </NetworkStatusProvider>
    </div>
  );
}

function HomeScreen() {
  return <h2>Home</h2>;
}

function Nav() {
  let isOnline = useNetworkStatus();
  return (
    <nav className="menu">
      <Link to="/">Home</Link>
      <Link to="/trips">Trips</Link>
      <Link to="/places">Places</Link>
      <div>Network Status: {isOnline ? "Online" : "Offline"}</div>
    </nav>
  );
}

function PlacesLayout() {
  return (
    <>
      <h1>Places</h1>
      <Outlet />
    </>
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
