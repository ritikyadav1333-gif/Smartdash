import { useFrame } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, LinearFilter, SRGBColorSpace } from "three";
import armorImage from "../../assets/textures/exact-iron-armor.png";
import { useJarvisStore } from "../../store/useJarvisStore.js";

function GlowOrb({ position, scale = 1, opacity = 0.75, color = "#fff6d7" }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <circleGeometry args={[0.17, 64]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.2, 0.225, 96]} />
        <meshBasicMaterial color="#ffbd4e" transparent opacity={0.5} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight color={color} intensity={1.5} distance={4.2} />
    </group>
  );
}

function CommandEffects({ activeCommand, commandTick, energyBurst }) {
  const scan = useRef();
  const shock = useRef();
  const ping = useRef();
  const heat = useRef();
  const lockPoints = useMemo(
    () => [
      [
        [-0.88, 1.36, 0.08],
        [-0.42, 1.36, 0.08]
      ],
      [
        [-0.65, 1.59, 0.08],
        [-0.65, 1.15, 0.08]
      ],
      [
        [0.32, 1.36, 0.08],
        [0.78, 1.36, 0.08]
      ],
      [
        [0.55, 1.59, 0.08],
        [0.55, 1.15, 0.08]
      ]
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (scan.current) {
      scan.current.position.y = -1.95 + ((t * 1.35 + commandTick * 0.17) % 4.25);
      scan.current.material.opacity = activeCommand === "scan" ? 0.58 : 0;
    }
    if (shock.current) {
      const s = activeCommand === "burst" ? 0.6 + ((t * 2.7) % 2.2) : 0.25;
      shock.current.scale.setScalar(s);
      shock.current.material.opacity = activeCommand === "burst" ? Math.max(0, 0.42 - s * 0.13) : 0;
    }
    if (ping.current) {
      const s = activeCommand === "ping" ? 0.45 + ((t * 1.9) % 2.6) : 0.2;
      ping.current.scale.setScalar(s);
      ping.current.material.opacity = activeCommand === "ping" ? Math.max(0, 0.36 - s * 0.09) : 0;
    }
    if (heat.current) {
      heat.current.material.opacity = activeCommand === "overdrive" ? 0.16 + Math.sin(t * 7) * 0.06 + energyBurst * 0.08 : 0;
    }
  });

  return (
    <group position={[0, 0, 0.13]}>
      <mesh ref={scan} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.55, 0.035]} />
        <meshBasicMaterial color="#ffcf78" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={shock} position={[-0.64, 1.24, 0]}>
        <ringGeometry args={[0.23, 0.245, 128]} />
        <meshBasicMaterial color="#ff2f17" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ping} position={[0.25, 0.45, 0]}>
        <ringGeometry args={[0.28, 0.295, 128]} />
        <meshBasicMaterial color="#ffd98a" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={heat} position={[0.08, 0.15, -0.01]} scale={[1.4, 2.75, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ff260f" transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      {activeCommand === "lock" &&
        lockPoints.map((points, index) => (
          <Line key={index} points={points} color="#ffcf78" lineWidth={2.4} transparent opacity={0.92} />
        ))}
    </group>
  );
}

export default function ExactArmorModel() {
  const root = useRef();
  const imageRef = useRef();
  const leftPalm = useRef();
  const chest = useRef();
  const texture = useTexture(armorImage);
  const activeCommand = useJarvisStore((state) => state.activeCommand);
  const commandTick = useJarvisStore((state) => state.commandTick);
  const energyBurst = useJarvisStore((state) => state.energyBurst);
  const triggerCommand = useJarvisStore((state) => state.triggerCommand);

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 16;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.42) * 0.055;
      root.current.rotation.x = Math.sin(t * 0.33) * 0.018;
      root.current.position.y = Math.sin(t * 0.85) * 0.045;
      root.current.scale.setScalar(1 + energyBurst * 0.025);
    }
    if (leftPalm.current) leftPalm.current.scale.setScalar(1 + Math.sin(t * 4.8) * 0.12 + energyBurst * 0.24);
    if (chest.current) chest.current.scale.setScalar(1 + Math.sin(t * 4.2) * 0.1 + energyBurst * 0.2);
  });

  return (
    <group
      ref={root}
      position={[0, 0.18, 0.02]}
      scale={1.58}
      onPointerEnter={() => {
        document.body.style.cursor = "crosshair";
        triggerCommand("scan");
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "default";
      }}
      onClick={() => triggerCommand("burst")}
    >
      <mesh ref={imageRef} position={[0, 0.05, 0]} scale={[2.42, 3.22, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          uniforms={{ uTexture: { value: texture } }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D uTexture;
            varying vec2 vUv;

            float ellipse(vec2 uv, vec2 center, vec2 radius) {
              vec2 d = (uv - center) / radius;
              return smoothstep(1.0, 0.82, dot(d, d));
            }

            void main() {
              vec4 tex = texture2D(uTexture, vUv);
              float hi = max(max(tex.r, tex.g), tex.b);
              float lo = min(min(tex.r, tex.g), tex.b);
              float sat = hi - lo;
              float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

              float redArmor = smoothstep(0.0, 0.16, tex.r - max(tex.g, tex.b) * 0.82);
              float goldArmor = smoothstep(0.0, 0.13, min(tex.r, tex.g) - tex.b * 1.1);
              float darkArmor = smoothstep(0.1, 0.28, sat) * smoothstep(0.18, 0.58, 1.0 - luma);
              float glowKeep =
                ellipse(vUv, vec2(0.26, 0.63), vec2(0.12, 0.1)) +
                ellipse(vUv, vec2(0.64, 0.5), vec2(0.11, 0.1)) +
                ellipse(vUv, vec2(0.52, 0.78), vec2(0.18, 0.07));
              float brightArmor = smoothstep(0.72, 0.92, luma) * smoothstep(0.05, 0.16, glowKeep);
              float alpha = max(max(redArmor, goldArmor), max(darkArmor, brightArmor));

              float edgeMask = smoothstep(0.015, 0.055, vUv.x) * smoothstep(0.015, 0.055, vUv.y) *
                smoothstep(0.015, 0.055, 1.0 - vUv.x) * smoothstep(0.015, 0.055, 1.0 - vUv.y);
              alpha *= edgeMask;
              alpha = smoothstep(0.18, 0.48, alpha);
              if (alpha < 0.02) discard;
              gl_FragColor = vec4(tex.rgb, alpha);
            }
          `}
        />
      </mesh>
      <group ref={leftPalm}>
        <GlowOrb position={[-0.63, 1.22, 0.16]} scale={0.82} opacity={0.8} />
      </group>
      <group ref={chest}>
        <GlowOrb position={[0.25, 0.45, 0.16]} scale={0.7} opacity={0.7} />
      </group>
      <CommandEffects activeCommand={activeCommand} commandTick={commandTick} energyBurst={energyBurst} />
      <pointLight position={[-0.62, 1.2, 0.4]} intensity={activeCommand === "launch" ? 6.5 : activeCommand === "overdrive" ? 4.2 : 2.2} color="#fff2c4" distance={5.8} />
      <pointLight position={[0.24, 0.44, 0.4]} intensity={activeCommand === "launch" ? 5.2 : activeCommand === "overdrive" ? 3.7 : 1.8} color="#ffd082" distance={5} />
    </group>
  );
}
