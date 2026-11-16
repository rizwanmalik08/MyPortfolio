import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Modern Holographic Gimbal Accent
 * Positioned on the right side behind the portrait avatar.
 * ZERO collision with text on the left — clean, high-end, and balanced.
 */
export function HeroObject({ scrollProgress = 0, isMobile = false }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Subtle pointer parallax
    const targetX = (isMobile ? 0 : 2.5) + (state.pointer.x * 0.25);
    const targetY = state.pointer.y * 0.2;
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.y, targetX, 2, clampedDelta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 2, clampedDelta);

    // Smooth gyroscopic rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += clampedDelta * 0.22;
      ring1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.25;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= clampedDelta * 0.18;
      ring2Ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.25;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += clampedDelta * 0.15;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += clampedDelta * 0.2;
      coreRef.current.rotation.x -= clampedDelta * 0.15;
    }

    // Scroll glide: fades and descends as user scrolls
    const scaleFactor = Math.max(0.5, 1.0 - scrollProgress * 1.5);
    groupRef.current.scale.setScalar(scaleFactor * (isMobile ? 0.6 : 1.05));
    groupRef.current.position.z = -1.2 - scrollProgress * 2.5;
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 2.5, 0, -1.2]}>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.6}>
        
        {/* Subtle Delicate Wireframe Octahedron (No solid cube!) */}
        <mesh ref={coreRef} scale={1.1}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#38bdf8"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Gyroscopic Gimbal Ring 1 (Electric Violet) */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]} scale={2.2}>
          <torusGeometry args={[1, 0.007, 8, 48]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Gyroscopic Gimbal Ring 2 (Sky Cyan) */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]} scale={2.4}>
          <torusGeometry args={[1, 0.006, 8, 48]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.0}
            transparent
            opacity={0.45}
          />
        </mesh>

        {/* Outer Fine Telemetry Ring */}
        <mesh ref={ring3Ref} scale={2.65}>
          <torusGeometry args={[1, 0.004, 8, 48]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Soft Backing Light */}
        <pointLight color="#38bdf8" intensity={2.0} distance={6} />
      </Float>
    </group>
  );
}
