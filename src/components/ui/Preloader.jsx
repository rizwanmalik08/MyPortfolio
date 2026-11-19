import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audioFX';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

/**
 * 3D Trinity Discipline Core & Perspective Terrain Grid
 * 
 * Directly represents Rizwan Malik's core skillset:
 * 1. VISUAL DESIGN (Figma, Brand Identity, UI/UX) - Amethyst / Rose
 * 2. FULL-STACK CODE (React, C++, Next.js, 3D WebGL) - Electric Cyan / Ice Blue
 * 3. GROWTH STRATEGY (Digital Branding, Technical SEO, Marketing Systems) - Emerald Jade
 * 
 * Features:
 * - 3D Undulating Perspective Dot Matrix Terrain (as shown in user's reference)
 * - Central radiant Identity Nucleus
 * - 3 revolving Discipline Nodes with laser synapse data streams
 * - Handcrafted Obsidian Glass Button & instant 380ms camera dive
 */
export function Preloader({ onComplete }) {
  const canvasRef = useRef(null);
  const [isWarping, setIsWarping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const warpStateRef = useRef({ active: false, flare: 0, speedMult: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3 Trinity Nodes Configuration
    const TRINITY_NODES = [
      {
        id: 'design',
        title: 'VISUAL DESIGN',
        subtitle: 'Figma • UI/UX • Identity',
        icon: '✦',
        color: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.9)',
        hue: 345,
      },
      {
        id: 'code',
        title: 'FULL-STACK CODE',
        subtitle: 'React • C++ • 3D WebGL',
        icon: '</>',
        color: '#00f0ff',
        glowColor: 'rgba(0, 240, 255, 0.9)',
        hue: 185,
      },
      {
        id: 'growth',
        title: 'GROWTH STRATEGY',
        subtitle: 'Digital Marketing • SEO',
        icon: '↗',
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.9)',
        hue: 155,
      },
    ];

    // Ambient Stardust Particles
    const PARTICLE_COUNT = 90;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1200,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 800 - 200,
      size: Math.random() * 1.8 + 0.6,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;
      smoothMouseX += (mouseX - smoothMouseX) * 0.05;
      smoothMouseY += (mouseY - smoothMouseY) * 0.05;

      const isWarp = warpStateRef.current.active;
      if (isWarp) {
        warpStateRef.current.flare += 0.32;
        warpStateRef.current.speedMult = Math.min(24, warpStateRef.current.speedMult * 1.35);
      }

      ctx.clearRect(0, 0, width, height);

      // Deep Space Galactic Gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 40,
        width / 2, height / 2, Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#090d1a');
      bgGrad.addColorStop(0.45, '#04060d');
      bgGrad.addColorStop(1, '#020306');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.49;
      const fov = 650;

      // 1. Perspective Undulating Terrain Grid (From User Reference)
      const gridCols = 24;
      const gridRows = 20;
      const gridSpacingX = 46;
      const gridSpacingZ = 46;
      const baseY = 130;

      ctx.save();
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const worldX = (c - gridCols / 2) * gridSpacingX;
          const worldZ = (r + 1) * gridSpacingZ + 60;
          
          // Harmonic wave elevation
          const waveElev = Math.sin(worldX * 0.007 + time * 1.2) * 18 + 
                           Math.cos(worldZ * 0.008 + time * 0.9) * 14;
          const worldY = baseY + waveElev;

          // Apply mouse tilt
          const rotTiltX = 0.35 + smoothMouseY * 0.18;
          const rotTiltY = smoothMouseX * 0.22;

          const cosX = Math.cos(rotTiltX);
          const sinX = Math.sin(rotTiltX);
          const cosY = Math.cos(rotTiltY);
          const sinY = Math.sin(rotTiltY);

          const x1 = worldX * cosY - worldZ * sinY;
          const z1 = worldX * sinY + worldZ * cosY;
          const y2 = worldY * cosX - z1 * sinX;
          const z2 = worldY * sinX + z1 * cosX;

          const scale = fov / (fov + z2);
          if (scale > 0) {
            const screenX = cx + x1 * scale;
            const screenY = cy + y2 * scale;

            // Fog depth falloff
            const depthFactor = Math.max(0, 1 - z2 / 1100);
            const dotAlpha = depthFactor * 0.42;

            if (dotAlpha > 0.02) {
              ctx.beginPath();
              ctx.fillStyle = `rgba(56, 189, 248, ${dotAlpha})`;
              ctx.arc(screenX, screenY, Math.max(0.6, 1.6 * scale), 0, Math.PI * 2);
              ctx.fill();

              // Subtle connecting grid lines for nearest rows
              if (c < gridCols - 1 && r % 2 === 0 && depthFactor > 0.3) {
                const nextWorldX = (c + 1 - gridCols / 2) * gridSpacingX;
                const nextWave = Math.sin(nextWorldX * 0.007 + time * 1.2) * 18 + 
                                 Math.cos(worldZ * 0.008 + time * 0.9) * 14;
                const nextY = baseY + nextWave;
                const nx1 = nextWorldX * cosY - worldZ * sinY;
                const nz1 = nextWorldX * sinY + worldZ * cosY;
                const ny2 = nextY * cosX - nz1 * sinX;
                const nz2 = nextY * sinX + nz1 * cosX;
                const nscale = fov / (fov + nz2);

                ctx.beginPath();
                ctx.strokeStyle = `rgba(56, 189, 248, ${dotAlpha * 0.25})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(cx + nx1 * nscale, cy + ny2 * nscale);
                ctx.stroke();
              }
            }
          }
        }
      }
      ctx.restore();

      // 2. Ambient Stardust
      particles.forEach(p => {
        p.twinkle += 0.04;
        const pz = p.z - (isWarp ? warpStateRef.current.flare * 400 : 0);
        const scale = fov / Math.max(50, fov + pz);
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;
        const alpha = Math.max(0.1, 0.4 + Math.sin(p.twinkle) * 0.3);

        ctx.beginPath();
        ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Central Identity Core Nucleus
      const nucleusPulse = 1 + Math.sin(time * 3) * 0.12;
      const coreRad = 28 * (isWarp ? 1 + warpStateRef.current.flare * 3 : 1);

      // Radial Core Glow
      const coreAura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 95 * nucleusPulse);
      coreAura.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coreAura.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
      coreAura.addColorStop(0.5, 'rgba(168, 85, 247, 0.25)');
      coreAura.addColorStop(1, 'rgba(2, 3, 6, 0)');
      ctx.fillStyle = coreAura;
      ctx.beginPath();
      ctx.arc(cx, cy, 95 * nucleusPulse, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Central Diamond Prism
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.5 + smoothMouseX * 0.4);
      ctx.beginPath();
      const diamondSize = coreRad * nucleusPulse;
      ctx.moveTo(0, -diamondSize);
      ctx.lineTo(diamondSize, 0);
      ctx.lineTo(0, diamondSize);
      ctx.lineTo(-diamondSize, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      ctx.fill();

      // Inner Diamond Facet
      ctx.beginPath();
      ctx.moveTo(0, -diamondSize * 0.5);
      ctx.lineTo(diamondSize * 0.5, 0);
      ctx.lineTo(0, diamondSize * 0.5);
      ctx.lineTo(-diamondSize * 0.5, 0);
      ctx.closePath();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      // 4. Compute 3D Trinity Skill Nodes Positions
      const orbitRadius = Math.min(width * 0.22, 190);
      const orbitTiltY = smoothMouseX * 0.5;
      const orbitTiltX = 0.35 + smoothMouseY * 0.35;
      const rotSpeed = time * 0.5 * warpStateRef.current.speedMult;

      const nodePositions = TRINITY_NODES.map((node, i) => {
        const baseAngle = rotSpeed + (i * (Math.PI * 2)) / 3;
        
        // 3D Orbit Coordinates
        const rawX = Math.cos(baseAngle) * orbitRadius;
        const rawZ = Math.sin(baseAngle) * orbitRadius;
        const rawY = Math.sin(baseAngle * 2 + time) * 22;

        // Apply mouse-driven 3D matrix rotation
        const cosY = Math.cos(orbitTiltY);
        const sinY = Math.sin(orbitTiltY);
        const cosX = Math.cos(orbitTiltX);
        const sinX = Math.sin(orbitTiltX);

        const x1 = rawX * cosY - rawZ * sinY;
        const z1 = rawX * sinY + rawZ * cosY;
        const y2 = rawY * cosX - z1 * sinX;
        const z2 = rawY * sinX + z1 * cosX;

        const currentZ = isWarp ? z2 - warpStateRef.current.flare * 300 : z2;
        const scale = fov / Math.max(50, fov + currentZ);
        const screenX = cx + x1 * scale;
        const screenY = cy + y2 * scale;

        return {
          ...node,
          screenX,
          screenY,
          scale,
          z3d: currentZ,
        };
      });

      // 5. Draw Interconnecting Laser Synapses (Between Nodes & To Nucleus)
      // Node-to-Nucleus Filaments
      nodePositions.forEach(np => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(np.screenX, np.screenY);
        ctx.strokeStyle = np.glowColor;
        ctx.lineWidth = 1.4 * np.scale;
        ctx.shadowColor = np.color;
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Traveling Light Packet
        const packetT = (time * 1.5 + (np.hue / 360)) % 1;
        const packetX = cx + (np.screenX - cx) * packetT;
        const packetY = cy + (np.screenY - cy) * packetT;
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(packetX, packetY, 2.5 * np.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Node-to-Node Triangular Perimeter Synapses
      for (let i = 0; i < 3; i++) {
        const p1 = nodePositions[i];
        const p2 = nodePositions[(i + 1) % 3];

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        const grad = ctx.createLinearGradient(p1.screenX, p1.screenY, p2.screenX, p2.screenY);
        grad.addColorStop(0, p1.color);
        grad.addColorStop(1, p2.color);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 * Math.min(p1.scale, p2.scale);
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time * 25;
        ctx.stroke();
        ctx.restore();
      }

      // 6. Sort Nodes by Depth (Z-Sorting) & Render
      const sortedNodes = [...nodePositions].sort((a, b) => b.z3d - a.z3d);

      sortedNodes.forEach(node => {
        const nodeRadius = 24 * node.scale;

        ctx.save();
        // Atmospheric Depth Dimming
        const depthAlpha = Math.max(0.4, Math.min(1, (node.scale - 0.4) * 1.6));

        // Outer Aura
        const auraGrad = ctx.createRadialGradient(
          node.screenX, node.screenY, nodeRadius * 0.3,
          node.screenX, node.screenY, nodeRadius * 2.4
        );
        auraGrad.addColorStop(0, node.glowColor);
        auraGrad.addColorStop(0.5, node.glowColor.replace('0.9', '0.25'));
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, nodeRadius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Node Glass Sphere Body
        const sphereGrad = ctx.createRadialGradient(
          node.screenX - nodeRadius * 0.3, node.screenY - nodeRadius * 0.3, 2,
          node.screenX, node.screenY, nodeRadius
        );
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.35, node.color);
        sphereGrad.addColorStop(0.85, '#070b18');
        sphereGrad.addColorStop(1, '#020306');
        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // High-Precision Hairline Rim
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Concentric Gyro Ring on each node
        ctx.beginPath();
        ctx.ellipse(
          node.screenX, node.screenY,
          nodeRadius * 1.5, nodeRadius * 0.55,
          time * 1.5, 0, Math.PI * 2
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Icon Glyph inside node
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, 12 * node.scale)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.icon, node.screenX, node.screenY);

        // Architectural Discipline Label Badge
        const labelY = node.screenY + nodeRadius + 14 * node.scale;
        
        // Background badge pill
        ctx.fillStyle = 'rgba(7, 10, 22, 0.85)';
        ctx.strokeStyle = node.glowColor.replace('0.9', '0.5');
        ctx.lineWidth = 1;
        const textWidth = ctx.measureText(node.title).width + 24;
        const badgeH = 20 * node.scale;
        
        ctx.beginPath();
        ctx.roundRect(node.screenX - textWidth / 2, labelY - badgeH / 2, textWidth, badgeH, 10);
        ctx.fill();
        ctx.stroke();

        // Badge Title
        ctx.fillStyle = node.color;
        ctx.font = `bold ${Math.max(8.5, 10 * node.scale)}px "JetBrains Mono", monospace`;
        ctx.fillText(node.title, node.screenX, labelY);

        ctx.restore();
      });

      // 7. Supernova Optical Flare on Enter Warp
      if (isWarp) {
        const flareRad = 180 * (1 + warpStateRef.current.flare * 4);
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareRad);
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        flashGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.95)');
        flashGrad.addColorStop(0.65, 'rgba(244, 63, 94, 0.5)');
        flashGrad.addColorStop(1, 'rgba(2, 3, 6, 0)');
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, flareRad, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleEnter = () => {
    if (isWarping) return;
    setIsWarping(true);
    warpStateRef.current.active = true;

    if (!isMuted) {
      try {
        soundManager.playEnterSwell();
      } catch (_) { }
    }

    // Direct 380ms camera fly-through transition into portfolio
    setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 380);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    const state = soundManager.toggleSound();
    setIsMuted(!state);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#020306] text-white select-none overflow-hidden font-sans"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: isWarping ? 0 : 1,
            scale: isWarping ? 1.3 : 1,
            filter: isWarping ? 'blur(14px)' : 'blur(0px)',
          }}
          transition={{
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Interactive 3D Trinity Discipline Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {/* Relativistic Optical Lens Flare on Enter */}
          {isWarping && (
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-r from-cyan-400/50 via-white/90 to-rose-400/50 mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
            />
          )}

          {/* Top HUD: Edition & Audio Toggle */}
          <header
            className={`absolute top-6 sm:top-8 left-6 sm:left-10 right-6 sm:right-10 z-20 max-w-7xl mx-auto flex items-center justify-between text-xs font-mono transition-opacity duration-300 ${isWarping ? 'opacity-0' : 'opacity-100'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="tracking-[0.25em] uppercase text-slate-300 text-[11px]">
                TRINITY DISCIPLINE CORE // 2026 EDITION
              </span>
            </div>

            <button
              onClick={toggleSound}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[11px] font-mono tracking-wider text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                  <span>AUDIO MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="flex items-center gap-1.5">
                    <span>AUDIO ON</span>
                    <span className="flex items-end gap-0.5 h-2.5">
                      <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                      <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse delay-75" />
                      <span className="w-0.5 h-1 bg-cyan-400 animate-pulse delay-150" />
                    </span>
                  </span>
                </>
              )}
            </button>
          </header>

          {/* Upper Title Block */}
          <div
            className={`absolute top-[8vh] sm:top-[10vh] left-0 right-0 z-20 flex flex-col items-center text-center px-4 pointer-events-none transition-all duration-300 ${
              isWarping ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="absolute -inset-6 bg-cyan-500/10 blur-2xl pointer-events-none rounded-full" />

            <h1 className="relative text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white select-none whitespace-nowrap drop-shadow-[0_0_35px_rgba(56,189,248,0.45)]">
              Rizwan{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-rose-300 bg-clip-text text-transparent">
                Malik
              </span>
            </h1>

            {/* Triad Disciplines */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cyan-200/90">
              <span className="text-rose-400">Visual Designer</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400">Full-Stack Developer</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">Growth Strategist</span>
            </div>
          </div>

          {/* Lower CTA Block: Bespoke Architectural Obsidian Glass Button */}
          <div
            className={`absolute bottom-[7vh] sm:bottom-[9vh] left-0 right-0 z-20 flex flex-col items-center text-center px-4 transition-all duration-300 ${
              isWarping ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            <button
              onClick={handleEnter}
              className="group relative inline-flex items-center gap-3.5 rounded-full px-7 sm:px-9 py-3 sm:py-3.5 bg-[#070a16]/85 hover:bg-[#0c1228]/95 border border-white/20 hover:border-cyan-400/70 shadow-[0_4px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(56,189,248,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer overflow-hidden"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>

              <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-[0.22em] uppercase text-slate-100 group-hover:text-white transition-colors">
                Enter Portfolio
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />

              <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
            </button>

            <p className="mt-3 text-[10px] font-mono tracking-widest uppercase text-slate-400">
              Move cursor to tilt 3D skill matrix • Press <span className="text-cyan-400 font-bold">[ Space ]</span> to enter
            </p>
          </div>

          {/* Bottom Telemetry Bar */}
          <footer
            className={`absolute bottom-5 sm:bottom-6 left-6 sm:left-10 right-6 sm:right-10 z-20 max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest transition-opacity duration-300 ${isWarping ? 'opacity-0' : 'opacity-100'
              }`}
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>3D TRINITY DISCIPLINE ENGINE // TERRAIN MATRIX</span>
            </span>
            <span className="hidden sm:inline">LAHORE, PK</span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
