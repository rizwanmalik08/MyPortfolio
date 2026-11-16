import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Hero Morphing Energy Core
 * Distorted metallic torus-knot, outer wireframe cage, and dual orbital rings
 */
export function HeroObject({ scrollProgress = 0, isMobile = false }) {
  const groupRef = useRef();
  const innerMeshRef = useRef();
  const cageRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtle pointer parallax
    const targetX = (state.pointer.x * 0.4);
    const targetY = (state.pointer.y * 0.3);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 2.5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 2.5, delta);

    // Continuous rotation
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x += delta * 0.25;
      innerMeshRef.current.rotation.y += delta * 0.35;
    }

    if (cageRef.current) {
      cageRef.current.rotation.x -= delta * 0.15;
      cageRef.current.rotation.y -= delta * 0.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.3;
      ring1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.25;
      ring2Ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.4;
    }

    // Scroll reaction: morph scale and color tone smoothly
    const scaleFactor = Math.max(0.6, 1 - scrollProgress * 1.2);
    groupRef.current.scale.setScalar(scaleFactor * (isMobile ? 0.75 : 1));

    // Shift group Y slightly down with scroll to stay in visual harmony
    groupRef.current.position.z = -scrollProgress * 2.0;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        {/* Core Distorted Morphing Mesh */}
        <mesh ref={innerMeshRef} scale={1.25}>
          <torusKnotGeometry args={[0.9, 0.28, 128, 32]} />
          <MeshDistortMaterial
            color="#7c3aed"
            roughness={0.15}
            metalness={0.85}
            distort={0.42}
            speed={2.2}
            reflectivity={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Outer Geometric Wireframe Cage */}
        <mesh ref={cageRef} scale={2.0}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Orbital Ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]} scale={2.3}>
          <torusGeometry args={[1, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Orbital Ring 2 */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]} scale={2.5}>
          <torusGeometry args={[1, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Inner Glowing Light Nucleus */}
        <pointLight color="#a855f7" intensity={2.5} distance={5} />
      </Float>
    </group>
  );
}
