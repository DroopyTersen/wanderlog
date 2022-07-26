import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { auth } from "../auth/auth.client";
import { Footer } from "../global/Footer/Footer";
import "./home.scss";

let currentUser = auth.getCurrentUser();
export function HomeRoute() {
  return (
    <>
      <motion.div
        className="home content centered"
        initial={{ opacity: 0, scale: 0.95, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline text-neutral-200 font-medium">
          Lust less. Remember more.
        </h3>
      </motion.div>
      <Footer>
        {currentUser ? (
          <div>
            <div>Hello, {currentUser.username}</div>
            <button className="gold" onClick={() => auth.logout()}>
              Logout
            </button>
          </div>
        ) : (
          <Link role="button" to="/login" className="gold">
            Login
          </Link>
        )}
      </Footer>
    </>
  );
}
