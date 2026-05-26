import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useJarvisStore } from "../../store/useJarvisStore.js";
import { useRepulsorSound } from "../../hooks/useRepulsorSound.js";

const DASHBOARD_URL = "https://campus-os-web-red.vercel.app/dashboard";

export default function LaunchDashboard() {
  const [launching, setLaunching] = useState(false);
  const triggerCommand = useJarvisStore((state) => state.triggerCommand);
  const playRepulsorSound = useRepulsorSound();

  const launch = () => {
    if (launching) return;
    setLaunching(true);
    triggerCommand("launch");
    playRepulsorSound();
    window.setTimeout(() => {
      window.location.href = DASHBOARD_URL;
    }, 3200);
  };

  return (
    <>
      <motion.button
        type="button"
        className={`launch-dashboard pointer-events-auto ${launching ? "launch-dashboard-active" : ""}`}
        onClick={launch}
        disabled={launching}
        initial={{ opacity: 0, y: 28, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 3.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        whileHover={launching ? undefined : { y: -8, scale: 1.04 }}
        whileTap={launching ? undefined : { scale: 0.96 }}
      >
        <Rocket size={22} strokeWidth={1.8} />
        <span>{launching ? "LAUNCHING" : "LAUNCH DASHBOARD"}</span>
      </motion.button>

      {launching && (
        <div className="launch-sequence pointer-events-none">
          <div className="launch-beam launch-beam-a" />
          <div className="launch-beam launch-beam-b" />
          <div className="launch-core" />
          <div className="launch-ring launch-ring-a" />
          <div className="launch-ring launch-ring-b" />
          <div className="launch-grid" />
          <div className="launch-status">CAMPUS OS LINK ESTABLISHED</div>
          <div className="launch-whiteout" />
        </div>
      )}
    </>
  );
}
