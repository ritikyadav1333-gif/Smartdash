import { motion } from "framer-motion";

export default function SystemStatus() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[48%] flex justify-center">
      <motion.div
        className="system-online"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.65, 1, 0.76] }}
        transition={{ delay: 3.4, duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        J.A.R.V.I.S ONLINE
      </motion.div>
    </div>
  );
}
