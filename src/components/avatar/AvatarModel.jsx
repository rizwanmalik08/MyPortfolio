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
        child.material.roughness = 0.52;
        child.material.metalness = 0.08;

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
          child.material.normalScale = new THREE.Vector2(1.35, 1.35);
          child.material.normalMap.needsUpdate = true;
        }

        child.material.needsUpdate = true;
      }
    });
  }, [gltf]);

  // Set relaxed natural posture on arms so they hang down at sides
  useEffect(() => {
    if (bones.leftArm) {
      bones.leftArm.rotation.z = -1.32;
      bones.leftArm.rotation.x = 0.18;
    }
    if (bones.rightArm) {
      bones.rightArm.rotation.z = 1.32;
      bones.rightArm.rotation.x = 0.18;
    }
    if (bones.leftForeArm) {
      bones.leftForeArm.rotation.z = -0.25;
    }
    if (bones.rightForeArm) {
      bones.rightForeArm.rotation.z = 0.25;
    }
  }, [bones]);

  // Compute model bounding box to position and frame the head and upper torso
  const modelTransform = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale so the bust fits with balanced headroom (face and hair fully visible)
    const desiredBustHeight = 2.4;
    const scaleFactor = desiredBustHeight / (size.y * 0.42);

    // Target the head center with balanced headroom
    const targetY = -(box.max.y - size.y * 0.165) * scaleFactor;
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
      leftEye: bones.leftEye ? bones.leftEye.rotation.clone() : new THREE.Euler(),
      rightEye: bones.rightEye ? bones.rightEye.rotation.clone() : new THREE.Euler(),
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

    // Responsive damping
    const smoothNeck = isHovered ? 0.14 : 0.32;
    const smoothHead = isHovered ? 0.12 : 0.28;
    const smoothEyes = 0.08; // Eyes reach target first

    // 1. ROTATE NECK BONE (40% distribution)
    if (bones.neck) {
      const euler = [
        baseRot.neck.x + targets.neckTarget[0],
        baseRot.neck.y + targets.neckTarget[1],
        baseRot.neck.z + targets.neckTarget[2],
      ];
      easing.dampE(bones.neck.rotation, euler, smoothNeck, delta);
    }

    // 2. ROTATE HEAD BONE (60% distribution)
    if (bones.head) {
      const euler = [
        baseRot.head.x + targets.headTarget[0],
        baseRot.head.y + targets.headTarget[1],
        baseRot.head.z + targets.headTarget[2],
      ];
      easing.dampE(bones.head.rotation, euler, smoothHead, delta);
    }

    // 3. ROTATE EYES (Lead target and look around)
    if (bones.leftEye) {
      const euler = [
        baseRot.leftEye.x + targets.eyesTarget[0],
        baseRot.leftEye.y + targets.eyesTarget[1],
        baseRot.leftEye.z,
      ];
      easing.dampE(bones.leftEye.rotation, euler, smoothEyes, delta);
    }
    if (bones.rightEye) {
      const euler = [
        baseRot.rightEye.x + targets.eyesTarget[0],
        baseRot.rightEye.y + targets.eyesTarget[1],
        baseRot.rightEye.z,
      ];
      easing.dampE(bones.rightEye.rotation, euler, smoothEyes, delta);
    }

    // 4. BREATHING MOTION (subtle chest oscillation while body stays anchored)
    if (!reducedMotion && groupRef.current) {
      const breath = Math.sin(time * 2.2) * 0.003;
      groupRef.current.position.y = modelTransform.position[1] + breath;
    }

    // 5. NATURAL PROCEDURAL BLINKING (every 2-5 seconds)
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
