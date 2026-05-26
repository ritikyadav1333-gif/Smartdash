import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import gsap from "gsap";
import { useMouseParallax } from "../hooks/useMouseParallax.js";

export default function CameraRig() {
  const { camera } = useThree();
  const { target, current } = useMouseParallax(0.44);
  const lookAt = useMemo(() => new Vector3(0, 0.85, 0), []);
  const intro = useRef({ z: 8.9, y: 1.85, x: 0.85 });

  useLayoutEffect(() => {
    camera.position.set(intro.current.x, intro.current.y, intro.current.z);
    const tween = gsap.to(intro.current, {
      x: 0,
      y: 1.18,
      z: 6.15,
      duration: 4.4,
      ease: "power4.inOut"
    });

    return () => tween.kill();
  }, [camera]);

  useFrame((state, delta) => {
    current.current.lerp(target.current, 1 - Math.pow(0.02, delta));
    const time = state.clock.elapsedTime;
    const orbitX = Math.sin(time * 0.12) * 0.32;
    const orbitY = Math.cos(time * 0.09) * 0.14;

    camera.position.x += (intro.current.x + current.current.x * 0.42 + orbitX - camera.position.x) * 0.045;
    camera.position.y += (intro.current.y + current.current.y * 0.18 + orbitY - camera.position.y) * 0.045;
    camera.position.z += (intro.current.z + Math.sin(time * 0.11) * 0.22 - camera.position.z) * 0.035;
    camera.lookAt(lookAt.x + current.current.x * 0.16, lookAt.y + current.current.y * 0.12, lookAt.z);
  });

  return null;
}
