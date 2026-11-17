import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import rizwan3dAvatarImg from '../../assets/rizwan-3d-avatar.jpg';

/**
 * 3D Avatar Model of Rizwan
 * Rendered in WebGL with:
 * - High-detail stylized 3D character texture of Rizwan
 * - Interactive 3D mouse tracking & gimbal tilt
 * - Dynamic 3D cursor point light casting specular highlights
 * - Concentric 3D holographic orbit rings with traveling satellite nodes
 * - Floating 3D luminous data particles & holographic projector pedestal
 */
export function CyberCharacter({ mouseNorm = { x: 0, y: 0 }, theme = 'cyber' }) {
  const rootRef = useRef();
  const avatarMeshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const lightRef = useRef();

  // Load the generated 3D avatar texture
  const texture = useTexture(rizwan3dAvatarImg);

  // Palette based on theme
  const colors = useMemo(() => {
    if (theme === 'studio') {
      return {
        accent1: '#38bdf8', // Sky Cyan
        accent2: '#818cf8', // Indigo
        core: '#38bdf8',
      };
    }
    if (theme === 'matrix') {
      return {
        accent1: '#10b981', // Emerald
        accent2: '#06b6d4', // Cyan
        core: '#10b981',
      };
    }
    return {
      accent1: '#22d3ee', // Cyan
      accent2: '#7c3aed', // Violet
      core: '#06b6d4',
    };
  }, [theme]);

  // Floating particles in 3D volume
  const [particlesPos, particlesColor] = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color(colors.accent1);
    const c2 = new THREE.Color(colors.accent2);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.1 + (i % 4) * 0.25;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.7 + (i % 8) * 0.22;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.7;

      const c = i % 2 === 0 ? c1 : c2;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [colors]);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // 1. Interactive 3D Model Tilt (Smooth damping towards mouse)
    if (avatarMeshRef.current) {
      const targetRotY = mouseNorm.x * 0.35;
      const targetRotX = mouseNorm.y * -0.25;
      avatarMeshRef.current.rotation.y = THREE.MathUtils.damp(avatarMeshRef.current.rotation.y, targetRotY, 3.5, clampedDelta);
      avatarMeshRef.current.rotation.x = THREE.MathUtils.damp(avatarMeshRef.current.rotation.x, targetRotX, 3.5, clampedDelta);
    }

    // 2. Cursor Point Light Position (Casts dynamic 3D specular glare)
    if (lightRef.current) {
      lightRef.current.position.x = mouseNorm.x * 2.2;
      lightRef.current.position.y = mouseNorm.y * 2.2;
    }

    // 3. Orbiting Gyro Ring 1
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += clampedDelta * 0.3;
      ring1Ref.current.rotation.x = THREE.MathUtils.damp(ring1Ref.current.rotation.x, 1.2 + mouseNorm.y * -0.3, 3, clampedDelta);
      ring1Ref.current.rotation.y = THREE.MathUtils.damp(ring1Ref.current.rotation.y, mouseNorm.x * 0.3, 3, clampedDelta);
    }

    // 4. Orbiting Gyro Ring 2
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= clampedDelta * 0.25;
      ring2Ref.current.rotation.x = THREE.MathUtils.damp(ring2Ref.current.rotation.x, -0.9 + mouseNorm.y * -0.2, 3, clampedDelta);
      ring2Ref.current.rotation.y = THREE.MathUtils.damp(ring2Ref.current.rotation.y, mouseNorm.x * 0.2, 3, clampedDelta);
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.05, 0]}>
      
      {/* Dynamic 3D Studio Lights */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 3]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, 2, -1]} intensity={1.5} color={colors.accent2} />

      {/* Interactive Cursor Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 2.2]}
        intensity={2.8}
        color={colors.accent1}
        distance={5}
      />

      {/* GENTLE FLOATING ANIMATION */}
      <Float speed={2.0} rotationIntensity={0.12} floatIntensity={0.3}>

        {/* 1. 3D AVATAR MODEL DISC MESH (RIZWAN 3D CHARACTER) */}
        <mesh ref={avatarMeshRef} position={[0, 0.05, 0]}>
          <circleGeometry args={[1.22, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.25}
            metalness={0.4}
            envMapIntensity={1.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. 3D GYROSCOPIC HOLOGRAPHIC RING 1 */}
        <mesh ref={ring1Ref} position={[0, 0, 0.12]}>
          <torusGeometry args={[1.32, 0.008, 16, 64]} />
          <meshStandardMaterial
            color={colors.accent1}
            emissive={colors.accent1}
            emissiveIntensity={2.2}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Satellite Node on Ring 1 */}
        <mesh position={[1.32, 0, 0.12]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 3. 3D GYROSCOPIC HOLOGRAPHIC RING 2 */}
        <mesh ref={ring2Ref} position={[0, 0, 0.06]}>
          <torusGeometry args={[1.2, 0.006, 16, 64]} />
          <meshStandardMaterial
            color={colors.accent2}
            emissive={colors.accent2}
            emissiveIntensity={1.8}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* 4. BASE HOLOGRAPHIC PROJECTOR PEDESTAL */}
        <group position={[0, -1.25, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <mesh>
            <ringGeometry args={[1.1, 1.25, 48]} />
            <meshBasicMaterial color={colors.accent1} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.8, 0.9, 36]} />
            <meshBasicMaterial color={colors.accent2} transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, -0.05]}>
            <circleGeometry args={[1.28, 32]} />
            <meshBasicMaterial color="#040714" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* 5. FLOATING 3D DATA PARTICLES */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={40}
              array={particlesPos}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={40}
              array={particlesColor}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

      </Float>
    </group>
  );
}
