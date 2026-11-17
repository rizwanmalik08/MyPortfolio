import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Modern 3D Interactive Horizon Particle Wave
 * Silky, low-horizon wave that provides cinematic depth without competing with text.
 */
export function ParticleWave({ scrollProgress = 0, isMobile = false }) {
  const pointsRef = useRef();

  const countX = isMobile ? 32 : 52;
  const countY = isMobile ? 32 : 52;
  const numParticles = countX * countY;
  const separation = 0.34;

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
    const time = state.clock.elapsedTime * 1.0;
    const posArray = pointsRef.current.geometry.attributes.position.array;

    let i = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iy = 0; iy < countY; iy++) {
        // Dual harmonic wave function
        const waveY =
          Math.sin((ix * 0.22) + time) * 0.4 +
          Math.sin((iy * 0.18) + time * 0.85) * 0.4;

        posArray[i * 3 + 1] = waveY;
        i++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Smooth subtle mouse tilt
    const targetRotX = 0.55 + state.pointer.y * 0.06;
    const targetRotY = state.pointer.x * 0.08;
    pointsRef.current.rotation.x = THREE.MathUtils.damp(pointsRef.current.rotation.x, targetRotX, 2, clampedDelta);
    pointsRef.current.rotation.y = THREE.MathUtils.damp(pointsRef.current.rotation.y, targetRotY, 2, clampedDelta);

    // Scroll glide: softly recedes into depth as user scrolls
    pointsRef.current.position.y = -2.6 - scrollProgress * 1.5;
    pointsRef.current.position.z = -3.8 - scrollProgress * 2.0;
  });

  return (
    <group position={[0, -2.6, -3.8]}>
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
          size={isMobile ? 0.04 : 0.048}
          vertexColors
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
