import { motion } from "framer-motion";
import { BookOpenCheck, CalendarClock, ClipboardCheck, CreditCard, GraduationCap, UsersRound } from "lucide-react";

const leftFeatures = [
  ["Student Profiles", "Unified records, guardians, documents", UsersRound],
  ["Smart Attendance", "Live class presence and daily insights", ClipboardCheck],
  ["Timetable Engine", "Schedules, substitutions, room planning", CalendarClock]
];

const rightFeatures = [
  ["Fee Command", "Payments, dues, invoices, reminders", CreditCard],
  ["Academics", "Assignments, marks, progress tracking", BookOpenCheck],
  ["Campus Analytics", "Actionable reports for every role", GraduationCap]
];

function FeatureOrb({ index }) {
  return (
    <span className={`feature-orb feature-orb-${index % 3}`}>
      <i />
    </span>
  );
}

function FeatureColumn({ side, features }) {
  return (
    <motion.div
      className={`campus-feature-column campus-feature-column-${side}`}
      initial={{ opacity: 0, x: side === "left" ? -42 : 42, filter: "blur(12px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay: 2.85, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {features.map(([title, detail, Icon], index) => (
        <motion.article
          key={title}
          className="campus-feature-card pointer-events-auto"
          whileHover={{
            y: -8,
            rotateY: side === "left" ? 8 : -8,
            scale: 1.035
          }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          style={{ "--delay": `${index * 0.22}s` }}
        >
          <FeatureOrb index={index} />
          <div className="feature-icon">
            <Icon size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h3>{title}</h3>
            <p>{detail}</p>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

export default function CampusFeatures() {
  return (
    <>
      <FeatureColumn side="left" features={leftFeatures} />
      <FeatureColumn side="right" features={rightFeatures} />
    </>
  );
}
