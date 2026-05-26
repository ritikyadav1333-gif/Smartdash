import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, MeshStandardMaterial } from "three";
import { Line, RoundedBox } from "@react-three/drei";
import { HologramMaterial } from "./HologramMaterial.js";
import { useJarvisStore } from "../../store/useJarvisStore.js";

extend({ HologramMaterial });

function ArmorMesh({ children, material, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} material={material}>
      {children}
    </mesh>
  );
}

function SmoothPlate({ args = [1, 1, 1], material, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], radius = 0.055 }) {
  return <RoundedBox args={args} radius={radius} smoothness={5} position={position} scale={scale} rotation={rotation} material={material} />;
}

function GlowDisc({ position, scale = 1, color = "#fff2c2", intensity = 1.4 }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <circleGeometry args={[0.18, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.78} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.24, 0.012, 12, 96]} />
        <meshBasicMaterial color="#ffbf52" transparent opacity={0.58} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight color={color} intensity={intensity} distance={4.8} />
    </group>
  );
}

function CommandEffects({ activeCommand, commandTick, energyBurst }) {
  const groupRef = useRef();
  const scanRef = useRef();
  const shockRef = useRef();
  const pingRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.18;
    if (scanRef.current) {
      scanRef.current.position.y = -1.2 + ((t * 1.2 + commandTick * 0.31) % 3.45);
      scanRef.current.material.opacity = activeCommand === "scan" ? 0.48 : 0;
    }
    if (shockRef.current) {
      const scale = activeCommand === "burst" ? 1.2 + ((t * 2.5) % 1.5) : 0.25 + energyBurst * 0.5;
      shockRef.current.scale.setScalar(scale);
      shockRef.current.material.opacity = activeCommand === "burst" ? Math.max(0, 0.38 - (scale - 1.2) * 0.22) : 0;
    }
    if (pingRef.current) {
      const scale = activeCommand === "ping" ? 0.65 + ((t * 1.7) % 1.9) : 0.5;
      pingRef.current.scale.setScalar(scale);
      pingRef.current.material.opacity = activeCommand === "ping" ? Math.max(0, 0.34 - (scale - 0.65) * 0.12) : 0;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={scanRef} position={[0, 0.2, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 1.32, 160]} />
        <meshBasicMaterial color="#ffb43d" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={shockRef} position={[0, 0.96, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.45, 192]} />
        <meshBasicMaterial color="#ff2b16" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={pingRef} position={[0, 0.94, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.36, 192]} />
        <meshBasicMaterial color="#ffd36f" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      {activeCommand === "lock" && (
        <>
          <Line points={[[-0.86, 1.9, 0.72], [-0.38, 1.9, 0.72]]} color="#ffbf52" lineWidth={2.2} transparent opacity={0.9} />
          <Line points={[[0.38, 1.9, 0.72], [0.86, 1.9, 0.72]]} color="#ffbf52" lineWidth={2.2} transparent opacity={0.9} />
          <Line points={[[0, 0.26, 0.74], [0, 0.76, 0.74]]} color="#ff2f17" lineWidth={1.8} transparent opacity={0.85} />
          <Line points={[[0, 1.24, 0.74], [0, 1.72, 0.74]]} color="#ff2f17" lineWidth={1.8} transparent opacity={0.85} />
        </>
      )}
      {activeCommand === "overdrive" && (
        <>
          <mesh position={[0, 0.52, 0.58]} scale={[0.55, 1.18, 0.08]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="#ff220f" transparent opacity={0.22 + energyBurst * 0.18} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <pointLight color="#ff2a12" position={[0, 0.84, 0.72]} intensity={2.2 + energyBurst * 4} distance={4.4} />
        </>
      )}
    </group>
  );
}

function ArmorSeams() {
  const seamLines = useMemo(
    () => [
      [
        [-0.48, 1.08, 0.44],
        [-0.17, 0.82, 0.5],
        [0, 0.63, 0.48],
        [0.17, 0.82, 0.5],
        [0.48, 1.08, 0.44]
      ],
      [
        [-0.32, 1.8, 0.43],
        [-0.14, 1.62, 0.5],
        [0, 1.55, 0.51],
        [0.14, 1.62, 0.5],
        [0.32, 1.8, 0.43]
      ],
      [
        [-0.28, 0.42, 0.42],
        [-0.08, 0.2, 0.47],
        [0.08, 0.2, 0.47],
        [0.28, 0.42, 0.42]
      ]
    ],
    []
  );

  return (
    <>
      {seamLines.map((points, index) => (
        <Line key={index} points={points} color={index === 1 ? "#ff3b1c" : "#ffcc72"} lineWidth={1.2} transparent opacity={0.62} />
      ))}
    </>
  );
}

export default function Humanoid() {
  const root = useRef();
  const chestCore = useRef();
  const repulsor = useRef();
  const triggerEnergyBurst = useJarvisStore((state) => state.triggerEnergyBurst);
  const energyBurst = useJarvisStore((state) => state.energyBurst);
  const activeCommand = useJarvisStore((state) => state.activeCommand);
  const commandTick = useJarvisStore((state) => state.commandTick);

  const materials = useMemo(
    () => ({
      red: new MeshStandardMaterial({
        color: new Color("#b8130b"),
        metalness: 0.88,
        roughness: 0.18,
        emissive: new Color("#4b0603"),
        emissiveIntensity: 0.42
      }),
      deepRed: new MeshStandardMaterial({
        color: new Color("#5d0705"),
        metalness: 0.78,
        roughness: 0.26,
        emissive: new Color("#250100"),
        emissiveIntensity: 0.28
      }),
      gold: new MeshStandardMaterial({
        color: new Color("#d2aa56"),
        metalness: 0.92,
        roughness: 0.2,
        emissive: new Color("#503409"),
        emissiveIntensity: 0.36
      }),
      black: new MeshStandardMaterial({
        color: new Color("#050506"),
        metalness: 0.7,
        roughness: 0.34,
        emissive: new Color("#0a0302"),
        emissiveIntensity: 0.14
      })
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.55) * 0.14 + t * 0.045;
      root.current.rotation.x = Math.sin(t * 0.42) * 0.035;
      root.current.position.y = Math.sin(t * 1.25) * 0.045;
      root.current.scale.setScalar(1.02 + Math.sin(t * 1.8) * 0.012 + energyBurst * 0.055);
    }
    if (chestCore.current) {
      chestCore.current.scale.setScalar(1 + Math.sin(t * 4.4) * 0.12 + energyBurst * 0.3);
    }
    if (repulsor.current) {
      repulsor.current.scale.setScalar(1 + Math.sin(t * 5.2) * 0.18 + energyBurst * 0.34);
    }
  });

  return (
    <group
      ref={root}
      onPointerEnter={() => {
        document.body.style.cursor = "crosshair";
        triggerEnergyBurst();
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "default";
      }}
      onClick={triggerEnergyBurst}
    >
      <CommandEffects activeCommand={activeCommand} commandTick={commandTick} energyBurst={energyBurst} />

      <ArmorMesh position={[0, 1.82, 0.06]} scale={[0.44, 0.54, 0.34]} material={materials.gold}>
        <sphereGeometry args={[1, 56, 36]} />
      </ArmorMesh>
      <SmoothPlate position={[0, 2.09, 0.16]} scale={[0.62, 0.2, 0.34]} material={materials.red} />
      <SmoothPlate position={[-0.36, 1.86, 0.03]} scale={[0.13, 0.34, 0.31]} rotation={[0, 0, -0.16]} material={materials.red} />
      <SmoothPlate position={[0.36, 1.86, 0.03]} scale={[0.13, 0.34, 0.31]} rotation={[0, 0, 0.16]} material={materials.red} />
      <SmoothPlate position={[0, 1.62, 0.42]} scale={[0.42, 0.18, 0.055]} material={materials.deepRed} />
      <SmoothPlate position={[0, 1.72, 0.46]} scale={[0.28, 0.23, 0.045]} material={materials.gold} />

      {[-0.19, 0.19].map((x) => (
        <group key={x} position={[x, 1.84, 0.36]}>
          <mesh scale={[0.2, 0.028, 0.012]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#fff1bd" transparent opacity={0.82} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <pointLight color="#ffdf8a" intensity={0.45} distance={2.2} />
        </group>
      ))}

      <ArmorMesh position={[0, 0.93, 0.04]} scale={[0.78, 0.9, 0.36]} material={materials.red}>
        <capsuleGeometry args={[0.64, 0.82, 12, 36]} />
      </ArmorMesh>
      <SmoothPlate position={[0, 1.12, 0.48]} scale={[0.62, 0.2, 0.08]} material={materials.gold} />
      <SmoothPlate position={[-0.36, 0.84, 0.5]} scale={[0.28, 0.48, 0.08]} rotation={[0, 0, -0.34]} material={materials.gold} />
      <SmoothPlate position={[0.36, 0.84, 0.5]} scale={[0.28, 0.48, 0.08]} rotation={[0, 0, 0.34]} material={materials.gold} />
      <SmoothPlate position={[-0.52, 0.66, 0.42]} scale={[0.24, 0.28, 0.06]} rotation={[0, 0, -0.18]} material={materials.deepRed} />
      <SmoothPlate position={[0.52, 0.66, 0.42]} scale={[0.24, 0.28, 0.06]} rotation={[0, 0, 0.18]} material={materials.deepRed} />

      <group ref={chestCore} position={[0, 0.98, 0.44]}>
        <GlowDisc position={[0, 0, 0]} scale={0.82} intensity={2.1} />
      </group>

      <SmoothPlate position={[-0.76, 1.03, 0]} scale={[0.42, 0.24, 0.22]} rotation={[0, 0, 0.28]} material={materials.red} />
      <SmoothPlate position={[0.76, 1.03, 0]} scale={[0.42, 0.24, 0.22]} rotation={[0, 0, -0.28]} material={materials.red} />

      <ArmorMesh position={[-0.88, 0.48, 0]} scale={[0.18, 0.62, 0.17]} rotation={[0, 0, -0.18]} material={materials.red}>
        <capsuleGeometry args={[0.33, 0.92, 10, 22]} />
      </ArmorMesh>
      <ArmorMesh position={[0.88, 0.48, 0]} scale={[0.18, 0.62, 0.17]} rotation={[0, 0, 0.18]} material={materials.red}>
        <capsuleGeometry args={[0.33, 0.92, 10, 22]} />
      </ArmorMesh>
      <ArmorMesh position={[-1.02, -0.08, 0.05]} scale={[0.15, 0.54, 0.15]} rotation={[0, 0, -0.08]} material={materials.gold}>
        <capsuleGeometry args={[0.32, 0.78, 10, 18]} />
      </ArmorMesh>
      <ArmorMesh position={[1.02, -0.08, 0.05]} scale={[0.15, 0.54, 0.15]} rotation={[0, 0, 0.08]} material={materials.gold}>
        <capsuleGeometry args={[0.32, 0.78, 10, 18]} />
      </ArmorMesh>

      <group ref={repulsor} position={[-1.07, -0.48, 0.3]} rotation={[0.1, 0.25, -0.05]}>
        <GlowDisc position={[0, 0, 0]} scale={0.62} intensity={1.8} />
      </group>

      <ArmorMesh position={[-0.33, -0.34, 0]} scale={[0.2, 0.78, 0.18]} rotation={[0, 0, 0.08]} material={materials.red}>
        <capsuleGeometry args={[0.34, 1.02, 10, 22]} />
      </ArmorMesh>
      <ArmorMesh position={[0.33, -0.34, 0]} scale={[0.2, 0.78, 0.18]} rotation={[0, 0, -0.08]} material={materials.red}>
        <capsuleGeometry args={[0.34, 1.02, 10, 22]} />
      </ArmorMesh>
      <ArmorMesh position={[-0.34, -1.05, 0.02]} scale={[0.2, 0.62, 0.17]} material={materials.gold}>
        <capsuleGeometry args={[0.32, 0.74, 10, 18]} />
      </ArmorMesh>
      <ArmorMesh position={[0.34, -1.05, 0.02]} scale={[0.2, 0.62, 0.17]} material={materials.gold}>
        <capsuleGeometry args={[0.32, 0.74, 10, 18]} />
      </ArmorMesh>

      <ArmorSeams />

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.98, 0.48]}>
        <torusGeometry args={[0.42, 0.004, 8, 140]} />
        <meshBasicMaterial color="#ffcc72" transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 1.05, 0.72]} intensity={2.2 + energyBurst * 2.2} color="#ff9a32" distance={5.4} />
      <pointLight position={[0, 1.86, 0.64]} intensity={0.9 + energyBurst * 1.2} color="#ffd37d" distance={4.4} />
    </group>
  );
}
