import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * Avatar3DPortrait
 * - Premium interactive 3D portrait presentation of Rizwan in a tailored black suit and tie
 * - Real 3D rendered character portrait framed with proper headroom and passport-grade proportions
 * - Smooth spring-damped 3D tilt & parallax tracking cursor coordinates
 * - Dynamic interactive specular studio lighting sheen reacting to mouse movement
 * - Gentle floating breathing oscillation
 * - Ambient floating cyber particles & inner atmospheric depth
 * - Smooth return to neutral when mouse leaves
 * - Responsive & accessible (prefers-reduced-motion fallback)
 */
export function Avatar3DPortrait({
  isHovered = false,
  normX = 0,
  normY = 0,
  reducedMotion = false,
}) {
  // Smooth spring physics for 3D tilt
  const springConfig = { damping: 22, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const transX = useSpring(0, springConfig);
  const transY = useSpring(0, springConfig);

  // Dynamic light position
  const [lightPos, setLightPos] = useState({ x: 50, y: 35 });

  useEffect(() => {
    if (reducedMotion) {
      rotateX.set(0);
      rotateY.set(0);
      transX.set(0);
      transY.set(0);
      setLightPos({ x: 50, y: 35 });
      return;
    }

    if (isHovered) {
      // Rotate towards cursor
      rotateX.set(-normY * 5.5); // max 5.5deg pitch
      rotateY.set(normX * 7.5);  // max 7.5deg yaw
      transX.set(normX * 6);     // subtle horizontal parallax
      transY.set(normY * 4);     // subtle vertical parallax
      setLightPos({
        x: 50 + normX * 28,
        y: 35 + normY * 22,
      });
    } else {
      // Smooth return to neutral center
      rotateX.set(0);
      rotateY.set(0);
      transX.set(0);
      transY.set(0);
      setLightPos({ x: 50, y: 35 });
    }
  }, [normX, normY, isHovered, reducedMotion, rotateX, rotateY, transX, transY]);

  // Floating cyber particles data
  const particles = [
    { top: '18%', left: '22%', size: 3, color: '#38bdf8', delay: 0 },
    { top: '28%', left: '80%', size: 2.5, color: '#a855f7', delay: 0.8 },
    { top: '65%', left: '16%', size: 2, color: '#22d3ee', delay: 1.4 },
    { top: '75%', left: '82%', size: 3, color: '#38bdf8', delay: 2.1 },
    { top: '40%', left: '12%', size: 2, color: '#f43f5e', delay: 0.5 },
    { top: '85%', left: '50%', size: 2.5, color: '#c084fc', delay: 1.8 },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ perspective: 1200 }}
    >
      {/* 1. Deep Space Radial Glow Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 42%, #0e122b 0%, #060918 55%, #02050f 100%)',
        }}
      />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-cyan-500/15 blur-[50px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-violet-600/20 blur-[60px]" />

      {/* 2. Floating Cyber Ambient Particles */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {particles.map((p, idx) => (
            <motion.div
              key={idx}
              className="absolute rounded-full"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 0.85, 0.3],
                scale: [0.9, 1.2, 0.9],
              }}
              transition={{
                duration: 3.5 + (idx % 3),
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* 3. Interactive 3D Character Layer with Smooth Floating & Tilt */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          x: transX,
          y: transY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          reducedMotion
            ? {}
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Rizwan's Real Portrait */}
        <img
          src="/avatar/rizwan-real-portrait.jpg"
          alt="Rizwan - Real Portrait in Tailored Suit"
          className="h-full w-full object-cover select-none pointer-events-none transition-transform duration-500"
          style={{
            objectPosition: 'center 18%',
            transform: 'scale(1.03)',
            imageRendering: 'auto',
          }}
          loading="eager"
          decoding="async"
        />

        {/* 4. Dynamic Cursor-Reactive Specular Studio Sheen */}
        {!reducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.9 : 0.45,
              background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(168, 85, 247, 0.14) 30%, transparent 65%)`,
            }}
          />
        )}

        {/* 5. Rim Depth Edge Glow & Inner Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 35px rgba(2, 6, 23, 0.85)',
          }}
        />
      </motion.div>
    </div>
  );
}

export default Avatar3DPortrait;
