import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, skillCategories } from '../../data/portfolioData';
import { soundManager } from '../../utils/audioFX';
import { Cpu, Sparkles } from 'lucide-react';

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const handleSelectCategory = (id) => {
    soundManager.playClick();
    setActiveCategory(id);
  };

  return (
    <section id="skills" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5" />
              Technical Competencies
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Skills & Tech Stack
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Over 4 years of hands-on expertise building scalable full-stack web platforms, mobile apps, and executing data-driven marketing.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-8">
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105'
                    : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filtered Grid View */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => soundManager.playHover()}
                className="group relative rounded-2xl border border-white/10 bg-[#0f1120]/80 p-5 backdrop-blur-md shadow-lg transition-all hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300">
                    {skill.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {skill.level}%
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {skill.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {skill.detail}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 shadow-[0_0_8px_#22d3ee] transition-all duration-700 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* GPU Compositor-Accelerated Infinite Marquee Ribbons */}
        <div className="overflow-hidden space-y-4 py-4 rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          {/* Top Marquee Ribbon */}
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-left flex gap-4">
              {[...skills, ...skills].map((skill, index) => (
                <div
                  key={`top-marquee-${index}`}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs text-slate-300 backdrop-blur-md whitespace-nowrap"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-slate-500 font-mono">({skill.level}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Marquee Ribbon (Reverse) */}
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-right flex gap-4">
              {[...skills.slice().reverse(), ...skills.slice().reverse()].map((skill, index) => (
                <div
                  key={`bot-marquee-${index}`}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs text-slate-300 backdrop-blur-md whitespace-nowrap"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-slate-500 font-mono">{skill.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
