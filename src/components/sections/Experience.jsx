import { motion } from 'framer-motion';
import { experiences } from '../../data/portfolioData';
import { Briefcase, Calendar, CheckCircle2, TrendingUp, Sparkles, Building2 } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#101222]/80 to-[#0a0a14]/90 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Left Column: Interactive Timeline */}
            <div className="lg:col-span-8">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                Work History & Leadership
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Building Products with Impact
              </h2>

              <div className="mt-10 space-y-8 relative before:absolute before:inset-0 before:left-3 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-cyan-400 before:to-transparent">
                {experiences.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="relative pl-10 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Glowing Timeline Dot */}
                    <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#0a0a14] bg-cyan-400 shadow-[0_0_12px_#22d3ee] group-hover:scale-125 transition-transform" />

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-[11px] font-mono text-violet-300">
                        {item.period}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-slate-400">
                        {item.roleType}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm font-semibold text-violet-300">
                      {item.company}
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                      {item.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Focus Overview Cards */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              <div className="rounded-3xl border border-white/10 bg-[#0c0d1c]/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Track Record</p>
                    <p className="text-base font-bold text-white">4+ Years Active</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Primary Focus</span>
                    <p className="text-sm font-semibold text-white mt-1">Design, Branding & Growth Marketing</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400">Technical Core</span>
                    <p className="text-sm font-semibold text-white mt-1">Full-Stack Web & C++ Software Logic</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400">Methodology</span>
                    <p className="text-sm font-semibold text-white mt-1">Iterative, Data-Driven, Pixel-Perfect</p>
                  </div>
                </div>
              </div>

              {/* Founder Tag Card */}
              <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-slate-950/80 p-6 backdrop-blur-xl">
                <p className="text-xs font-mono uppercase tracking-wider text-cyan-300">Entrepreneurial Journey</p>
                <p className="mt-2 text-sm text-slate-300">
                  Leading DigiServiceZone & ARService to bring modern software engineering and digital marketing under one unified vision.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
