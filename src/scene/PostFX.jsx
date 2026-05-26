import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function PostFX() {
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.46} intensity={0.58} mipmapBlur />
      <ChromaticAberration offset={[0.00016, 0.0001]} blendFunction={BlendFunction.NORMAL} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.018} />
      <Vignette eskil={false} offset={0.18} darkness={0.78} />
    </EffectComposer>
  );
}
