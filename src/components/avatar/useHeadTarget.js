import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * useHeadTarget
 * 
 * Manages target head, neck, and eye rotations across two modes:
 * A) Autonomous Idle (random look-around every 1.5–3.5s, 25% center pause)
 * B) Cursor Tracking (interactive tracking with 600ms exit delay & page-wide 40% awareness)
 * 
 * All per-frame rotation targets are stored in mutable refs to avoid React re-renders.
 */
export function useHeadTarget({
  idleInterval = [1.5, 3.5],
  maxYaw = 30 * (Math.PI / 180),     // ±30 deg
  maxPitch = 15 * (Math.PI / 180),   // ±15 deg
  maxRoll = 4 * (Math.PI / 180),     // ±4 deg
  followStrength = 1.0,
  reducedMotion = false,
} = {}) {
  // Mode state for UI status badges (changes only on mode transitions, not per frame)
  const [trackingMode, setTrackingMode] = useState('idle'); // 'idle' | 'tracking'

  // Refs for high-frequency frame calculations (Zero React re-render per frame)
  const targetRef = useRef({
    // Target Euler angles [pitch (x), yaw (y), roll (z)]
    neckTarget: [0, 0, 0],
    headTarget: [0, 0, 0],
    eyesTarget: [0, 0, 0],

    // Current smoothed Euler values
    neckCurrent: [0, 0, 0],
    headCurrent: [0, 0, 0],
    eyesCurrent: [0, 0, 0],

    // Interaction flags
    isHovered: false,
    isPageActive: false,
    mode: 'idle', // 'idle' | 'tracking'
    pointer: { x: 0, y: 0 },
    pagePointer: { x: 0, y: 0 },
  });

  const timerRef = useRef({
    nextIdleTime: 0,
    leaveTimeoutId: null,
  });

  // Pick random idle target
  const pickNewIdleTarget = useCallback(() => {
    if (reducedMotion) {
      targetRef.current.neckTarget = [0, 0, 0];
      targetRef.current.headTarget = [0, 0, 0];
      targetRef.current.eyesTarget = [0, 0, 0];
      return;
    }

    // 25% chance to center for natural pause
    const returnToCenter = Math.random() < 0.25;

    let targetPitch = 0;
    let targetYaw = 0;
    let targetRoll = 0;

    if (!returnToCenter) {
      targetYaw = (Math.random() * 2 - 1) * maxYaw;
      targetPitch = (Math.random() * 2 - 1) * maxPitch;
      targetRoll = (Math.random() * 2 - 1) * maxRoll;
    }

    // Distribute: 40% Neck, 60% Head, Eyes lead further
    targetRef.current.neckTarget = [targetPitch * 0.4, targetYaw * 0.4, targetRoll * 0.3];
    targetRef.current.headTarget = [targetPitch * 0.6, targetYaw * 0.6, targetRoll * 0.7];
    targetRef.current.eyesTarget = [targetPitch * 0.75, targetYaw * 0.85, 0];
  }, [maxYaw, maxPitch, maxRoll, reducedMotion]);

  // Pointer Enter Widget
  const onPointerEnter = useCallback(() => {
    if (timerRef.current.leaveTimeoutId) {
      clearTimeout(timerRef.current.leaveTimeoutId);
      timerRef.current.leaveTimeoutId = null;
    }
    targetRef.current.isHovered = true;
    targetRef.current.mode = 'tracking';
    setTrackingMode('tracking');
  }, []);

  // Pointer Move on Widget (normalized coordinates -1 to +1)
  const onPointerMove = useCallback(
    (normX, normY) => {
      targetRef.current.pointer.x = normX;
      targetRef.current.pointer.y = normY;

      if (reducedMotion) {
        // Minimal subtle tilt only
        const tiltYaw = normX * 0.08;
        const tiltPitch = -normY * 0.05;
        targetRef.current.headTarget = [tiltPitch, tiltYaw, 0];
        targetRef.current.neckTarget = [tiltPitch * 0.3, tiltYaw * 0.3, 0];
        targetRef.current.eyesTarget = [tiltPitch * 1.2, tiltYaw * 1.2, 0];
        return;
      }

      // Tracking mode: yaw = x * 35°, pitch = -y * 22°
      const yaw = normX * (35 * (Math.PI / 180)) * followStrength;
      const pitch = -normY * (22 * (Math.PI / 180)) * followStrength;
      const roll = normX * -0.04;

      // 40% Neck, 60% Head, Eyes look further
      targetRef.current.neckTarget = [pitch * 0.4, yaw * 0.4, roll * 0.3];
      targetRef.current.headTarget = [pitch * 0.6, yaw * 0.6, roll * 0.7];
      targetRef.current.eyesTarget = [pitch * 0.8, yaw * 0.85, 0];
    },
    [followStrength, reducedMotion]
  );

  // Pointer Leave Widget: wait 600ms, ease to center, resume idle mode
  const onPointerLeave = useCallback(() => {
    targetRef.current.isHovered = false;

    if (timerRef.current.leaveTimeoutId) {
      clearTimeout(timerRef.current.leaveTimeoutId);
    }

    timerRef.current.leaveTimeoutId = setTimeout(() => {
      targetRef.current.mode = 'idle';
      setTrackingMode('idle');

      // Ease smoothly back to center
      targetRef.current.neckTarget = [0, 0, 0];
      targetRef.current.headTarget = [0, 0, 0];
      targetRef.current.eyesTarget = [0, 0, 0];

      // Schedule next idle transition
      const delay = idleInterval[0] + Math.random() * (idleInterval[1] - idleInterval[0]);
      timerRef.current.nextIdleTime = performance.now() / 1000 + delay;
    }, 600);
  }, [idleInterval]);

  // Page-wide pointer awareness (reduced strength 40% when outside widget)
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (targetRef.current.isHovered || reducedMotion) return;

      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      targetRef.current.pagePointer.x = normX;
      targetRef.current.pagePointer.y = normY;

      // Subtly steer head towards mouse across page if idle
      if (targetRef.current.mode === 'idle') {
        const yaw = normX * (35 * (Math.PI / 180)) * 0.4;
        const pitch = -normY * (20 * (Math.PI / 180)) * 0.4;
        targetRef.current.neckTarget = [pitch * 0.3, yaw * 0.3, 0];
        targetRef.current.headTarget = [pitch * 0.5, yaw * 0.5, 0];
        targetRef.current.eyesTarget = [pitch * 0.65, yaw * 0.7, 0];
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [reducedMotion]);

  // Idle timer loop
  useEffect(() => {
    if (reducedMotion) return;

    let isMounted = true;
    let timerId = null;

    const scheduleNextIdle = () => {
      const delayMs =
        (idleInterval[0] + Math.random() * (idleInterval[1] - idleInterval[0])) * 1000;

      timerId = setTimeout(() => {
        if (!isMounted) return;
        if (!targetRef.current.isHovered && targetRef.current.mode === 'idle') {
          pickNewIdleTarget();
        }
        scheduleNextIdle();
      }, delayMs);
    };

    scheduleNextIdle();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (timerRef.current.leaveTimeoutId) clearTimeout(timerRef.current.leaveTimeoutId);
    };
  }, [idleInterval, pickNewIdleTarget, reducedMotion]);

  return {
    targetRef,
    trackingMode,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
  };
}
