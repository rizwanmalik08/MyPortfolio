import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, ChevronRight, Terminal, ArrowDown, Code2, Palette, Globe, TrendingUp, Cpu } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { soundManager } from '../../utils/audioFX';
import { AvatarPortal } from '../avatar/AvatarPortal';

// Dynamic rotating roles with distinct gradient colors
const ROLES = [
  { title: 'Visual Designer', gradient: 'from-violet-400 via-purple-300 to-indigo-300' },
  { title: 'Full-Stack Developer', gradient: 'from-cyan-300 via-sky-300 to-teal-200' },
  { title: '3D Web Experience Architect', gradient: 'from-pink-400 via-rose-300 to-amber-300' },
  { title: 'Digital Growth Marketer', gradient: 'from-emerald-300 via-teal-300 to-cyan-300' },
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  // Cycle roles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      
      {/* Ambient Cyber Grid & Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Cyber Status Ticker & Terminal Initializer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-3"
            >
              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/40 bg-cyan-950/30 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span>SYSTEM ONLINE // AVAILABLE 2026</span>
              </div>

              {/* Terminal Code Command */}
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-violet-400" />
                <span>rizwan.init(--interactive)</span>
              </div>
            </motion.div>

            {/* Main Headline with Neon Kinetics */}
            <div className="space-y-3">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg sm:text-2xl font-light text-slate-300 tracking-wide flex items-center gap-3"
              >
                <span>Hi, I am</span>
                <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-violet-500 to-transparent"></span>
              </motion.h2>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none"
              >
                <span className="relative inline-block">
                  {personalInfo.name}
                  {/* Subtle neon glow text reflection */}
                  <span className="absolute -inset-1 blur-2xl opacity-30 bg-gradient-to-r from-violet-600 via-cyan-400 to-pink-500 -z-10"></span>
                </span>
              </motion.h1>

              {/* Dynamic Rotating Role Switcher */}
              <div className="h-12 sm:h-14 overflow-hidden flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ROLES[roleIndex].title}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r ${ROLES[roleIndex].gradient} bg-clip-text text-transparent flex items-center gap-2`}
                  >
                    <span>{ROLES[roleIndex].title}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Short Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              {personalInfo.shortBio}
            </motion.p>

            {/* Action Buttons with Animated Border-Beam & Micro-Sounds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Primary Glowing Action Button */}
              <a
                href="#projects"
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playWarp()}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full p-[2px] shadow-[0_0_35px_rgba(124,58,237,0.45)] transition hover:scale-[1.03] active:scale-[0.98]"
              >
                {/* Rotating Animated Gradient Border Beam */}
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7c3aed_0%,#22d3ee_50%,#f43f5e_100%)]" />

                {/* Inner Button Surface */}
                <span className="inline-flex h-full w-full items-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-3xl transition duration-300 group-hover:bg-slate-900/90">
                  <Sparkles className="h-4 w-4 text-cyan-400 transition-transform group-hover:rotate-12" />
                  <span>Explore 3D Projects</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              {/* Secondary Glassmorphism Button */}
              <a
                href="#contact"
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] active:scale-[0.98]"
              >
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>Get in Touch</span>
              </a>
            </motion.div>

            {/* Interactive Tech Capability Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-2.5 pt-4 text-xs font-mono"
            >
              <div
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-105 cursor-default"
              >
                <Palette className="h-3.5 w-3.5 text-pink-400" />
                <span>Graphic & UI/UX</span>
              </div>

              <div
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-105 cursor-default"
              >
                <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Full-Stack Web</span>
              </div>

              <div
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-105 cursor-default"
              >
                <Globe className="h-3.5 w-3.5 text-violet-400" />
                <span>3D WebGL / Three.js</span>
              </div>

              <div
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-105 cursor-default"
              >
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>SEO & Digital Growth</span>
              </div>

              <div
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:text-cyan-300 hover:scale-105 cursor-default"
              >
                <Cpu className="h-3.5 w-3.5 text-amber-400" />
                <span>4+ Years Exp</span>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-2 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-400"
            >
              <div className="relative flex h-8 w-5 items-start justify-center rounded-full border border-white/30 p-1">
                <motion.div
                  className="h-1.5 w-1 rounded-full bg-cyan-400"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                />
              </div>
              <span className="font-mono text-[11px]">SCROLL TO NAVIGATE 3D SPACE</span>
            </motion.div>
          </div>

          {/* Right Column: Holographic Cyber Avatar Console */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <AvatarPortal />
          </div>

        </div>
      </div>
    </section>
  );
}
