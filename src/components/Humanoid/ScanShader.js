export const scanShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: null },
    uColorB: { value: null },
    uOpacity: { value: 0.78 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorld;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vWorld;
    varying vec3 vNormal;

    float line(float value, float size, float blur) {
      float halfSize = size * 0.5;
      return smoothstep(halfSize + blur, halfSize, abs(value));
    }

    void main() {
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
      float scan = line(fract(vWorld.y * 1.85 - uTime * 0.52) - 0.5, 0.055, 0.08);
      float fine = step(0.82, fract((vWorld.y + uTime * 0.18) * 18.0));
      float pulse = 0.55 + 0.45 * sin(uTime * 2.4 + vWorld.y * 5.0);
      vec3 color = mix(uColorA, uColorB, fresnel + scan * 0.4);
      float alpha = uOpacity * (0.42 + fresnel * 0.52 + scan * 0.5 + fine * 0.06) * pulse;
      gl_FragColor = vec4(color, alpha);
    }
  `
};
