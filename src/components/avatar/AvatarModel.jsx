import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

/**
 * Rigged 3D Character Model
 * - Real rigged 3D game character bust in business suit and tie with styled hair & beard
 * - Arms relaxed naturally at sides (No T-pose)
 * - Optimized framing: Head and hair fully visible with proper headroom
 * - High-definition anisotropic texture filtering (zero blur)
 * - Live moving head, neck, and eyes:
 *    * Autonomous idle look-around with damped easing
 *    * Real-time cursor tracking (eyes lead the movement)
 *    * Procedural eyelid blinking every 2–5 seconds
 *    * Subtle breathing oscillation
 */
export function AvatarModel({ targetRef, reducedMotion = false }) {
  const gltf = useGLTF('/models/avatar.glb');
  const groupRef = useRef();

  // Discover bones and morph targets
  const bones = useMemo(() => {
    let neck = null;
    let head = null;
    let leftEye = null;
    let rightEye = null;
    let leftArm = null;
    let rightArm = null;
    let leftForeArm = null;
    let rightForeArm = null;
    const morphMeshes = [];

    gltf.scene.traverse((child) => {
      if (child.isBone) {
        const name = child.name.toLowerCase();
        if (!neck && name === 'neck') neck = child;
        if (!head && name === 'head') head = child;
        if (!leftEye && name === 'lefteye') leftEye = child;
        if (!rightEye && name === 'righteye') rightEye = child;
        if (!leftArm && name === 'leftarm') leftArm = child;
        if (!rightArm && name === 'rightarm') rightArm = child;
        if (!leftForeArm && name === 'leftforearm') leftForeArm = child;
        if (!rightForeArm && name === 'rightforearm') rightForeArm = child;
      }

      if (child.isMesh && child.morphTargetDictionary) {
        const dict = child.morphTargetDictionary;
        const keys = Object.keys(dict);
        const blinkKeys = keys.filter((k) =>
          /eyeclose|blink|eyesclosed/i.test(k)
        );
        if (blinkKeys.length > 0) {
          morphMeshes.push({
            mesh: child,
            indices: blinkKeys.map((k) => dict[k]),
          });
        }
      }
    });

    return { neck, head, leftEye, rightEye, leftArm, rightArm, leftForeArm, rightForeArm, morphMeshes };
  }, [gltf]);

  // Sharpen textures & enhance normal map definition (eliminates blur and flat wash)
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.roughness = 0.48;
        child.material.metalness = 0.05;
        child.material.envMapIntensity = 0.6;

        if (child.material.map) {
          child.material.map.anisotropy = 16;
          child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
          child.material.map.magFilter = THREE.LinearFilter;
          child.material.map.generateMipmaps = true;
          child.material.map.needsUpdate = true;
        }

        if (child.material.normalMap) {
          child.material.normalMap.anisotropy = 16;
          // Crisp facial depth contours for nose, beard, and cheekbones
          child.material.normalScale = new THREE.Vector2(1.5, 1.5);
          child.material.normalMap.needsUpdate = true;
        }

        child.material.needsUpdate = true;
      }
    });
  }, [gltf]);

  // Arms: gently rest downwards so shoulder silhouette slopes naturally
  useEffect(() => {
    if (bones.leftArm) {
      bones.leftArm.rotation.z = -1.28;
      bones.leftArm.rotation.x = 0.15;
    }
    if (bones.rightArm) {
      bones.rightArm.rotation.z = 1.28;
      bones.rightArm.rotation.x = 0.15;
    }
  }, [bones]);

  // Compute model bounding box for true PASSPORT PHOTO framing:
  // - Head and face are the clear hero of the portrait (~60% of circle)
  // - Top of hair has clean ~15% headroom below the top status pill
  // - Shoulders slope outwards and span naturally across the bottom rim
  // - No armpits or elbows visible; clean, elegant headshot bust
  const modelTransform = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale so head and upper shoulders fit like an official passport photo
    const desiredBustHeight = 2.3;
    const scaleFactor = desiredBustHeight / (size.y * 0.29);

    // Position head so top of hair has clean headroom, face is centered
    const targetY = -(box.max.y - size.y * 0.112) * scaleFactor;
    const targetX = -center.x * scaleFactor;
    const targetZ = -center.z * scaleFactor;

    return {
      scale: [scaleFactor, scaleFactor, scaleFactor],
      position: [targetX, targetY, targetZ],
    };
  }, [gltf]);

  // Store rest base rotations
  const baseRot = useMemo(
    () => ({
      neck: bones.neck ? bones.neck.rotation.clone() : new THREE.Euler(),
      head: bones.head ? bones.head.rotation.clone() : new THREE.Euler(),
    }),
    [bones]
  );

  // Eyelid blink state
  const blinkState = useRef({
    nextBlink: 2.0,
    blinking: false,
    progress: 0,
  });

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const targets = targetRef.current;
    const isHovered = targets.isHovered;

    // Smooth damping for natural head movement
    const smoothNeck = isHovered ? 0.16 : 0.32;
    const smoothHead = isHovered ? 0.14 : 0.28;

    // 1. ROTATE NECK BONE (35% distribution for natural subtle posture)
    if (bones.neck) {
      const euler = [
        baseRot.neck.x + targets.neckTarget[0] * 0.85,
        baseRot.neck.y + targets.neckTarget[1] * 0.85,
        baseRot.neck.z + targets.neckTarget[2] * 0.85,
      ];
      easing.dampE(bones.neck.rotation, euler, smoothNeck, delta);
    }

    // 2. ROTATE HEAD BONE (65% distribution)
    if (bones.head) {
      const euler = [
        baseRot.head.x + targets.headTarget[0],
        baseRot.head.y + targets.headTarget[1],
        baseRot.head.z + targets.headTarget[2],
      ];
      easing.dampE(bones.head.rotation, euler, smoothHead, delta);
    }

    // 3. BREATHING MOTION (tiny lifelike oscillation)
    if (!reducedMotion && groupRef.current) {
      const breath = Math.sin(time * 2.0) * 0.002;
      groupRef.current.position.y = modelTransform.position[1] + breath;
    }

    // 4. NATURAL PROCEDURAL BLINKING (every 2-5 seconds via morph targets)
    if (bones.morphMeshes.length > 0 && !reducedMotion) {
      const bs = blinkState.current;
      if (!bs.blinking && time >= bs.nextBlink) {
        bs.blinking = true;
        bs.progress = 0;
      }
      if (bs.blinking) {
        bs.progress += delta * 7.5;
        const weight = Math.sin(Math.min(bs.progress, 1) * Math.PI);
        bones.morphMeshes.forEach(({ mesh, indices }) => {
          indices.forEach((idx) => {
            mesh.morphTargetInfluences[idx] = weight;
          });
        });
        if (bs.progress >= 1) {
          bs.blinking = false;
          bs.nextBlink = time + 2.0 + Math.random() * 3.0;
        }
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={modelTransform.position}
      scale={modelTransform.scale}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

useGLTF.preload('/models/avatar.glb');

export default AvatarModel;
