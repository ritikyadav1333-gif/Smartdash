import { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { motion } from "framer-motion";
import { Leva } from "leva";
import Experience from "./scene/Experience.jsx";
import LaunchDashboard from "./components/HUD/LaunchDashboard.jsx";
import CampusFeatures from "./components/HUD/CampusFeatures.jsx";
import { createIntroTimeline } from "./animations/introTimeline.js";
import { useJarvisStore } from "./store/useJarvisStore.js";

export default function App() {
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const { bootComplete, setBootComplete } = useJarvisStore();

  useLayoutEffect(() => {
    const timeline = createIntroTimeline({
      overlay: overlayRef.current,
      title: titleRef.current,
      onComplete: () => setBootComplete(true)
    });

    return () => timeline.kill();
  }, [setBootComplete]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#030405] text-amber-50">
      <div className="absolute inset-0">
        <Canvas
          shadows={false}
          dpr={[1.35, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 1.15, 7.2], fov: 42, near: 0.1, far: 90 }}
        >
          <color attach="background" args={["#030405"]} />
          <fog attach="fog" args={["#060504", 7, 26]} />
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>
      <div ref={overlayRef} className="hud-overlay pointer-events-none absolute inset-0 opacity-0">
        <div className="absolute inset-0 hud-vignette" />
        <div className="absolute inset-0 hud-scanlines" />
        <div className="absolute inset-x-0 top-4 flex justify-center px-4 sm:top-6">
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="jarvis-title pointer-events-auto"
          >
            <span>J.A.R.V.I.S</span>
            <small>{bootComplete ? "ONLINE" : "BOOT SEQUENCE"}</small>
          </motion.div>
        </div>

        <CampusFeatures />

        <div className="absolute inset-x-0 bottom-[8vh] flex justify-center px-4">
          <LaunchDashboard />
        </div>
      </div>

      <Loader
        containerStyles={{ background: "#030405" }}
        innerStyles={{ backgroundColor: "#ff9e2d" }}
        barStyles={{ backgroundColor: "#ffcf78" }}
        dataStyles={{ color: "#ffd08a", fontFamily: "Share Tech Mono" }}
      />
      <Leva hidden collapsed />
    </main>
  );
}
