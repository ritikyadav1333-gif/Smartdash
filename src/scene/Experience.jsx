import { Float } from "@react-three/drei";
import { useControls } from "leva";
import CameraRig from "./CameraRig.jsx";
import Environment from "./Environment.jsx";
import Lighting from "./Lighting.jsx";
import PostFX from "./PostFX.jsx";
import ExactArmorModel from "../components/ExactArmor/ExactArmorModel.jsx";
import Rings from "../components/Rings/Rings.jsx";
import ParticleField from "../components/Particles/ParticleField.jsx";
import ScanGrid from "../components/Grid/ScanGrid.jsx";

export default function Experience() {
  const debug = useControls("JARVIS Debug", {
    particles: { value: 900, min: 250, max: 1400, step: 50 }
  });

  return (
    <>
      <CameraRig />
      <Lighting />
      <Environment />
      <ParticleField count={debug.particles} />
      <ScanGrid />
      <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.24}>
        <group position={[0, 0.26, 0]}>
          <ExactArmorModel />
          <Rings />
        </group>
      </Float>
      <PostFX />
    </>
  );
}
