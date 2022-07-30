import { motion } from "framer-motion";

export function Grid({ width = "250px", gap = "10px", children, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${width}, 100%), 1fr)`,
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  );
}
const gridVariants = {
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVarients = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -25 },
};

export function MotionGrid({
  width = "250px",
  gap = "10px",
  children,
  ...rest
}) {
  return (
    // <AnimatePresence>
    <motion.div
      {...rest}
      style={{
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${width}, 100%), 1fr)`,
        maxWidth: "100%",
      }}
      initial="hidden"
      animate="visible"
      variants={gridVariants}
    >
      {children}
    </motion.div>
    // </AnimatePresence>
  );
}
function MotionGridItem({ children, ...rest }) {
  return (
    <motion.div variants={itemVarients} {...rest}>
      {children}
    </motion.div>
  );
}
MotionGrid.Item = MotionGridItem;
