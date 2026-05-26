import { motion } from "framer-motion";
import { useJarvisStore } from "../../store/useJarvisStore.js";

export default function Waveform() {
  const bars = Array.from({ length: 74 }, (_, i) => i);
  const logs = ["BOOTSTRAP COMPLETE", "HOLOGRAPHIC MATRIX STABLE", "NEURAL ROUTING ONLINE", "TACTICAL HUD ARMED"];
  const triggerEnergyBurst = useJarvisStore((state) => state.triggerEnergyBurst);

  return (
    <motion.section
      className="waveform-shell pointer-events-auto mx-auto max-w-5xl"
      whileHover={{ y: -5, scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      onPointerEnter={triggerEnergyBurst}
      onClick={triggerEnergyBurst}
    >
      <div className="waveform">
        {bars.map((bar) => (
          <motion.span
            key={bar}
            animate={{ height: [`${18 + (bar % 9) * 4}%`, `${45 + ((bar * 7) % 12) * 4}%`, `${20 + (bar % 11) * 3}%`] }}
            transition={{ duration: 1.15 + (bar % 8) * 0.08, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="system-log">
        {logs.map((log) => (
          <span key={log}>{log}</span>
        ))}
      </div>
    </motion.section>
  );
}
