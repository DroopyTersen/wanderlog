import { Suspense } from "react";
import { AppBackground } from "./features/global/AppBackground/AppBackground";
import { ScreenModeProvider } from "./features/global/ScreenModeProvider";
import {
  DataBrowserRouter,
  Outlet,
  PathRouteProps,
  Route,
  Routes,
  ScrollRestoration,
} from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/App.scss";
import { LoginRoute } from "./features/auth/LoginRoute";
import { HomeRoute } from "./features/home/HomeRoute";
import { SignupRoute } from "./features/auth/SignupRoute";
function App({}) {
  return (
    <div className="app w-full h-full overflow-hidden">
      <ScreenModeProvider>
        <DataBrowserRouter>
          <Route element={<Layout />}>
            <Route element={<HomeRoute />} path="/" />
            <Route element={<LoginRoute />} path="/login" />
            <Route element={<SignupRoute />} path="/signup" />
          </Route>
        </DataBrowserRouter>
      </ScreenModeProvider>
    </div>
  );
}

const Layout = () => {
  return (
    <>
      <AppBackground variant="sharp" />
      <Outlet />
      <ScrollRestoration />
    </>
  );
};
export default App;
