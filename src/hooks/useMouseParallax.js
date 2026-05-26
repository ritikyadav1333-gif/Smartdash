import { useEffect, useRef } from "react";
import { Vector2 } from "three";

export function useMouseParallax(strength = 1) {
  const target = useRef(new Vector2(0, 0));
  const current = useRef(new Vector2(0, 0));

  useEffect(() => {
    const onMove = (event) => {
      target.current.x = ((event.clientX / window.innerWidth) * 2 - 1) * strength;
      target.current.y = -((event.clientY / window.innerHeight) * 2 - 1) * strength;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [strength]);

  return { target, current };
}
