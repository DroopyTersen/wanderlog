import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div key="loader" className="loader" exit={{ opacity: 0 }}>
      <div className="pulse-loader"></div>
    </motion.div>
  );
}
