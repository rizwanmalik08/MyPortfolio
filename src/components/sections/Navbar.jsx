import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, personalInfo } from '../../data/portfolioData';
import { Menu, X, Download, Sparkles } from 'lucide-react';

export function Navbar({ activeSection = 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-300">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-[#0a0a14]/75 px-5 py-2.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <a
            href="#home"
            className="group flex items-center gap-2 text-base font-bold tracking-tight text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] transition group-hover:scale-105">
              R
            </div>
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {personalInfo.name}
            </span>
            <span className="hidden sm:inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
              3D
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white'
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

          {/* Right Action CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={personalInfo.cvUrl}
              download="Rizwan_Malik_CV.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>CV</span>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition hover:opacity-95 hover:scale-[1.02]"
            >
              <Sparkles className="h-3 w-3" />
              <span>Let's Talk</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
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
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a14]/95 p-6 backdrop-blur-2xl shadow-2xl lg:hidden"
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
                    onClick={() => setMobileOpen(false)}
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
