import { motion } from "framer-motion";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { LinkButton } from "~/components/inputs/buttons";
import { auth } from "../auth/auth.client";
import { NewMenu } from "../layout/NewMenu/NewMenu";
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
      {currentUser ? (
        <NewMenu />
      ) : (
        <div className="fab-container">
          <LinkButton to="/login" variants={["primary"]}>
            <HiOutlineFingerPrint size={17}></HiOutlineFingerPrint>
            Sign In
          </LinkButton>
        </div>
      )}
    </>
  );
}
