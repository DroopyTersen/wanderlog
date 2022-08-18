import { useEffect } from "react";
import {
  DataBrowserRouter,
  Outlet,
  Route,
  ScrollRestoration,
  useLocation,
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

import HomeRoute, * as HomeRouteModule from "~/features/home/HomeRoute";
import PhotosRoute, * as PhotosRouteModule from "~/features/photos/routes/photos.route";
import TripDateLayout, * as TripDateLayoutModule from "~/features/trips/routes/$tripId/$date/$date.layout";
import TripLayout, * as TripLayoutRouteModule from "~/features/trips/routes/$tripId/$tripId.layout";
import TripDaysRoute, * as TripDaysRouteModule from "~/features/trips/routes/$tripId/days.route";
import NewTripRoute, * as NewTripRouteModule from "~/features/trips/routes/new.route";
import TripsRoute, * as TripsRouteModule from "~/features/trips/routes/trips.route";
import UsersRoute, * as UsersRouteModule from "~/features/users/UsersRoute";
import { AppErrorBoundary } from "./features/layout/AppErrorBoundary/AppErrorBoundary";
import { GlobalNav } from "./features/layout/GlobalNav/GlobalNav";
import { ReloadPrompt } from "./features/layout/ReloadPrompt/ReloadPrompt";
import DayMemoriesLayout, * as DayMemoriesLayoutModule from "./features/trips/routes/$tripId/$date/memories.layout";
import MemoryFormRoute, * as MemoryFormRouteModule from "./features/trips/routes/$tripId/$date/memories.modalForm.route";
import DayPhotosLayout from "./features/trips/routes/$tripId/$date/photos.layout";
import DayPlacesLayout from "./features/trips/routes/$tripId/$date/places.layout";
import EditTripRoute, * as EditTripRouteModule from "./features/trips/routes/$tripId/edit.route";
import TripPhotosRoute from "./features/trips/routes/$tripId/photos.route";
import TripPlacesRoute from "./features/trips/routes/$tripId/places.route";
import { tripService } from "./features/trips/trip.service";
import { userService } from "./features/users/user.service";
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
      <Route
        element={<Layout isLoggedIn={true} />}
        loader={globalLoader}
        errorElement={<AppErrorBoundary />}
      >
        <Route element={<HomeRoute />} index {...HomeRouteModule} />
        <Route element={<HomeRoute />} path="*" />
        <Route
          path="/photos"
          element={<PhotosRoute />}
          {...PhotosRouteModule}
        />
        <Route path="/trips">
          <Route index element={<TripsRoute />} {...TripsRouteModule} />
          <Route
            path={":tripId"}
            element={<TripLayout />}
            {...TripLayoutRouteModule}
          >
            <Route index element={<TripDaysRoute />} {...TripDaysRouteModule} />
            <Route
              path="days"
              element={<TripDaysRoute />}
              {...TripDaysRouteModule}
            />
            <Route
              path="photos"
              element={<TripPhotosRoute />}
              {...TripDaysRouteModule}
            />
            <Route
              path="places"
              element={<TripPlacesRoute />}
              {...TripDaysRouteModule}
            />
            <Route
              path="memories/new"
              element={<MemoryFormRoute />}
              {...MemoryFormRouteModule}
            />
          </Route>
        </Route>
        <Route
          path="/trips/:tripId/edit"
          element={<EditTripRoute />}
          {...EditTripRouteModule}
        />
        <Route
          path="/trips/:tripId/:date"
          element={<TripDateLayout />}
          {...TripDateLayoutModule}
        >
          <Route
            index
            element={<DayMemoriesLayout />}
            {...DayMemoriesLayoutModule}
          />
          <Route path="memories">
            <Route
              index
              element={<DayMemoriesLayout />}
              {...DayMemoriesLayoutModule}
            ></Route>
            <Route
              path="new"
              element={<MemoryFormRoute />}
              {...MemoryFormRouteModule}
            />
            <Route
              path=":memoryId/edit"
              element={<MemoryFormRoute />}
              {...MemoryFormRouteModule}
            />
          </Route>
          <Route path="photos" element={<DayPhotosLayout />}></Route>
          <Route path="places" element={<DayPlacesLayout />}></Route>
        </Route>
        <Route
          element={<NewTripRoute />}
          path="/trips/new"
          {...NewTripRouteModule}
        />
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

const Layout = ({ isLoggedIn = false }) => {
  let { pathname } = useLocation();

  useEffect(() => {
    //scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <AppBackground variant="sharp" />
      <GlobalNav>
        <Outlet />
      </GlobalNav>
      <ScrollRestoration />
    </>
  );
};

export const globalLoader = async () => {
  if (auth.checkIsLoggedIn()) {
    let allUsers = await userService.getAll();
    let allTrips = await tripService.getAll();
    return {
      allUsers,
      allTrips,
    };
  }
  return {};
};

export default App;
