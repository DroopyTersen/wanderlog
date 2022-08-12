import { motion } from "framer-motion";
import { HiOutlineFingerPrint, HiPlus } from "react-icons/hi";
import { Button, LinkButton } from "~/components/inputs/buttons";
import { DropdownMenu } from "../../components/surfaces/DropdownMenu";
import { auth } from "../auth/auth.client";
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
      <div className="fab-container">
        {currentUser ? (
          <DropdownMenu
            label={
              <Button title="Team actions menu" variants={["primary"]}>
                <HiPlus size={18} />
                <span>New</span>
              </Button>
            }
          >
            <DropdownMenu.Item className="min-w-[200px]" to="/trips/new">
              New Trip
            </DropdownMenu.Item>
          </DropdownMenu>
        ) : (
          <LinkButton to="/login" variants={["primary"]}>
            <HiOutlineFingerPrint size={17}></HiOutlineFingerPrint>
            Sign In
          </LinkButton>
        )}
      </div>
    </>
  );
}
