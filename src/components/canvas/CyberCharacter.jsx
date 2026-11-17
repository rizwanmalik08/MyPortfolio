import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import rizwan3dAvatarImg from '../../assets/rizwan-3d-avatar.jpg';

/**
 * Lifelike Volumetric 3D Model of Rizwan
 * - Fixed inside the frame (ZERO OrbitControls dragging or tumbling)
 * - Autonomous Idle: Naturally moves his face left-right, up-down, and tilts like a real living person
 * - Interactive Cursor Tracking: When mouse enters, he immediately tracks the cursor with his face
 * - Volumetric 3D Depth Displaced Geometry with dynamic specular lighting
 */
export function CyberCharacter({
  mouseNorm = { x: 0, y: 0 },
  theme = 'cyber',
  isHovered = false,
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const lightRef = useRef();

  // Load the stylized 3D avatar texture of Rizwan
  const texture = useTexture(rizwan3dAvatarImg);

  // Palette based on theme
  const colors = useMemo(() => {
    if (theme === 'studio') {
      return {
        accent1: new THREE.Color('#38bdf8'),
        accent2: new THREE.Color('#818cf8'),
        hex1: '#38bdf8',
        hex2: '#818cf8',
      };
    }
    if (theme === 'matrix') {
      return {
        accent1: new THREE.Color('#10b981'),
        accent2: new THREE.Color('#06b6d4'),
        hex1: '#10b981',
        hex2: '#06b6d4',
      };
    }
    return {
      accent1: new THREE.Color('#22d3ee'),
      accent2: new THREE.Color('#7c3aed'),
      hex1: '#22d3ee',
      hex2: '#7c3aed',
    };
  }, [theme]);

  // 3D Volumetric Depth Displacement Shader
  const shaderUniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uDisplacement: { value: 0.32 }, // Facial feature forward pop
      uCurve: { value: 0.28 },       // 3D Cylindrical head curvature
      uLightPos: { value: new THREE.Vector3(0, 0, 3) },
      uAccentColor: { value: colors.accent1 },
      uTime: { value: 0 },
    }),
    [texture, colors]
  );

  const vertexShader = `
    uniform sampler2D uMap;
    uniform float uDisplacement;
    uniform float uCurve;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vec4 texColor = texture2D(uMap, uv);
      
      // Radial mask so the circular edge stays flush
      float d = length(uv - vec2(0.5, 0.5));
      float rimMask = smoothstep(0.495, 0.08, d);
      
      // Cylindrical head curvature: center bows forward, sides curve back
      float headCurve = cos(clamp((uv.x - 0.5) * 3.14159, -1.57, 1.57)) * uCurve;
      
      // Luminance-based facial feature extrusion (nose, brow, chin, tie protrude forward)
      float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      float featureExtrusion = luma * uDisplacement;
      
      vec3 pos = position;
      pos.z += (headCurve + featureExtrusion) * rimMask;
      
      vPosition = pos;
      vNormal = normalize(normalMatrix * normal + vec3(0.0, 0.0, (headCurve + featureExtrusion) * 0.4));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uMap;
    uniform vec3 uLightPos;
    uniform vec3 uAccentColor;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec4 color = texture2D(uMap, vUv);
      
      // Circular silhouette cut
      float d = length(vUv - vec2(0.5, 0.5));
      if (d > 0.498) discard;
      
      // Dynamic 3D lighting calculation
      vec3 lightDir = normalize(uLightPos - vPosition);
      float diff = max(dot(vNormal, lightDir), 0.0);
      
      // Specular rim reflection
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 28.0);
      
      vec3 finalColor = color.rgb * (0.85 + diff * 0.35) + uAccentColor * spec * 0.65;
      float alpha = smoothstep(0.498, 0.47, d);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // 40 Floating 3D Data Particles
  const [particlesPos, particlesColor] = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.15 + (i % 4) * 0.22;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.7 + (i % 8) * 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.7;

      const c = i % 2 === 0 ? colors.accent1 : colors.accent2;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [colors]);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // =========================================================================
    // 1. AUTONOMOUS IDLE HEAD MOVEMENTS (Looking Left-Right, Up-Down, Naturally)
    // =========================================================================
    // Multi-frequency harmonic glance algorithm (natural eye/head wandering)
    const idleRotY = Math.sin(t * 0.75) * 0.32 + Math.sin(t * 0.3) * 0.18;
    const idleRotX = Math.cos(t * 0.55) * 0.18 + Math.sin(t * 0.22) * 0.08;
    const idleTiltZ = Math.sin(t * 0.45) * 0.05;
    const idleBreatheY = Math.sin(t * 1.8) * 0.02;

    // =========================================================================
    // 2. INTERACTIVE CURSOR TRACKING (When Mouse is on/near Avatar)
    // =========================================================================
    const cursorRotY = mouseNorm.x * 0.52;
    const cursorRotX = mouseNorm.y * -0.38;
    const cursorTiltZ = mouseNorm.x * -0.08;

    // Blend smoothly: if hovered, track mouse; if not, wander naturally
    const blendFactor = isHovered ? 1.0 : 0.0;
    const targetY = THREE.MathUtils.lerp(idleRotY, cursorRotY, blendFactor);
    const targetX = THREE.MathUtils.lerp(idleRotX, cursorRotX, blendFactor);
    const targetZ = THREE.MathUtils.lerp(idleTiltZ, cursorTiltZ, blendFactor);

    // Apply smooth damping to the 3D model's face rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetY, 3.8, clampedDelta);
      meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetX, 3.8, clampedDelta);
      meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, targetZ, 3.8, clampedDelta);
      meshRef.current.position.y = 0.05 + idleBreatheY;
    }

    // Dynamic 3D lighting glints
    const lightTargetX = isHovered ? mouseNorm.x * 2.5 : Math.sin(t * 0.75) * 2.0;
    const lightTargetY = isHovered ? mouseNorm.y * 2.5 : Math.cos(t * 0.55) * 1.5;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uAccentColor.value = colors.accent1;
      materialRef.current.uniforms.uLightPos.value.set(lightTargetX, lightTargetY, 2.5);
    }

    if (lightRef.current) {
      lightRef.current.position.x = lightTargetX;
      lightRef.current.position.y = lightTargetY;
    }

    // 3D Concentric Gyro Rings rotate smoothly in background
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += clampedDelta * 0.22;
      ring1Ref.current.rotation.x = THREE.MathUtils.damp(ring1Ref.current.rotation.x, 1.2 + targetX * 0.4, 3, clampedDelta);
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= clampedDelta * 0.18;
      ring2Ref.current.rotation.x = THREE.MathUtils.damp(ring2Ref.current.rotation.x, -0.9 + targetX * 0.3, 3, clampedDelta);
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Dynamic Studio Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 3]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, 2, -1]} intensity={1.5} color={colors.hex2} />
      <pointLight
        ref={lightRef}
        position={[0, 0, 2.5]}
        intensity={3.0}
        color={colors.hex1}
        distance={5}
      />

      {/* FLOAT ANIMATION */}
      <Float speed={1.8} rotationIntensity={0.06} floatIntensity={0.2}>

        {/* 1. FIXED VOLUMETRIC 3D MESH OF RIZWAN (ROTATES FACE NATURALLY + TRACKS MOUSE) */}
        <mesh ref={meshRef} position={[0, 0.05, 0]}>
          <planeGeometry args={[2.45, 2.45, 96, 96]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={shaderUniforms}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. 3D GYROSCOPIC HOLOGRAPHIC RING 1 */}
        <mesh ref={ring1Ref} position={[0, 0, 0.1]}>
          <torusGeometry args={[1.34, 0.008, 16, 64]} />
          <meshStandardMaterial
            color={colors.hex1}
            emissive={colors.hex1}
            emissiveIntensity={2.2}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Satellite Node on Ring 1 */}
        <mesh position={[1.34, 0, 0.1]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 3. 3D GYROSCOPIC HOLOGRAPHIC RING 2 */}
        <mesh ref={ring2Ref} position={[0, 0, 0.05]}>
          <torusGeometry args={[1.22, 0.006, 16, 64]} />
          <meshStandardMaterial
            color={colors.hex2}
            emissive={colors.hex2}
            emissiveIntensity={1.8}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* 4. BASE HOLOGRAPHIC PROJECTOR PEDESTAL */}
        <group position={[0, -1.25, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <mesh>
            <ringGeometry args={[1.1, 1.25, 48]} />
            <meshBasicMaterial color={colors.hex1} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.8, 0.9, 36]} />
            <meshBasicMaterial color={colors.hex2} transparent opacity={0.45} side={THREE.DoubleSide} />
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
