import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import { scanShader } from "./ScanShader.js";

export const HologramMaterial = shaderMaterial(
  {
    ...scanShader.uniforms,
    uColorA: new Color("#ff7a18"),
    uColorB: new Color("#39ddff"),
    uOpacity: 0.72
  },
  scanShader.vertexShader,
  scanShader.fragmentShader
);
