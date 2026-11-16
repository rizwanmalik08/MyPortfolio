import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Contact Glowing Portal
 * Energy gateway with rotating torus rings and inner aura for the contact section
 */
export function ContactPortal({ scrollProgress = 0, isMobile = false }) {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const energyRingRef = useRef();

  useFrame((state, delta) => {
    if (outerRingRef.current) outerRingRef.current.rotation.z += delta * 0.25;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= delta * 0.35;
    if (energyRingRef.current) {
      energyRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      energyRingRef.current.rotation.y += delta * 0.4;
    }
  });

  const inView = scrollProgress >= 0.8;
  const scale = (inView ? 1 : 0.5) * (isMobile ? 0.75 : 1);

  return (
    <group position={[0, -8.0, -1]} scale={scale}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        {/* Outer glowing portal ring */}
        <mesh ref={outerRingRef}>
          <torusGeometry args={[2.0, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={2}
            roughness={0.1}
          />
        </mesh>

        {/* Second counter-rotating ring */}
        <mesh ref={innerRingRef} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[1.7, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>

        {/* Third tilted gimbal ring */}
        <mesh ref={energyRingRef} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.4, 0.02, 16, 48]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#f43f5e"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Inner Event Horizon Disc */}
        <mesh position={[0, 0, -0.05]}>
          <circleGeometry args={[1.65, 32]} />
          <meshBasicMaterial
            color="#0f172a"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Point lights illuminating the portal */}
        <pointLight color="#22d3ee" intensity={2} distance={4} />
        <pointLight color="#7c3aed" intensity={2.5} distance={4} position={[0, 0, 1]} />
      </Float>
    </group>
  );
}
