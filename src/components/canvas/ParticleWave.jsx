import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Modern 3D Interactive Particle Wave (Iconic Creative Tech Wave)
 * Sits elegantly at the horizon and lower depth.
 * NEVER blocks text or portrait — provides breathtaking depth and motion.
 */
export function ParticleWave({ scrollProgress = 0, isMobile = false }) {
  const pointsRef = useRef();

  const countX = isMobile ? 35 : 55;
  const countY = isMobile ? 35 : 55;
  const numParticles = countX * countY;
  const separation = 0.32;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);

    const colorViolet = new THREE.Color('#6366f1');
    const colorCyan = new THREE.Color('#38bdf8');
    const colorTeal = new THREE.Color('#2dd4bf');

    let i = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iy = 0; iy < countY; iy++) {
        const x = ix * separation - (countX * separation) / 2;
        const z = iy * separation - (countY * separation) / 2;
        const y = 0;

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Gradient based on X position: violet to cyan to teal
        const t = ix / countX;
        let c = colorViolet.clone().lerp(colorCyan, t);
        if (t > 0.7) {
          c = colorCyan.clone().lerp(colorTeal, (t - 0.7) / 0.3);
        }

        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;

        i++;
      }
    }

    return [pos, col];
  }, [countX, countY, numParticles, separation]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime * 1.2;
    const posArray = pointsRef.current.geometry.attributes.position.array;

    let i = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iy = 0; iy < countY; iy++) {
        // Dual harmonic wave function
        const waveY =
          Math.sin((ix * 0.25) + time) * 0.45 +
          Math.sin((iy * 0.2) + time * 0.9) * 0.45;

        posArray[i * 3 + 1] = waveY;
        i++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Smooth subtle mouse tilt
    const targetRotX = 0.55 + state.pointer.y * 0.08;
    const targetRotY = state.pointer.x * 0.1;
    pointsRef.current.rotation.x = THREE.MathUtils.damp(pointsRef.current.rotation.x, targetRotX, 2, clampedDelta);
    pointsRef.current.rotation.y = THREE.MathUtils.damp(pointsRef.current.rotation.y, targetRotY, 2, clampedDelta);

    // Scroll glide: as user scrolls down, wave softly recedes
    pointsRef.current.position.y = -2.4 - scrollProgress * 1.5;
    pointsRef.current.position.z = -3.5 - scrollProgress * 2.0;
  });

  return (
    <group position={[0, -2.4, -3.5]}>
      <points ref={pointsRef} rotation={[0.55, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={numParticles}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={numParticles}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.055 : 0.065}
          vertexColors
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
