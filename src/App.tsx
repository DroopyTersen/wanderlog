import React from "react";
import "./styles/milligram.custom.scss";
import DailyLogForm, {
  NewDailyLogScreen,
  EditDailyLogScreen,
} from "./components/DailyLogs/DailyLogForm";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import TripForm, { NewTripScreen, EditTripScreen } from "./components/Trips/TripForm";
import TripsLayout from "./components/Trips/TripsLayout";
import TripsList from "./components/Trips/TripsList";
import TripDetails from "./components/Trips/TripDetails";
import "./styles/App.scss";
function App({}) {
  return (
    <div className="app">
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
    </div>
  );
}

function HomeScreen() {
  return <h2>Home</h2>;
}

function Nav() {
  return (
    <nav className="menu">
      <Link to="/">Home</Link>
      <Link to="/trips">Trips</Link>
      <Link to="/places">Places</Link>
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
