import { Grid } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function ScanGrid() {
  const pulse = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pulse.current) {
      pulse.current.scale.setScalar(1 + (t * 0.18) % 1.6);
      pulse.current.material.opacity = 0.22 * (1 - ((t * 0.18) % 1.6) / 1.6);
    }
  });

  return (
    <group position={[0, -1.17, 0]}>
      <Grid
        args={[16, 16]}
        cellSize={0.42}
        cellThickness={0.45}
        cellColor="#ff8b22"
        sectionSize={2.1}
        sectionThickness={1.1}
        sectionColor="#35d7ff"
        fadeDistance={12}
        fadeStrength={2.4}
        infiniteGrid
      />
      <mesh ref={pulse} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.6, 0.62, 160]} />
        <meshBasicMaterial color="#ff9c2c" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}
