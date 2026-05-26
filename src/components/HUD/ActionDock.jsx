import { motion } from "framer-motion";
import { Crosshair, RadioTower, ScanLine, Sparkles, Zap } from "lucide-react";
import { useJarvisStore } from "../../store/useJarvisStore.js";

const actions = [
  ["overdrive", "OVERDRIVE", Zap],
  ["scan", "SCAN", ScanLine],
  ["lock", "LOCK", Crosshair],
  ["burst", "BURST", Sparkles],
  ["ping", "PING", RadioTower]
];

export default function ActionDock() {
  const activeCommand = useJarvisStore((state) => state.activeCommand);
  const triggerCommand = useJarvisStore((state) => state.triggerCommand);

  return (
    <motion.div
      className="action-dock pointer-events-auto"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 3.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {actions.map(([id, label, Icon], index) => (
        <motion.button
          key={label}
          type="button"
          aria-label={label}
          title={label}
          className={`action-button ${activeCommand === id ? "action-button-active" : ""}`}
          whileHover={{ y: -7, rotateX: 12, scale: 1.08 }}
          whileTap={{ scale: 0.9, rotateZ: index % 2 ? -8 : 8 }}
          onPointerEnter={() => triggerCommand(id)}
          onClick={() => triggerCommand(id)}
        >
          <Icon size={18} strokeWidth={1.8} />
          <span>{label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
