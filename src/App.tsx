import { useEffect } from "react";
import {
  DataBrowserRouter,
  Outlet,
  Route,
  ScrollRestoration,
  useNavigate,
} from "react-router-dom";
import { auth } from "~/features/auth/auth.client";
import { LoginLayout } from "~/features/auth/LoginLayout";
import { LoginRoute } from "~/features/auth/LoginRoute";
import { SignupRoute } from "~/features/auth/SignupRoute";
import { AppBackground } from "~/features/layout/AppBackground/AppBackground";

import {
  ScreenModeProvider,
  useScreenMode,
} from "~/features/layout/ScreenModeProvider";

import { HomeRoute } from "~/features/home/HomeRoute";
import UsersRoute, * as UsersRouteModule from "~/features/users/UsersRoute";
import { ReloadPrompt } from "./features/layout/ReloadPrompt/ReloadPrompt";
import "./styles/App.scss";
import "./styles/tailwind.css";

let isLoggedIn = auth.checkIsLoggedIn();
function App({}) {
  return (
    <div className="app w-full h-full overflow-hidden">
      <ReloadPrompt />
      <ScreenModeProvider>
        {isLoggedIn ? <AuthenticatedApp /> : <AnonymousApp />}
      </ScreenModeProvider>
    </div>
  );
}

const AnonymousApp = () => {
  return (
    <DataBrowserRouter>
      <Route element={<Layout />}>
        <Route element={<LoginLayout />}>
          <Route index element={<AnonymousHomeRoute />}></Route>
          <Route element={<LoginRoute />} path="/login" />
          <Route element={<SignupRoute />} path="/signup" />
        </Route>
      </Route>
    </DataBrowserRouter>
  );
};

const AuthenticatedApp = () => {
  return (
    <DataBrowserRouter>
      <Route element={<Layout />}>
        <Route element={<HomeRoute />} index />
        <Route element={<HomeRoute />} path="*" />
        <Route element={<UsersRoute />} path="/users" {...UsersRouteModule} />
      </Route>
    </DataBrowserRouter>
  );
};

const AnonymousHomeRoute = () => {
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
