import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * World-Class Fluid Aurora & Chromatic Liquid Light Canvas
 * Inspired by Linear, Stripe, Apple Pro & OpenAI.
 * Zero wireframes, zero clutter — pure silky, organic, luminous luxury.
 */
export function FluidAurora({ scrollProgress = 0, isMobile = false }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uIntensity: { value: isMobile ? 0.75 : 1.0 },
    }),
    [isMobile]
  );

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uIntensity;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Fast Simplex Noise for silky organic flow
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
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

    // Pseudo-random dither to prevent 8-bit banding
    float randomDither(vec2 coord) {
      return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;

      // Soft interactive fluid offset from cursor
      vec2 mouseOffset = uMouse * 0.12;
      vec2 p = (uv - 0.5) * 2.2 + mouseOffset;

      float t = uTime * 0.22;

      // Harmonic multi-octave liquid turbulence
      float q1 = snoise(p * 0.85 + vec2(t * 0.2, t * 0.15));
      float q2 = snoise(p * 1.5 - vec2(t * 0.25, -t * 0.18) + q1 * 0.45);
      float q3 = snoise(p * 2.8 + vec2(-t * 0.12, t * 0.3) + q2 * 0.35);

      float organicFlow = (q1 * 0.5 + q2 * 0.35 + q3 * 0.15) * 0.5 + 0.5;

      // Executive Color Palette:
      // Obsidian Void: #05060f
      // Royal Cosmic Indigo: #2e1065 / #312e81
      // Electric Violet: #7c3aed
      // Cyan Luminescence: #06b6d4 / #38bdf8
      // Subtle Rose Glow: #db2777
      vec3 cVoid   = vec3(0.02, 0.024, 0.059);  // #05060f
      vec3 cIndigo = vec3(0.18, 0.12, 0.45);   // deep radiant indigo
      vec3 cViolet = vec3(0.48, 0.23, 0.93);   // #7c3aed
      vec3 cCyan   = vec3(0.05, 0.72, 0.85);   // #06b6d4
      vec3 cRose   = vec3(0.85, 0.15, 0.45);   // #db2777

      // Section-driven chromatic evolution
      float s = clamp(uScroll, 0.0, 1.0);
      vec3 dynamicAccent = cViolet;
      if (s < 0.25) {
        // Hero: Harmonious Violet + Cyan
        dynamicAccent = mix(cViolet, cCyan, 0.35);
      } else if (s < 0.55) {
        // About / Skills: Deep Royal Indigo + Violet
        dynamicAccent = mix(cIndigo, cViolet, (s - 0.25) / 0.3);
      } else if (s < 0.8) {
        // Projects: Vibrant Cyan + Teal
        dynamicAccent = mix(cCyan, cViolet, (s - 0.55) / 0.25);
      } else {
        // Contact: Cosmic Magenta / Violet Aura
        dynamicAccent = mix(cViolet, cRose, (s - 0.8) / 0.2);
      }

      // Atmospheric radial falloff centered around right-top (framing hero & content)
      vec2 auraCenter = vec2(0.62, 0.58) + mouseOffset * 0.4;
      float distToCenter = length(uv - auraCenter);
      float vignette = smoothstep(1.35, 0.15, distToCenter);

      // Layered liquid light blending
      vec3 color = mix(cVoid, cIndigo, smoothstep(0.15, 0.65, organicFlow));
      color = mix(color, dynamicAccent, smoothstep(0.38, 0.85, organicFlow * vignette));
      color = mix(color, cCyan, smoothstep(0.68, 0.98, organicFlow * vignette * 0.9) * 0.7);

      // Anti-banding dither
      color += (randomDither(gl_FragCoord.xy) - 0.5) * 0.015;

      // Soft ambient opacity (never overpowers text readability)
      float alpha = smoothstep(0.12, 0.8, organicFlow) * vignette * 0.58 * uIntensity;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Follow camera smoothly in XY space to always frame the viewport perfectly
    meshRef.current.position.x = state.camera.position.x;
    meshRef.current.position.y = state.camera.position.y;

    // Time uniform
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse lerp
    const targetX = state.pointer.x;
    const targetY = state.pointer.y;
    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.damp(
      materialRef.current.uniforms.uMouse.value.x,
      targetX,
      2.5,
      clampedDelta
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.damp(
      materialRef.current.uniforms.uMouse.value.y,
      targetY,
      2.5,
      clampedDelta
    );

    // Scroll progress uniform
    materialRef.current.uniforms.uScroll.value = scrollProgress;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2.8]}>
      {/* Generous plane size to cover widescreen, ultrawide, and portrait mobile */}
      <planeGeometry args={[28, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
