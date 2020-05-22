import React from "react";
import DailyLogForm, { NewDailyLogScreen, EditDailyLogScreen } from "./DailyLogs/DailyLogForm";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import TripForm, { NewTripScreen, EditTripScreen } from "./Trips/TripForm";
import TripsLayout from "./Trips/TripsLayout";
import TripsList from "./Trips/TripsList";
import TripDetails from "./Trips/TripDetails";
import NetworkStatusProvider, { useNetworkStatus } from "./global/NetworkStatusProvider";
import Nav from "./global/Nav/Nav";
import Header from "./global/Header/Header";
import FloatingAdd from "./global/FloatingAdd/FloatingAdd";
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
