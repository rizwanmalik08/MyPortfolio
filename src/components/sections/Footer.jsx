import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Sparkles,
  Radio,
  Mail,
  Terminal,
  ShieldCheck,
  Zap,
  Globe,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo, navLinks } from '../../data/portfolioData';
import { soundManager } from '../../utils/audioFX';

export function Footer() {
  const [copiedField, setCopiedField] = useState(null);
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState('idle'); // 'idle' | 'transmitting' | 'subscribed'

  const handleScrollTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (text, fieldName) => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!dispatchEmail) return;

    soundManager.playClick();
    setDispatchStatus('transmitting');

    setTimeout(() => {
      setDispatchStatus('subscribed');
      soundManager.playHover();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.9 },
          colors: ['#38bdf8', '#818cf8', '#c084fc', '#34d399']
        });
      } catch (_) {}
    }, 800);
  };

  const capabilities = [
    { title: 'Full-Stack Web Dev', tag: 'React / Next.js / Node' },
    { title: 'UI/UX Design Systems', tag: 'Figma / Micro-Interactions' },
    { title: 'Immersive 3D & WebGL', tag: 'Three.js / Shaders / R3F' },
    { title: 'SEO & Growth Strategy', tag: 'Data / CRO / Organic' },
    { title: 'Brand Identity Design', tag: 'Vector / Art Direction' },
    { title: 'Video Post-Production', tag: 'After Effects / Motion' },
    { title: 'C++ Desktop Solutions', tag: 'High-Performance Logic' },
    { title: 'Cross-Platform Mobile', tag: 'React Native / Flutter' },
  ];

  const marqueeItems = [
    'IMMERSIVE 3D WEBGL',
    'HIGH-VELOCITY FULL-STACK',
    'BESPOKE VISUAL IDENTITY',
    'CONVERSION-LED UI/UX',
    'DIGITAL GROWTH & SEO',
    'C++ COMPUTATION',
    'INTERACTIVE MOTION DESIGN',
    'CROSS-PLATFORM ARCHITECTURES',
  ];

  return (
    <footer className="relative border-t border-cyan-500/20 bg-[#04050b] pt-0 pb-12 z-10 backdrop-blur-2xl overflow-hidden">
      {/* Top Laser Accent Beam */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="absolute top-0 left-1/4 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent blur-sm" />

      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/5 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-80 w-80 rounded-full bg-teal-500/5 blur-[120px]" />

      {/* =========================================================================
          1. KINETIC MARQUEE RUNNER (TOP INFINITE RIBBON)
          ========================================================================= */}
      <div className="relative border-b border-white/5 bg-white/[0.015] py-3.5 overflow-hidden select-none">
        <div className="flex animate-marquee-left whitespace-nowrap">
          {/* Track 1 */}
          <div className="flex items-center gap-8 px-4">
            {marqueeItems.map((item, idx) => (
              <span key={`t1-${idx}`} className="flex items-center gap-8 text-[11px] font-mono tracking-[0.25em] text-slate-400/80 uppercase">
                <span className="text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]">✦</span>
                <span className="hover:text-cyan-300 transition-colors">{item}</span>
              </span>
            ))}
          </div>
          {/* Track 2 (Seamless loop duplicate) */}
          <div className="flex items-center gap-8 px-4" aria-hidden="true">
            {marqueeItems.map((item, idx) => (
              <span key={`t2-${idx}`} className="flex items-center gap-8 text-[11px] font-mono tracking-[0.25em] text-slate-400/80 uppercase">
                <span className="text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]">✦</span>
                <span className="hover:text-cyan-300 transition-colors">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. KINETIC AUDIO EQUALIZER & LIVE TELEMETRY BAR
          ========================================================================= */}
      <div className="border-b border-white/5 bg-slate-950/40 px-6 py-2.5">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-slate-400">
          
          {/* Left: Animated Audio Equalizer Visualizer */}
          <div
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center gap-3 cursor-pointer group"
            title="Interactive Telemetry Equalizer"
          >
            <div className="flex items-end gap-1 h-4 w-12 px-1 rounded bg-black/40 border border-white/10 group-hover:border-cyan-400/40 transition">
              <span className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-full animate-eq-1" />
              <span className="w-1 bg-gradient-to-t from-cyan-400 to-indigo-300 rounded-full animate-eq-2" />
              <span className="w-1 bg-gradient-to-t from-indigo-400 to-violet-300 rounded-full animate-eq-3" />
              <span className="w-1 bg-gradient-to-t from-violet-400 to-purple-300 rounded-full animate-eq-4" />
              <span className="w-1 bg-gradient-to-t from-cyan-400 to-teal-300 rounded-full animate-eq-2" />
              <span className="w-1 bg-gradient-to-t from-cyan-300 to-cyan-100 rounded-full animate-eq-1" />
            </div>
            <span className="tracking-widest text-slate-300 group-hover:text-cyan-300 transition">
              TELEMETRY FREQ // 48.0 kHz
            </span>
          </div>

          {/* Center: System Telemetry Badges */}
          <div className="hidden md:flex items-center gap-6 text-[10px] tracking-wider text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM OPERATIONAL
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
              SHA-256 ENCRYPTED
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-violet-400" />
              NODE: LAHORE // 31.5°N
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Zap className="h-3 w-3 text-amber-400" />
              LATENCY: 12ms
            </span>
          </div>

          {/* Right: Quick Direct Action */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 tracking-wider">DIRECT DISPATCH:</span>
            <a
              href={personalInfo.whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/20 transition"
            >
              <MessageSquare className="h-2.5 w-2.5" />
              <span>WHATSAPP HQ</span>
            </a>
          </div>

        </div>
      </div>

      {/* =========================================================================
          3. MAIN 4-COLUMN ARCHITECTURAL GRID
          ========================================================================= */}
      <div className="container mx-auto max-w-7xl px-6 pt-14 pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 text-sm text-slate-400">

          {/* -------------------------------------------------------------------
              COLUMN 1: EXECUTIVE IDENTITY & ORBITAL MONOGRAM (Span 4)
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Identity Header */}
            <div className="flex items-center gap-3.5">
              {/* Orbital Monogram Emblem */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                {/* Outer Rotating Dashed Orbital Ring */}
                <svg className="absolute inset-0 h-full w-full animate-spin-slow pointer-events-none" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    opacity="0.6"
                  />
                </svg>

                {/* Inner Counter-Rotating Ring */}
                <svg className="absolute inset-1.5 h-[36px] w-[36px] animate-spin-reverse-slow pointer-events-none" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    opacity="0.4"
                  />
                </svg>

                {/* Central Glass Squircle */}
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-slate-950/90 shadow-[0_0_20px_rgba(56,189,248,0.4)] backdrop-blur-md">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="footerOrbitalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M4.5 4C4.5 3.17 5.17 2.5 6 2.5H13C16.59 2.5 19.5 5.41 19.5 9C19.5 11.96 17.52 14.47 14.8 15.26L19.42 21.04C19.88 21.61 19.47 22.5 18.74 22.5H15.18C14.75 22.5 14.35 22.3 14.1 21.95L9.5 15.5H7.5V21.5C7.5 22.05 7.05 22.5 6.5 22.5H5.5C4.95 22.5 4.5 22.05 4.5 21.5V4ZM7.5 5.5V12.5H13C14.93 12.5 16.5 10.93 16.5 9C16.5 7.07 14.93 5.5 13 5.5H7.5Z"
                      fill="url(#footerOrbitalGrad)"
                    />
                  </svg>
                </div>
              </div>

              {/* Title & Name */}
              <div>
                <h3 className="text-xl font-black tracking-tight text-white leading-none">
                  Rizwan <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">Malik</span>
                </h3>
                <p className="mt-1 text-[11px] font-mono tracking-wider text-slate-400 uppercase">
                  Visual Designer & Full-Stack Engineer
                </p>
              </div>
            </div>

            {/* Architectural Value Proposition */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Engineering high-velocity web platforms, memorable brand identities, and immersive 3D digital experiences at the intersection of design and technical execution.
            </p>

            {/* Live Contract Availability Indicator */}
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-xs font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] tracking-wide">AVAILABLE FOR WORLDWIDE REMOTE CONTRACTS</span>
            </div>

            {/* Quick Fast-Contact Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(personalInfo.email, 'email')}
                onMouseEnter={() => soundManager.playHover()}
                className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white transition"
              >
                <Mail className="h-3 w-3 text-cyan-400" />
                <span>{personalInfo.email}</span>
                {copiedField === 'email' ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-slate-500 group-hover:text-cyan-400 transition" />
                )}
              </button>

              <a
                href={personalInfo.whatsappLink}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white transition"
              >
                <MessageSquare className="h-3 w-3 text-emerald-400" />
                <span>WhatsApp Instant</span>
                <ArrowUpRight className="h-2.5 w-2.5 text-slate-500" />
              </a>
            </div>

          </div>

          {/* -------------------------------------------------------------------
              COLUMN 2: ARCHITECTURAL INDEX (NAVIGATION) (Span 2)
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                Index
              </p>
            </div>

            <ul className="space-y-2.5 text-xs font-mono">
              {navLinks.map((link, idx) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onMouseEnter={() => soundManager.playHover()}
                    onClick={() => soundManager.playClick()}
                    className="group flex items-center justify-between text-slate-400 hover:text-cyan-300 transition-colors py-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-600 group-hover:text-cyan-400/80 transition-colors">
                        0{idx + 1}
                      </span>
                      <span>{link.label}</span>
                    </span>
                    <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 3: CORE CAPABILITIES MATRIX (Span 3)
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                Capabilities
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {capabilities.map((item) => (
                <div
                  key={item.title}
                  onMouseEnter={() => soundManager.playHover()}
                  className="group rounded-xl border border-white/5 bg-slate-900/40 p-2 hover:border-violet-500/30 hover:bg-slate-900/80 transition-all duration-200 cursor-default"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                      {item.title}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-600 group-hover:bg-violet-400 transition-colors" />
                  </div>
                  <p className="mt-0.5 text-[10px] font-mono text-slate-500 group-hover:text-cyan-400/80 transition-colors">
                    {item.tag}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 4: PRIVATE DISPATCH TERMINAL (Span 3)
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                Private Dispatch
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Curated architectural insights on WebGL engineering, 3D design systems, and conversion-focused growth.
            </p>

            {/* Futuristic Terminal Box */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-white/5 pb-2">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Terminal className="h-3 w-3" />
                  <span>TRANSMISSION TERMINAL</span>
                </span>
                <span>STATUS: {dispatchStatus.toUpperCase()}</span>
              </div>

              {dispatchStatus === 'subscribed' ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-center space-y-1">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-mono font-bold text-white">
                    TRANSMISSION REGISTERED
                  </p>
                  <p className="text-[10px] text-emerald-300/80 font-mono">
                    Welcome aboard. Intelligence briefings incoming.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDispatchSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={dispatchEmail}
                      onChange={(e) => setDispatchEmail(e.target.value)}
                      onFocus={() => soundManager.playHover()}
                      placeholder="client@enterprise.com"
                      disabled={dispatchStatus === 'transmitting'}
                      className="w-full rounded-xl border border-white/10 bg-[#060814] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={dispatchStatus === 'transmitting'}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full group/btn relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {dispatchStatus === 'transmitting' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>ENCRYPTING PACKET...</span>
                      </span>
                    ) : (
                      <>
                        <span>JOIN DISPATCH</span>
                        <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[10px] font-mono text-slate-500 text-center">
                Encrypted distribution • No spam • Zero noise
              </p>
            </div>

          </div>

        </div>

        {/* =========================================================================
            4. BOTTOM HORIZON & UTILITY TELEMETRY DOCK
            ========================================================================= */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          {/* Left: Copyright & Technical Architecture Credits */}
          <div className="space-y-1 text-center md:text-left">
            <p className="text-slate-400 font-mono text-[11px]">
              © 2026 {personalInfo.fullName}. All systems operational.
            </p>
            <p className="text-[10px] text-slate-600 font-mono tracking-wider">
              BUILT WITH REACT 19 • THREE.JS / WEBGL • TAILWIND CSS • FRAMER MOTION
            </p>
          </div>

          {/* Center: Social Holographic Matrix */}
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href={personalInfo.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white hover:scale-105 transition-all shadow-sm"
              aria-label="GitHub"
              title="GitHub Profile"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={personalInfo.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white hover:scale-105 transition-all shadow-sm"
              aria-label="LinkedIn"
              title="LinkedIn Profile"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* X (formerly Twitter) */}
            <a
              href={personalInfo.socialLinks.x}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white hover:scale-105 transition-all shadow-sm"
              aria-label="X (formerly Twitter)"
              title="X Profile"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* WhatsApp Direct */}
            <a
              href={personalInfo.whatsappLink}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300 hover:scale-105 transition-all shadow-sm"
              aria-label="WhatsApp"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>

          {/* Right: Kinetic "Ascend to Orbit" Trigger */}
          <button
            type="button"
            onClick={handleScrollTop}
            onMouseEnter={() => soundManager.playHover()}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white transition-all shadow-sm"
          >
            <span className="text-[11px] tracking-widest">RETURN TO ORBIT</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black group-hover:-translate-y-0.5 transition-all">
              <ArrowUp className="h-3 w-3" />
            </div>
          </button>

        </div>

      </div>
    </footer>
  );
}
