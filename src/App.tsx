import React from "react";
import "./styles/milligram.custom.scss";
import DailyLogForm from "./components/DailyLogs/DailyLogForm";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams } from "react-router-dom";
import TripForm from "./components/Trips/TripForm";

function App({}) {
  return (
    <div className="app">
      <h1>Wanderlog</h1>
      <Router>
        <Routes>
          <Route path="*" element={<HomeScreen />} />

          <Route path="/trips" element={<TripsLayout />}>
            <Route path="/" element={<TripsScreen />} />
            <Route path="new" element={<NewTrip />} />
            <Route path=":id" element={<TripDetails />} />
            <Route path=":id/edit" element={<EditTrip />} />
          </Route>

          <Route path="/places" element={<PlacesLayout />}>
            <Route path="/" element={<PlacesScreen />} />
            <Route path="new" element={<NewPlace />} />
            <Route path=":id" element={<PlaceDetails />} />
            <Route path=":id/edit" element={<EditPlace />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

function HomeScreen() {
  return <h1>Home</h1>;
}

function TripsLayout() {
  return (
    <>
      <h1>Trips</h1>
      <Outlet />
    </>
  );
}

function TripsScreen() {
  return <h2>Trips List</h2>;
}

function TripDetails() {
  let { id } = useParams();
  return <h2>Trip Details: {id}</h2>;
}

function NewTrip() {
  return <TripForm />;
}

function EditTrip() {
  let { id } = useParams();
  return <h2>Edit Trip: {id}</h2>;
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
