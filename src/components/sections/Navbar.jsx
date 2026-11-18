import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, personalInfo } from '../../data/portfolioData';
import { soundManager } from '../../utils/audioFX';
import { Menu, X, Download, Sparkles, Volume2, VolumeX } from 'lucide-react';

export function Navbar({ activeSection = 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(soundManager.isSoundEnabled());

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundActive(newState);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-300">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-[#0a0a14]/80 px-5 py-2.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Logo & Brand Signature */}
          <a
            href="#home"
            onMouseEnter={() => soundManager.playHover()}
            onClick={() => soundManager.playClick()}
            className="group flex items-center gap-3 text-base font-bold tracking-tight text-white shrink-0"
          >
            {/* Custom Designer Monogram Icon */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-[#0d1024] to-slate-950 border border-white/15 p-1.5 shadow-[0_0_18px_rgba(56,189,248,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_24px_rgba(124,58,237,0.45)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="navbarBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="55%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path
                  d="M4.5 4C4.5 3.17 5.17 2.5 6 2.5H13C16.59 2.5 19.5 5.41 19.5 9C19.5 11.96 17.52 14.47 14.8 15.26L19.42 21.04C19.88 21.61 19.47 22.5 18.74 22.5H15.18C14.75 22.5 14.35 22.3 14.1 21.95L9.5 15.5H7.5V21.5C7.5 22.05 7.05 22.5 6.5 22.5H5.5C4.95 22.5 4.5 22.05 4.5 21.5V4ZM7.5 5.5V12.5H13C14.93 12.5 16.5 10.93 16.5 9C16.5 7.07 14.93 5.5 13 5.5H7.5Z"
                  fill="url(#navbarBrandGrad)"
                />
              </svg>
            </div>

            {/* Typography Signature */}
            <div className="flex flex-col text-left leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Rizwan
                </span>
                <span className="text-[15px] font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400">
                  Malik
                </span>
                <span className="relative flex h-2 w-2 ml-0.5" title="Available for work">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-[0.16em] uppercase text-slate-400 group-hover:text-slate-300 transition-colors mt-1">
                Visual Designer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => soundManager.playHover()}
                  onClick={() => soundManager.playClick()}
                  className={`relative px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/30 to-cyan-500/30 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio FX Toggle */}
            <button
              onClick={handleToggleSound}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                soundActive
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'border-white/10 bg-white/5 text-slate-500 hover:text-white'
              }`}
              title={soundActive ? 'Mute Sound FX' : 'Enable Sound FX'}
              aria-label="Toggle Sound Effects"
            >
              {soundActive ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {/* CV Download Button */}
            <a
              href={personalInfo.cvUrl}
              download="Rizwan_Malik_CV.pdf"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>CV</span>
            </a>

            {/* Contact CTA */}
            <a
              href="#contact"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition hover:opacity-95 hover:scale-[1.02]"
            >
              <Sparkles className="h-3 w-3" />
              <span>Let's Talk</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileOpen(!mobileOpen);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 xl:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a14]/95 p-6 backdrop-blur-2xl shadow-2xl xl:hidden"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      soundManager.playClick();
                      setMobileOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </a>
                );
              })}
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                <a
                  href={personalInfo.cvUrl}
                  download="Rizwan_Malik_CV.pdf"
                  className="flex-1 text-center py-2.5 rounded-xl border border-white/20 bg-white/5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Download CV
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
