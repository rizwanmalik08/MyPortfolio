import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ExternalLink, Mail, Phone, ChevronRight } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import rizwanPhoto from '../../assets/rizwan.jpg.png';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Section Kicker Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-violet-300 backdrop-blur-md shadow-[0_0_15px_rgba(124,58,237,0.2)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>{personalInfo.kicker}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h2 className="text-xl sm:text-2xl font-light text-slate-300 tracking-wide">
                Hi, I am
              </h2>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-none">
                {personalInfo.name}
              </h1>
              <span className="block text-3xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 via-cyan-300 to-white bg-clip-text text-transparent">
                {personalInfo.role}
              </span>
            </motion.div>

            {/* Short Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              {personalInfo.shortBio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] active:scale-[0.98]"
              >
                <span>View Projects</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>Contact Me</span>
              </a>
            </motion.div>

            {/* Pills / Quick Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2.5 pt-4 text-xs"
            >
              <span className="rounded-full border border-white/10 bg-slate-900/60 px-3.5 py-1.5 font-medium text-slate-300 backdrop-blur-sm">
                Graphic Design
              </span>
              <span className="rounded-full border border-white/10 bg-slate-900/60 px-3.5 py-1.5 font-medium text-slate-300 backdrop-blur-sm">
                Digital Marketing
              </span>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3.5 py-1.5 font-medium text-cyan-300 backdrop-blur-sm">
                Full-Stack Dev
              </span>
              <span className="rounded-full border border-violet-500/20 bg-violet-950/30 px-3.5 py-1.5 font-medium text-violet-300 backdrop-blur-sm">
                4+ Years Experience
              </span>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-400"
            >
              <div className="relative flex h-8 w-5 items-start justify-center rounded-full border border-white/30 p-1">
                <motion.div
                  className="h-1.5 w-1 rounded-full bg-cyan-400"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                />
              </div>
              <span>Scroll to explore 3D world</span>
            </motion.div>
          </div>

          {/* Right Column: Hero Portrait Hologram */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
            >
              {/* Outer Ambient Glow Rings */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-violet-600/30 via-cyan-500/20 to-pink-500/20 blur-2xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] animate-spin" style={{ animationDuration: '30s' }} />

              {/* Portrait Image Container */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/20 bg-slate-900/60 p-2 backdrop-blur-md shadow-2xl">
                <img
                  src={rizwanPhoto}
                  alt="Rizwan portrait"
                  className="h-full w-full rounded-full object-cover shadow-inner"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#0a0a14]/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Status Glass Badge */}
              <motion.div
                className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-4 rounded-2xl border border-white/20 bg-slate-900/85 p-3.5 backdrop-blur-xl shadow-xl flex items-center gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <div className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Available for Work
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Full-Stack & Design
                  </p>
                </div>
              </motion.div>

              {/* Floating Stat Badge */}
              <motion.div
                className="absolute -top-2 -right-2 sm:top-4 sm:-right-4 rounded-2xl border border-white/20 bg-slate-900/85 p-3.5 backdrop-blur-xl shadow-xl text-center"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              >
                <span className="block text-lg font-bold text-cyan-400">4+</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  Years Exp
                </span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
