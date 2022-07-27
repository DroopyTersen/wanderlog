import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  DataBrowserRouter,
  Link,
  Outlet,
  Route,
  ScrollRestoration,
  useNavigate,
} from "react-router-dom";
import { auth } from "./features/auth/auth.client";
import { LoginLayout } from "./features/auth/LoginLayout";
import { LoginRoute } from "./features/auth/LoginRoute";
import { SignupRoute } from "./features/auth/SignupRoute";
import { AppBackground } from "./features/global/AppBackground/AppBackground";
import {
  ScreenModeProvider,
  useScreenMode,
} from "./features/global/ScreenModeProvider";
import "./styles/App.scss";
import "./styles/tailwind.css";

let isLoggedIn = auth.checkIsLoggedIn();
function App({}) {
  return (
    <div className="app w-full h-full overflow-hidden">
      <ScreenModeProvider>
        <DataBrowserRouter>
          {!isLoggedIn && (
            <Route element={<Layout />}>
              <Route element={<LoginLayout />}>
                <Route index element={<AnonymousHomeRoute />}></Route>
                <Route element={<LoginRoute />} path="/login" />
                <Route element={<SignupRoute />} path="/signup" />
              </Route>
            </Route>
          )}
        </DataBrowserRouter>
      </ScreenModeProvider>
    </div>
  );
}

const AnonymousHomeRoute = () => {
  console.log("HERE I AM");
  let screenMode = useScreenMode();
  let navigate = useNavigate();
  useEffect(() => {
    if (screenMode.size === "large") {
      navigate("/login");
    }
  }, [screenMode]);
  return null;
};

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
