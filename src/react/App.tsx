import React, { useEffect, useState } from "react";
import { NewDailyLogScreen, EditDailyLogScreen } from "./DailyLogs/dailyLogsScreens";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import NetworkStatusProvider, { useNetworkStatus } from "./global/NetworkStatusProvider";
import DailyLogDetails from "./DailyLogs/DailyLogDetails";
import AppBackground from "./global/AppBackground/AppBackground";
import Nav from "./global/Nav/Nav";
import { ScreenModeProvider } from "./hooks/useScreenMode";
import Footer from "./global/Footer/Footer";
import AddButton from "./global/AddButton/AddButton";
import { OvermindProvider, useOvermind, useOvermindState, useActions } from "../overmind";
import DailyLogsList from "./DailyLogs/DailyLogsList";
import { action } from "overmind";
import Card from "./components/surfaces/Card";
function App({}) {
  return (
    <div className="app">
      <OvermindProvider>
        <NetworkStatusProvider>
          <ScreenModeProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ScreenModeProvider>
        </NetworkStatusProvider>
      </OvermindProvider>
    </div>
  );
}

function AppRoutes() {
  let { auth } = useOvermindState();
  let navigate = useNavigate();
  useEffect(() => {
    console.log("EFFECT", auth);
    if (!auth.isLoggedIn && auth.status === "idle") {
      navigate("/login");
    }
  }, [auth.isLoggedIn, auth.status]);
  console.log("AppRoutes -> auth", auth);

  if (!auth.isLoggedIn && auth.status === "pending") {
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

  return (
    <>
      <Routes>
        <Route path="*" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dailyLogs" element={<Layout />}>
          <Route path="/" element={<DailyLogsList />} />
          <Route path="new" element={<NewDailyLogScreen />} />
          <Route path="/:logId/edit" element={<EditDailyLogScreen />} />
          <Route path="/:logId" element={<DailyLogDetails />} />
        </Route>

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
      {auth.isLoggedIn && <Nav />}
    </>
  );
}

function LoginScreen() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let actions = useActions();
  const onSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      actions.auth.login({ email, password });
    }
  };
  return (
    <>
      <AppBackground />
      <div className="home content centered login">
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline">Lust less. Remember more.</h3>
        <Card>
          <form
            className="login-form"
            autoComplete="new-password"
            aria-autocomplete="none"
            onSubmit={onSubmit}
          >
            <label htmlFor="email">
              Email
              <input
                name="email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="gold" disabled={!email || !password}>
              Login
            </button>
          </form>
        </Card>
      </div>
    </>
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

export default App;
