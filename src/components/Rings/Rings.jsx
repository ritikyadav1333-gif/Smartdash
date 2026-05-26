import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide } from "three";
import { Text } from "@react-three/drei";
import { useJarvisStore } from "../../store/useJarvisStore.js";

function Ring({ radius, tube, color, rotation, speed, opacity = 0.55 }) {
  const ref = useRef();
  const burst = useJarvisStore((state) => state.energyBurst);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.x = rotation[0] + Math.sin(t * 0.35 + radius) * 0.05;
      ref.current.rotation.y = rotation[1] + t * speed * (1 + burst * 5.5);
      ref.current.rotation.z = rotation[2] + t * speed * 0.7 * (1 + burst * 4);
      ref.current.position.y = Math.sin(t * 0.75 + radius) * 0.04;
      ref.current.scale.setScalar(1 + burst * 0.11 + Math.sin(t * 2.5 + radius) * 0.006);
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 8, 192]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function SegmentedDisc() {
  const ref = useRef();
  const segments = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        a: (i / 36) * Math.PI * 2,
        len: i % 4 === 0 ? 0.42 : 0.24,
        color: i % 7 === 0 ? "#ffcf78" : "#ff3a1e"
      })),
    []
  );

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * -0.21;
  });

  return (
    <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      {segments.map((s, i) => (
        <mesh key={i} position={[Math.cos(s.a) * 1.75, Math.sin(s.a) * 1.75, 0]} rotation={[0, 0, s.a]}>
          <planeGeometry args={[s.len, 0.018]} />
          <meshBasicMaterial color={s.color} side={DoubleSide} transparent opacity={0.72} blending={AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

export default function Rings() {
  const orbiters = useMemo(
    () => [
      { a: 0, y: 1.22, label: "BIO-SCAN" },
      { a: 2.1, y: 0.34, label: "ARC FLUX" },
      { a: 4.1, y: 1.78, label: "TRACKING" }
    ],
    []
  );

  return (
    <group>
      <Ring radius={1.25} tube={0.006} color="#ffb13b" rotation={[Math.PI / 2, 0, 0]} speed={0.34} opacity={0.65} />
      <Ring radius={1.78} tube={0.008} color="#ff4a25" rotation={[1.15, 0.4, 0.1]} speed={-0.22} opacity={0.38} />
      <Ring radius={2.22} tube={0.005} color="#b81208" rotation={[1.7, -0.8, 0.35]} speed={0.18} opacity={0.36} />
      <Ring radius={2.72} tube={0.004} color="#ffd17a" rotation={[Math.PI / 2, 0, 0]} speed={-0.12} opacity={0.26} />
      <SegmentedDisc />
      {orbiters.map((item, i) => (
        <Text
          key={item.label}
          position={[Math.cos(item.a) * 2.45, item.y, Math.sin(item.a) * 2.45]}
          rotation={[0, -item.a + Math.PI / 2, 0]}
          fontSize={0.075}
          color={i === 1 ? "#ffb84d" : "#ffcf78"}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.8}
        >
          {item.label}
        </Text>
      ))}
    </group>
  );
}
