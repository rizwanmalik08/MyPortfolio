import { useRef, useState } from 'react';
import { soundManager } from '../../utils/audioFX';

/**
 * 3D Interactive Tilt Card with Dynamic Specular Spotlight Glare & Cyber HUD Accents
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  glowColor = 'rgba(34, 211, 238, 0.12)',
  showCornerBrackets = true,
  onClick,
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    glareX: 50,
    glareY: 50,
    opacity: 0,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 2 - 1;
    const percentY = (y / rect.height) * 2 - 1;

    const rotateX = -percentY * maxTilt;
    const rotateY = percentX * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      glareX: 50,
      glareY: 50,
      opacity: 0,
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
      }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0e1c]/85 backdrop-blur-xl transition-shadow duration-300 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)] will-change-transform ${className}`}
    >
      {/* Specular Spotlight Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity: style.opacity,
          background: `radial-gradient(circle 280px at ${style.glareX}% ${style.glareY}%, ${glowColor}, transparent 80%)`,
        }}
      />

      {/* Cyber HUD Corner Brackets */}
      {showCornerBrackets && (
        <>
          <div className="pointer-events-none absolute top-2.5 left-2.5 h-2.5 w-2.5 border-t-2 border-l-2 border-cyan-400/40 z-20" />
          <div className="pointer-events-none absolute top-2.5 right-2.5 h-2.5 w-2.5 border-t-2 border-r-2 border-cyan-400/40 z-20" />
          <div className="pointer-events-none absolute bottom-2.5 left-2.5 h-2.5 w-2.5 border-b-2 border-l-2 border-cyan-400/40 z-20" />
          <div className="pointer-events-none absolute bottom-2.5 right-2.5 h-2.5 w-2.5 border-b-2 border-r-2 border-cyan-400/40 z-20" />
        </>
      )}

      {children}
    </div>
  );
}
