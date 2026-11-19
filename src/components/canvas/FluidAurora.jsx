import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Creative Technologist Fluid Aurora Shader
 * 
 * Aesthetic:
 * - Liquid Obsidian Silk with Chromatic Dispersion (RGB phase splitting)
 * - Cosine-palette harmonic color grading tailored across scroll sections
 * - Interactive cursor fluid gravity drift
 * - 100% GPU procedural fragment shader with zero texture dependencies
 */
export function FluidAurora({ scrollRef, scrollProgress = 0, isMobile = false }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uIntensity: { value: isMobile ? 0.7 : 0.95 },
    }),
    [isMobile]
  );

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uIntensity;
    varying vec2 vUv;

    // High-speed 2D Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Cosine Harmonic Palette Generator (Inigo Quilez standard)
    vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.283185 * (c * t + d));
    }

    void main() {
      vec2 uv = vUv;
      vec2 mouseOffset = uMouse * 0.12;
      vec2 p = (uv - 0.5) * 2.2 + mouseOffset;

      float t = uTime * 0.16;

      // Optical Chromatic Dispersion: slightly displaced noise evaluations per RGB channel
      // Creates organic silk refraction that feels physical and handcrafted
      float r1 = snoise(p * 0.85 + vec2(t * 0.15, t * 0.12));
      float r2 = snoise(p * 1.50 - vec2(t * 0.18, -t * 0.14) + r1 * 0.35);
      float flowR = (r1 * 0.6 + r2 * 0.4) * 0.5 + 0.5;

      float g1 = snoise(p * 0.88 + vec2(t * 0.16 + 0.04, t * 0.13 + 0.03));
      float g2 = snoise(p * 1.55 - vec2(t * 0.19, -t * 0.15) + g1 * 0.35);
      float flowG = (g1 * 0.6 + g2 * 0.4) * 0.5 + 0.5;

      float b1 = snoise(p * 0.91 + vec2(t * 0.17 + 0.08, t * 0.14 + 0.06));
      float b2 = snoise(p * 1.60 - vec2(t * 0.20, -t * 0.16) + b1 * 0.35);
      float flowB = (b1 * 0.6 + b2 * 0.4) * 0.5 + 0.5;

      // Section-Adaptive Dynamic Cosine Palette
      // Smoothly transitions as the user journeys from Hero -> Services -> Contact
      float s = clamp(uScroll, 0.0, 1.0);

      // Section 1: Hero (Sapphire Obsidian & Midnight Indigo)
      vec3 a1 = vec3(0.04, 0.05, 0.12);
      vec3 b1 = vec3(0.28, 0.22, 0.55);
      vec3 c1 = vec3(1.0, 1.0, 1.0);
      vec3 d1 = vec3(0.00, 0.33, 0.67);

      // Section 2: Services / SMM (Cyber Emerald & Tech Cyan)
      vec3 a2 = vec3(0.02, 0.08, 0.10);
      vec3 b2 = vec3(0.12, 0.45, 0.48);
      vec3 c2 = vec3(1.0, 1.0, 1.0);
      vec3 d2 = vec3(0.15, 0.45, 0.55);

      // Section 3: Contact / Experience (Royal Amethyst & Celestial Rose)
      vec3 a3 = vec3(0.08, 0.04, 0.14);
      vec3 b3 = vec3(0.48, 0.18, 0.52);
      vec3 c3 = vec3(1.0, 1.0, 1.0);
      vec3 d3 = vec3(0.35, 0.15, 0.85);

      // Interpolate palette parameters based on scroll depth
      vec3 palA = s < 0.5 ? mix(a1, a2, s * 2.0) : mix(a2, a3, (s - 0.5) * 2.0);
      vec3 palB = s < 0.5 ? mix(b1, b2, s * 2.0) : mix(b2, b3, (s - 0.5) * 2.0);
      vec3 palC = s < 0.5 ? mix(c1, c2, s * 2.0) : mix(c2, c3, (s - 0.5) * 2.0);
      vec3 palD = s < 0.5 ? mix(d1, d2, s * 2.0) : mix(d2, d3, (s - 0.5) * 2.0);

      vec3 colR = palette(flowR, palA, palB, palC, palD);
      vec3 colG = palette(flowG, palA, palB, palC, palD);
      vec3 colB = palette(flowB, palA, palB, palC, palD);

      // Reconstructed chromatic silk vector
      vec3 finalColor = vec3(colR.r, colG.g, colB.b);

      // Deep void black base with luminous harmonic crests
      vec3 voidBlack = vec3(0.020, 0.024, 0.055);
      float intensity = smoothstep(0.18, 0.78, (flowR + flowG + flowB) * 0.333);
      finalColor = mix(voidBlack, finalColor, intensity);

      // Vignette falloff to keep viewport edges clean and frame content
      float dist = length(uv - 0.5);
      float vignette = smoothstep(0.95, 0.25, dist);

      gl_FragColor = vec4(finalColor * uIntensity, vignette * 0.72);
    }
  `;

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    const p = scrollRef ? scrollRef.current : scrollProgress;
    materialRef.current.uniforms.uScroll.value = p;

    // Follow camera viewport
    meshRef.current.position.x = state.camera.position.x;
    meshRef.current.position.y = state.camera.position.y;

    // Smooth cursor inertia
    const targetMouseX = state.pointer.x * 0.45;
    const targetMouseY = state.pointer.y * 0.45;
    const currentMouse = materialRef.current.uniforms.uMouse.value;
    currentMouse.x = THREE.MathUtils.damp(currentMouse.x, targetMouseX, 2, clampedDelta);
    currentMouse.y = THREE.MathUtils.damp(currentMouse.y, targetMouseY, 2, clampedDelta);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2.8]}>
      <planeGeometry args={[20, 16, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
