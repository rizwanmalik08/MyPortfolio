import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Hero Morphing Energy Core (High Performance 60FPS)
 * Optimized geometry segment counts + smooth mouse acceleration
 */
export function HeroObject({ scrollProgress = 0, isMobile = false }) {
  const groupRef = useRef();
  const innerMeshRef = useRef();
  const cageRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Mouse parallax
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.25;
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 2.5, clampedDelta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 2.5, clampedDelta);

    // Continuous rotation with smooth velocity
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x += clampedDelta * 0.28;
      innerMeshRef.current.rotation.y += clampedDelta * 0.38;
    }

    if (cageRef.current) {
      cageRef.current.rotation.x -= clampedDelta * 0.16;
      cageRef.current.rotation.y -= clampedDelta * 0.22;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += clampedDelta * 0.35;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= clampedDelta * 0.28;
    }

    // Scroll reaction: scale down slightly as user descends
    const scaleFactor = Math.max(0.65, 1 - scrollProgress * 1.1);
    groupRef.current.scale.setScalar(scaleFactor * (isMobile ? 0.72 : 1));
    groupRef.current.position.z = -scrollProgress * 2.2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.0}>
        {/* Core Distorted Morphing Mesh - 64x16 geometry for buttery 60fps */}
        <mesh ref={innerMeshRef} scale={1.22}>
          <torusKnotGeometry args={[0.88, 0.26, 64, 16]} />
          <MeshDistortMaterial
            color="#7c3aed"
            roughness={0.15}
            metalness={0.8}
            distort={0.36}
            speed={1.9}
            reflectivity={0.8}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Outer Geometric Wireframe Cage */}
        <mesh ref={cageRef} scale={1.9}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Orbital Ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]} scale={2.2}>
          <torusGeometry args={[1, 0.012, 8, 36]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={1.2}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Orbital Ring 2 */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]} scale={2.4}>
          <torusGeometry args={[1, 0.01, 8, 36]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.0}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Inner Glow Light */}
        <pointLight color="#a855f7" intensity={2} distance={4} />
      </Float>
    </group>
  );
}
