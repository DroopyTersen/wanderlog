import { motion } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useIsOnline } from "~/common/isOnline";
import { LoadingSpinner } from "~/components/loaders/LoadingSpinner";
import { Overlay } from "~/components/surfaces/Overlay";
import "../home/home.scss";
import { Footer } from "../layout/Footer/Footer";
export function LoginLayout() {
  let [searchParams] = useSearchParams();
  let error = searchParams?.get("error");
  let [isSubmitting, setIsSubmitting] = useState(false);
  let { pathname } = useLocation();
  let isOnline = useIsOnline();
  let title = pathname === "/login" ? "Log in" : "Sign up";
  if (!isOnline) {
    error = `You are offline. Please connect to the internet to ${title.toLowerCase()}.`;
  }
  return (
    <>
      <motion.div
        className="home content centered"
        initial={{ opacity: 0, scale: 0.95, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1
          className={`app-title ${pathname !== "/" ? "hidden sm:block" : ""}`}
        >
          Wanderlog
        </h1>
        <h3
          className={`tagline text-neutral-200 font-medium ${
            pathname !== "/" ? "hidden sm:block" : ""
          }`}
        >
          Lust less. Remember more.
        </h3>
        {pathname !== "/" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={
              "fixed inset-0 sm:relative grid top-0 mt-8 sm:mt-20 w-full h-full sm:place-items-center center "
            }
          >
            <div className="p-8 relative bg-primary-700/70 backdrop-blur-md sm:backdrop-blur-sm shadow-lg rounded-xl w-[100vw] sm:w-[400px] max-w-full">
              <Link
                to="/"
                role="button"
                className="absolute block top-0 right-8 sm:top-4 sm:right-4 z-10 lg:hidden"
                style={{ position: "absolute" }}
              >
                <IoMdClose />
              </Link>
              <h1 className="text-5xl sm:text-4xl text-center mb-8">{title}</h1>
              {error && (
                <div className="mb-8 bg-red-700/60 text-red-50 font-medium p-3 text-center rounded-lg">
                  {error}
                </div>
              )}
              <form
                method="post"
                action="/api/login"
                className="flex flex-col gap-6"
                onSubmit={(e) => setIsSubmitting(true)}
              >
                <Outlet />
                {isSubmitting && (
                  <Overlay
                    className="bg-primary-700 rounded-md -m-4"
                    opacity={0.6}
                  >
                    <LoadingSpinner />
                  </Overlay>
                )}
              </form>
            </div>
          </motion.div>
        ) : (
          <Outlet />
        )}
      </motion.div>
      <Footer>
        {pathname === "/" && (
          <motion.div
            className=""
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/login" className="btn btn-sm btn-primary btn-outline">
              Login
            </Link>
          </motion.div>
        )}
      </Footer>
    </>
  );
}
