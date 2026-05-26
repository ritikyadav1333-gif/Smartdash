import { motion } from "framer-motion";
import { Activity, Cpu, Crosshair, Gauge, Radio, Zap } from "lucide-react";
import { useJarvisStore } from "../../store/useJarvisStore.js";

const leftRows = [
  ["ARC POWER", "97.4%", Zap],
  ["THERMAL LOAD", "41.8 C", Gauge],
  ["CORE SYNC", "0.003 ms", Cpu],
  ["FIELD STABILITY", "NOMINAL", Activity]
];

const rightRows = [
  ["TARGET LOCK", "12 VECTORS", Crosshair],
  ["NEURAL MAP", "84.2 THz", Activity],
  ["MOTION DELTA", "0.18 rad", Radio],
  ["PREDICTIVE AIM", "ACTIVE", Cpu]
];

export default function DiagnosticsPanel({ side = "left" }) {
  const rows = side === "left" ? leftRows : rightRows;
  const title = side === "left" ? "REACTOR DIAGNOSTICS" : "TACTICAL TELEMETRY";
  const triggerEnergyBurst = useJarvisStore((state) => state.triggerEnergyBurst);

  return (
    <motion.section
      className={`hud-panel pointer-events-auto ${side === "right" ? "hud-panel-right" : ""}`}
      whileHover={{ y: -8, scale: 1.025, rotateY: side === "right" ? -4 : 4 }}
      whileTap={{ scale: 0.975 }}
      onPointerEnter={triggerEnergyBurst}
      onClick={triggerEnergyBurst}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      <div className="panel-corner panel-corner-a" />
      <div className="panel-corner panel-corner-b" />
      <header>
        <span>{title}</span>
        <i />
      </header>
      <div className="space-y-2.5">
        {rows.map(([label, value, Icon], index) => (
          <motion.div
            className="hud-readout"
            key={label}
            animate={{ opacity: [0.78, 1, 0.78] }}
            transition={{ delay: index * 0.18, duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon size={15} strokeWidth={1.7} />
            <span>{label}</span>
            <strong>{value}</strong>
          </motion.div>
        ))}
      </div>
      <div className="metric-bars">
        {rows.map((row, index) => (
          <span key={row[0]} style={{ "--w": `${62 + index * 9}%`, "--d": `${index * 0.12}s` }} />
        ))}
      </div>
    </motion.section>
  );
}
