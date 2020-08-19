import React from "react";
import { NewDailyLogScreen, EditDailyLogScreen } from "./DailyLogs/dailyLogsScreens";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import TripForm, { NewTripScreen, EditTripScreen } from "./Trips/TripForm";
import TripsLayout from "./Trips/TripsLayout";
import TripsList from "./Trips/TripsList";
import TripDetails from "./Trips/TripDetails";
import NetworkStatusProvider, { useNetworkStatus } from "./global/NetworkStatusProvider";
import DailyLogDetails from "./DailyLogs/DailyLogDetails";
import UploadPhotosForm from "./Images/UploadPhotosForm";
import AppBackground from "./global/AppBackground/AppBackground";
import Nav from "./global/Nav/Nav";
import { ScreenModeProvider } from "./hooks/useScreenMode";
function App({}) {
  return (
    <div className="app">
      <NetworkStatusProvider>
        <ScreenModeProvider>
          <Router>
            <Nav />
            <Routes>
              <Route path="*" element={<HomeScreen />} />

              {/* <Route path="/trips" element={<TripsLayout />}>
                <Route path="/" element={<TripsList />} />
                <Route path="new" element={<NewTripScreen />} />
                <Route path=":tripId" element={<TripDetails />} />
                <Route path=":tripId/edit" element={<EditTripScreen />} />
                <Route path=":tripId/dailyLogs" element={<TripDetails />} />
                <Route path=":tripId/dailyLogs/new" element={<NewDailyLogScreen />} />
                <Route path=":tripId/dailyLogs/:logId" element={<DailyLogDetails />} />
                <Route path=":tripId/dailyLogs/:logId/edit" element={<EditDailyLogScreen />} />
              </Route> */}

              <Route path="/dailyLogs" element={<Layout />}>
                <Route path="new" element={<NewDailyLogScreen />} />
                <Route path="/:logId/edit" element={<EditDailyLogScreen />} />
                <Route path="/:logId" element={<DailyLogDetails />} />
              </Route>

              {/* <Route path="/places" element={<Layout />}>
                <Route path="/" element={<PlacesScreen />} />
                <Route path="new" element={<NewPlace />} />
                <Route path=":id" element={<PlaceDetails />} />
                <Route path=":id/edit" element={<EditPlace />} />
              </Route>

              <Route path="/photos" element={<Layout />}>
                <Route path="upload" element={<UploadPhotosForm />} />
              </Route> */}
            </Routes>
          </Router>
        </ScreenModeProvider>
      </NetworkStatusProvider>
    </div>
  );
}

function HomeScreen() {
  return (
    <>
      <AppBackground />

      <div className="home content centered">
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline">Lust less. Remember more.</h3>
      </div>
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
function PlacesLayout() {}

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
