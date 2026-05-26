import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lighting() {
  const core = useRef();
  const rim = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) core.current.intensity = 2.2 + Math.sin(t * 1.5) * 0.35;
    if (rim.current) rim.current.position.x = Math.sin(t * 0.28) * 4;
  });

  return (
    <>
      <ambientLight intensity={0.16} color="#ff9c40" />
      <pointLight ref={core} position={[0, 1.3, 1.7]} intensity={2.4} distance={8} color="#ff8f2f" />
      <pointLight position={[-3.7, 2.2, -2.2]} intensity={2.2} distance={9} color="#ff2b19" />
      <pointLight ref={rim} position={[3.2, 3.1, -3.5]} intensity={1.2} distance={10} color="#ffcf78" />
      <spotLight position={[0, 6.5, 3]} angle={0.34} penumbra={0.8} intensity={1.2} color="#ffd087" />
    </>
  );
}
