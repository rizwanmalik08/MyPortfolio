import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../../data/portfolioData';
import { soundManager } from '../../utils/audioFX';
import {
  Briefcase,
  Building2,
  Sparkles,
  Code2,
  TrendingUp,
  Globe2,
  Terminal,
  CheckCircle2,
  ArrowUpRight,
  Cpu,
  Layers,
  Award
} from 'lucide-react';

// Categories for interactive filtering
const CATEGORIES = [
  { id: 'all', label: 'All Ventures' },
  { id: 'agency', label: 'Agency & Leadership' },
  { id: 'software', label: 'Software & Systems' },
  { id: 'freelance', label: 'Creative & Dev' },
];

// Rich styling metadata per experience
const EXPERIENCE_METADATA = {
  'DigiServiceZone': {
    category: 'agency',
    accentColor: 'from-cyan-500 via-sky-400 to-blue-500',
    borderColor: 'border-cyan-500/30 group-hover:border-cyan-400/60',
    glowColor: 'bg-cyan-500/15',
    tagBg: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30',
    icon: Building2,
    badge: 'AGENCY LEADERSHIP',
    stat: '100+ Campaigns Scaled',
    tags: ['Brand Strategy', 'Technical SEO', 'React Platforms', 'Growth Marketing'],
  },
  'ARService': {
    category: 'software',
    accentColor: 'from-violet-500 via-purple-400 to-indigo-500',
    borderColor: 'border-violet-500/30 group-hover:border-violet-400/60',
    glowColor: 'bg-violet-600/15',
    tagBg: 'bg-violet-950/40 text-violet-300 border-violet-500/30',
    icon: Cpu,
    badge: 'TECHNICAL SOLUTIONS',
    stat: 'High-Performance Logic',
    tags: ['C++ 20 Systems', 'Python Automation', 'Desktop Utilities', 'Performance Audits'],
  },
  'Independent Practice': {
    category: 'freelance',
    accentColor: 'from-emerald-400 via-teal-400 to-cyan-500',
    borderColor: 'border-emerald-500/30 group-hover:border-emerald-400/60',
    glowColor: 'bg-emerald-500/15',
    tagBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
    icon: Globe2,
    badge: 'GLOBAL CLIENT DELIVERY',
    stat: '100+ Projects Shipped',
    tags: ['Figma Design Systems', 'Full-Stack Web', 'Brand Identity', 'Motion Creative'],
  }
};

export function Experience() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredExperiences = experiences.filter((exp) => {
    if (activeCategory === 'all') return true;
    const meta = EXPERIENCE_METADATA[exp.company];
    return meta?.category === activeCategory;
  });

  const handleTabClick = (catId) => {
    soundManager.playClick();
    setActiveCategory(catId);
  };

  return (
    <section id="experience" className="relative py-28 z-10 overflow-hidden">
      {/* Background Volumetric Glows */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/30 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Career Milestones & Ventures</span>
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Proven Track Record of <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">Impact</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-400 max-w-md leading-relaxed font-light">
            Founded agencies, engineered custom software, and delivered 100+ creative and technical projects across international client markets.
          </p>
        </div>

        {/* Interactive Milestone Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                onMouseEnter={() => soundManager.playHover()}
                className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                    : 'text-slate-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeExperienceTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-300 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Experience Bento Cards Grid */}
        <motion.div layout className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Main Milestones Stream */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredExperiences.map((exp, idx) => {
                const meta = EXPERIENCE_METADATA[exp.company] || {
                  accentColor: 'from-cyan-500 to-violet-500',
                  borderColor: 'border-white/15',
                  glowColor: 'bg-cyan-500/10',
                  tagBg: 'bg-white/5 text-slate-300 border-white/10',
                  icon: Briefcase,
                  badge: 'EXPERIENCE',
                  stat: 'Active Role',
                  tags: []
                };
                const IconComponent = meta.icon;

                return (
                  <motion.div
                    key={exp.title + exp.company}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-b from-[#0e101f]/90 to-[#070810]/95 p-7 sm:p-9 backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl ${meta.borderColor}`}
                  >
                    {/* Corner Accent Glow */}
                    <div className={`pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full ${meta.glowColor} blur-[90px] group-hover:scale-125 transition-transform duration-500`} />

                    {/* Top Row: Period, Role Type, and Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        {/* Custom Venture Icon */}
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accentColor} p-2.5 shadow-lg text-white shadow-cyan-500/20`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                            {meta.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                            {exp.company}
                          </h3>
                        </div>
                      </div>

                      {/* Period Pill with Pulse */}
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono text-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    {/* Middle: Role Title & Highlights */}
                    <div className="mt-5 space-y-3">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{exp.title}</span>
                        <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </h4>

                      <ul className="space-y-2.5 text-sm text-slate-300 leading-relaxed font-light">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Interactive Capability Tags */}
                    {meta.tags && meta.tags.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
                        {meta.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-mono tracking-wider ${meta.tagBg}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Column: High-Impact Overview & Career Metrics Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Metrics Hero Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f1122]/90 to-[#070812]/95 p-7 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Career Overview</span>
                  <p className="text-xl font-black text-white">4+ Years Active</p>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="mt-5 space-y-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Ventures Led</span>
                  <span className="text-base font-bold text-cyan-300 font-mono">3 Entities</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Client Projects</span>
                  <span className="text-base font-bold text-violet-300 font-mono">100+ Shipped</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Client Satisfaction</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">100% Rate</span>
                </div>
              </div>
            </div>

            {/* Entrepreneurial Vision Card */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-violet-950/30 p-7 backdrop-blur-2xl shadow-xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 blur-[60px] pointer-events-none" />
              
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                <Sparkles className="h-4 w-4" />
                <span>Founding Philosophy</span>
              </div>

              <h4 className="mt-3 text-lg font-bold text-white">
                Bridging Design & Engineering
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Leading <strong className="text-white font-semibold">DigiServiceZone</strong> & <strong className="text-white font-semibold">ARService</strong> to unify creative brand direction, technical software engineering, and high-ROI growth marketing under a single cohesive execution.
              </p>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}