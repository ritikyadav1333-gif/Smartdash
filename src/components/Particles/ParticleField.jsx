import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Object3D } from "three";

export default function ParticleField({ count = 700 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.25) * 6,
      z: (Math.random() - 0.5) * 12,
      s: Math.random() * 0.025 + 0.008,
      v: Math.random() * 0.18 + 0.04
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      dummy.position.set(p.x + Math.sin(t * p.v + p.y) * 0.08, p.y + Math.sin(t * p.v) * 0.1, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color={new Color("#ffad45")}
        transparent
        opacity={0.45}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
