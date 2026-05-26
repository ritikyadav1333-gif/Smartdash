import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, MeshStandardMaterial } from "three";
import { Line } from "@react-three/drei";
import { useJarvisStore } from "../../store/useJarvisStore.js";

function ArmorPiece({ children, position, scale = 1, rotation = [0, 0, 0], material, name }) {
  return (
    <mesh name={name} position={position} scale={scale} rotation={rotation} material={material}>
      {children}
    </mesh>
  );
}

function ComicTrace({ side = 1, y = 0, radius = 1.5, color = "#ff8a24" }) {
  const points = useMemo(() => {
    return Array.from({ length: 78 }, (_, i) => {
      const a = (i / 77) * Math.PI * 1.25 + side * 0.45;
      return [Math.cos(a) * radius * side, y + Math.sin(i * 0.28) * 0.08, -4.7 + Math.sin(a) * 0.45];
    });
  }, [radius, side, y]);

  return <Line points={points} color={color} lineWidth={1.1} transparent opacity={0.42} />;
}

export default function ArmoredBackdrop() {
  const root = useRef();
  const halo = useRef();
  const burst = useJarvisStore((state) => state.energyBurst);

  const materials = useMemo(() => {
    const red = new MeshStandardMaterial({
      color: new Color("#9b100b"),
      metalness: 0.82,
      roughness: 0.28,
      emissive: new Color("#4a0704"),
      emissiveIntensity: 0.5
    });
    const gold = new MeshStandardMaterial({
      color: new Color("#d0a653"),
      metalness: 0.9,
      roughness: 0.22,
      emissive: new Color("#5a3909"),
      emissiveIntensity: 0.46
    });
    const black = new MeshStandardMaterial({
      color: new Color("#070707"),
      metalness: 0.68,
      roughness: 0.35,
      emissive: new Color("#100706"),
      emissiveIntensity: 0.18
    });
    return { red, gold, black };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.18) * 0.055;
      root.current.position.y = -0.06 + Math.sin(t * 0.58) * 0.045;
      root.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.01 + burst * 0.012);
    }
    if (halo.current) {
      halo.current.rotation.z = t * 0.12;
      halo.current.material.opacity = 0.16 + Math.sin(t * 1.4) * 0.04 + burst * 0.035;
      halo.current.scale.setScalar(1.05 + Math.sin(t * 0.9) * 0.04 + burst * 0.08);
    }
  });

  return (
    <group ref={root} position={[0, -0.2, -2.55]} scale={2.05}>
      <mesh ref={halo} position={[0, 1.75, -0.18]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.82, 0.01, 10, 220]} />
        <meshBasicMaterial color="#ffefbc" transparent opacity={0.18} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <ComicTrace side={-1} y={2.08} radius={2.7} color="#ff4b28" />
      <ComicTrace side={1} y={1.65} radius={2.9} color="#ffc45a" />
      <ComicTrace side={1} y={0.78} radius={3.5} color="#34dfff" />

      <mesh position={[0, 1.25, -0.09]} scale={[2.8, 1.9, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ff3524"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <ArmorPiece position={[0, 1.85, 0]} scale={[0.46, 0.58, 0.36]} material={materials.gold}>
        <sphereGeometry args={[1, 48, 32]} />
      </ArmorPiece>
      <ArmorPiece position={[0, 2.12, 0.05]} scale={[0.62, 0.22, 0.38]} material={materials.red}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      <ArmorPiece position={[-0.24, 1.86, 0.35]} scale={[0.22, 0.045, 0.03]} rotation={[0, 0, -0.08]} material={materials.black}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      <ArmorPiece position={[0.24, 1.86, 0.35]} scale={[0.22, 0.045, 0.03]} rotation={[0, 0, 0.08]} material={materials.black}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 1.865, 0.39]} scale={[0.2, 0.027, 0.014]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#bff4ff" transparent opacity={0.98} blending={AdditiveBlending} />
          <pointLight color="#66e7ff" intensity={0.8} distance={2.2} />
        </mesh>
      ))}
      <ArmorPiece position={[0, 1.55, 0.34]} scale={[0.42, 0.09, 0.045]} material={materials.red}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>

      <ArmorPiece position={[0, 0.84, 0]} scale={[0.98, 0.82, 0.34]} material={materials.red}>
        <capsuleGeometry args={[0.72, 0.72, 10, 34]} />
      </ArmorPiece>
      <ArmorPiece position={[0, 1.09, 0.19]} scale={[0.58, 0.22, 0.08]} material={materials.gold}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      <ArmorPiece position={[-0.86, 0.98, 0.03]} scale={[0.72, 0.42, 0.28]} rotation={[0, 0, 0.28]} material={materials.red}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      <ArmorPiece position={[0.86, 0.98, 0.03]} scale={[0.72, 0.42, 0.28]} rotation={[0, 0, -0.28]} material={materials.red}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      <ArmorPiece position={[-1.3, 0.6, -0.02]} scale={[0.88, 0.32, 0.24]} rotation={[0, 0, 0.2]} material={materials.gold}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>
      <ArmorPiece position={[1.3, 0.6, -0.02]} scale={[0.88, 0.32, 0.24]} rotation={[0, 0, -0.2]} material={materials.gold}>
        <boxGeometry args={[1, 1, 1]} />
      </ArmorPiece>

      <mesh position={[0, 0.98, 0.42]}>
        <torusGeometry args={[0.19, 0.024, 16, 96]} />
        <meshBasicMaterial color="#f6fbff" transparent opacity={0.95} blending={AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.98, 0.43]}>
        <circleGeometry args={[0.14, 64]} />
        <meshBasicMaterial color="#dffbff" transparent opacity={0.86} blending={AdditiveBlending} depthWrite={false} />
        <pointLight color="#bff8ff" intensity={2.8} distance={5.5} />
      </mesh>

      <group position={[-1.38, 0.66, 0.1]} rotation={[0.15, 0, 0.58]}>
        <ArmorPiece position={[0, 0, 0]} scale={[0.22, 0.96, 0.19]} material={materials.red}>
          <capsuleGeometry args={[0.28, 1.1, 8, 20]} />
        </ArmorPiece>
        <mesh position={[-0.34, 0.78, 0.42]} rotation={[0.08, 0.1, -0.7]}>
          <circleGeometry args={[0.25, 64]} />
          <meshBasicMaterial color="#f6fbff" transparent opacity={0.9} blending={AdditiveBlending} depthWrite={false} />
          <pointLight color="#dff7ff" intensity={2.2} distance={5} />
        </mesh>
        {[-0.56, -0.38, -0.2, -0.02, 0.16].map((x, i) => (
          <ArmorPiece key={x} position={[x, 0.95 + i * 0.025, 0.42]} scale={[0.055, 0.32, 0.045]} rotation={[0, 0, -0.18 + i * 0.08]} material={materials.red}>
            <capsuleGeometry args={[0.5, 0.52, 6, 10]} />
          </ArmorPiece>
        ))}
      </group>
    </group>
  );
}
