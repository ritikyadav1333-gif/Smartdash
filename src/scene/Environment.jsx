import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color } from "three";

function EnergyArc({ radius = 4, y = 0, phase = 0, color = "#ff8a24" }) {
  const points = useMemo(() => {
    const out = [];
    for (let i = 0; i <= 96; i += 1) {
      const a = (i / 96) * Math.PI * 2;
      out.push([Math.cos(a) * radius, y + Math.sin(a * 3 + phase) * 0.07, Math.sin(a) * radius]);
    }
    return out;
  }, [radius, y, phase]);

  return <Line points={points} color={color} lineWidth={1.2} transparent opacity={0.32} />;
}

export default function Environment() {
  const labRef = useRef();
  const streaks = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      x: (Math.random() - 0.5) * 12,
      y: Math.random() * 5.5 + 0.2,
      z: -Math.random() * 11 - 1,
      s: Math.random() * 1.4 + 0.5,
      c: i % 4 === 0 ? "#ffcf78" : "#ff2f17"
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (labRef.current) {
      labRef.current.rotation.y = Math.sin(t * 0.05) * 0.04;
    }
  });

  return (
    <group ref={labRef}>
      <EnergyArc radius={2.55} y={1.1} phase={0} />
      <EnergyArc radius={3.7} y={1.7} phase={1.8} color="#ffbf52" />
      <EnergyArc radius={5.1} y={0.5} phase={3.2} color="#ff3023" />
      {streaks.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} rotation={[0, 0, -0.48]}>
          <planeGeometry args={[0.012 * s.s, 1.1 * s.s]} />
          <meshBasicMaterial
            color={new Color(s.c)}
            transparent
            opacity={0.18}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
