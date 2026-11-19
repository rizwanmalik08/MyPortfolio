import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Topographic Kinetic Horizon Grid
 * 
 * Aesthetic:
 * - Precision architectural elevation contour matrix stretching into deep horizon
 * - Dual-frequency harmonic wave interference (swell + micro-ripples)
 * - Height-dependent color grading (Midnight Indigo -> Electric Cyan -> Diamond White)
 * - Anti-aliased circular point shader with luminous specular halo
 * - 100% GPU hardware vertex shader displacement (0 CPU math, 0 buffer re-uploads)
 */
export function ParticleWave({ scrollRef, scrollProgress = 0, isMobile = false }) {
  const pointsRef = useRef();
  const materialRef = useRef();

  const countX = isMobile ? 32 : 52;
  const countY = isMobile ? 30 : 46;
  const numParticles = countX * countY;
  const separation = 0.38;

  const [positions, gridUV] = useMemo(() => {
    const pos = new Float32Array(numParticles * 3);
    const uvs = new Float32Array(numParticles * 2);

    let i = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iy = 0; iy < countY; iy++) {
        const x = ix * separation - (countX * separation) / 2;
        const z = iy * separation - (countY * separation) / 2;
        const y = 0;

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        uvs[i * 2] = ix / (countX - 1);
        uvs[i * 2 + 1] = iy / (countY - 1);

        i++;
      }
    }

    return [pos, uvs];
  }, [countX, countY, numParticles, separation]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uBaseColor: { value: new THREE.Color('#312e81') },
      uAccentColor: { value: new THREE.Color('#38bdf8') },
      uCrestColor: { value: new THREE.Color('#f0f9ff') },
    }),
    []
  );

  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;
    uniform vec3 uBaseColor;
    uniform vec3 uAccentColor;
    uniform vec3 uCrestColor;

    attribute vec2 aGridUv;
    varying vec3 vColor;
    varying float vDepthAlpha;

    void main() {
      vec3 pos = position;

      // 1. Dual-harmonic wave interference
      float wave1 = sin(pos.x * 0.72 + uTime * 1.05) * cos(pos.z * 0.58 + uTime * 0.85) * 0.38;
      float wave2 = sin((pos.x + pos.z) * 0.95 + uTime * 1.35) * 0.16;
      float totalWave = wave1 + wave2;

      // 2. Interactive mouse gravitational deflection
      float distToMouse = length(pos.xz - uMouse * 3.5);
      float mouseDip = exp(-distToMouse * 0.9) * 0.28;
      totalWave -= mouseDip;

      pos.y += totalWave;

      // 3. Scroll depth glide (camera passes over horizon seamlessly)
      pos.y -= uScroll * 1.6;
      pos.z -= uScroll * 2.2;

      // 4. Elevation-based procedural color ramp
      float heightFactor = clamp((totalWave + 0.35) / 0.7, 0.0, 1.0);
      vec3 col = mix(uBaseColor, uAccentColor, smoothstep(0.1, 0.65, heightFactor));
      col = mix(col, uCrestColor, smoothstep(0.65, 0.98, heightFactor));
      vColor = col;

      // 5. Depth fog falloff (fade distant points gracefully)
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float depth = -mvPosition.z;
      vDepthAlpha = smoothstep(12.0, 3.5, depth);

      // Anti-aliased dynamic point sizing
      gl_PointSize = clamp(32.0 / depth, 1.6, 5.8);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vDepthAlpha;

    void main() {
      // Precision analytical circular particle with glowing core
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float core = smoothstep(0.20, 0.02, dist);
      float halo = smoothstep(0.50, 0.05, dist) * 0.55;
      float alpha = (core + halo) * vDepthAlpha * 0.82;

      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  useFrame((state, delta) => {
    if (!materialRef.current || !pointsRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    const t = state.clock.elapsedTime;
    materialRef.current.uniforms.uTime.value = t;

    const p = scrollRef ? scrollRef.current : scrollProgress;
    materialRef.current.uniforms.uScroll.value = p;

    // Smooth cursor react
    const currentMouse = materialRef.current.uniforms.uMouse.value;
    currentMouse.x = THREE.MathUtils.damp(currentMouse.x, state.pointer.x, 2, clampedDelta);
    currentMouse.y = THREE.MathUtils.damp(currentMouse.y, state.pointer.y, 2, clampedDelta);

    // Subtle gentle horizon sway
    const targetRotX = 0.52 + state.pointer.y * 0.05;
    const targetRotY = state.pointer.x * 0.06;
    pointsRef.current.rotation.x = THREE.MathUtils.damp(pointsRef.current.rotation.x, targetRotX, 2, clampedDelta);
    pointsRef.current.rotation.y = THREE.MathUtils.damp(pointsRef.current.rotation.y, targetRotY, 2, clampedDelta);
  });

  return (
    <group position={[0, -2.8, -4.2]}>
      <points ref={pointsRef} rotation={[0.52, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={numParticles}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aGridUv"
            count={numParticles}
            array={gridUV}
            itemSize={2}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
