import React from "react";
import { NewDailyLogScreen, EditDailyLogScreen } from "./DailyLogs/dailyLogsScreens";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import NetworkStatusProvider, { useNetworkStatus } from "./global/NetworkStatusProvider";
import DailyLogDetails from "./DailyLogs/DailyLogDetails";
import AppBackground from "./global/AppBackground/AppBackground";
import Nav from "./global/Nav/Nav";
import { ScreenModeProvider } from "./hooks/useScreenMode";
import Footer from "./global/Footer/Footer";
import AddButton from "./global/AddButton/AddButton";
function App({}) {
  return (
    <div className="app">
      <NetworkStatusProvider>
        <ScreenModeProvider>
          <Router>
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
            <Nav />
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
      <Footer>
        <AddButton>
          <Link to="/trip/new">Trip</Link>
          <Link to="/photos/new">Photo</Link>
          <Link to="/dailylogs/new">Daily Log</Link>
        </AddButton>
      </Footer>
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
