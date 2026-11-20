import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialMediaProjects, socialMediaCategories } from '../../data/portfolioData';
import { ProjectModal } from '../ui/ProjectModal';
import { TiltCard } from '../ui/TiltCard';
import { StatCounter } from '../ui/StatCounter';
import { soundManager } from '../../utils/audioFX';
import {
  Share2,
  TrendingUp,
  Sparkles,
  Eye,
  ArrowUpRight,
  Target,
  BarChart3,
  Flame,
  Layers,
  Zap,
  Users,
  Maximize2
} from 'lucide-react';

export function SocialMediaMarketing() {
  const [selectedProject, setSelectedProject] = useState(null);

  const marketingStats = [
    {
      label: 'Total Reach Generated',
      num: 500,
      suffix: 'K+',
      icon: TrendingUp,
      sub: 'Audience across Meta & Instagram campaigns'
    },
    {
      label: 'Average Campaign ROAS',
      num: 3.8,
      decimals: 1,
      suffix: 'x',
      icon: Target,
      sub: 'Blended return on advertising spend'
    },
    {
      label: 'Avg Engagement Lift',
      num: 240,
      prefix: '+',
      suffix: '%',
      icon: Zap,
      sub: 'Organic & community interaction rate'
    },
    {
      label: 'Ad Creatives Deployed',
      num: 120,
      suffix: '+',
      icon: BarChart3,
      sub: 'High-converting A/B tested creative assets'
    },
  ];

  const handleOpenProject = (project) => {
    soundManager.playClick();
    setSelectedProject(project);
  };

  return (
    <section id="social-media" className="relative py-24 z-10 scroll-mt-20">
      <div id="projects" className="absolute -top-24" />
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-1/3 left-1/3 -z-10 h-80 w-80 rounded-full bg-emerald-600/10 blur-[110px]" />

      <div className="container mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2">
            <Share2 className="h-3.5 w-3.5" />
            Social Media Marketing &amp; Client Results
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Social Campaigns &amp; Clients
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            High-converting social campaigns, B2B lead generation, and brand growth strategies for leading client accounts.
          </p>
        </div>

        {/* Clean Editorial KPI Metrics Strip */}
        <motion.div
          className="mb-16 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
            {marketingStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  onMouseEnter={() => soundManager.playHover()}
                  className="group relative p-6 sm:p-7 transition-colors duration-300 hover:bg-white/[0.02] flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Label & Clean Icon */}
                    <div className="flex items-center justify-between mb-3 text-slate-400">
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] font-medium group-hover:text-slate-300 transition-colors">
                        {stat.label}
                      </span>
                      <Icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
                    </div>

                    {/* High-Contrast Bold Number */}
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-300">
                      <StatCounter
                        value={stat.num}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                        duration={1.8}
                      />
                    </div>
                  </div>

                  {/* Clean Human Contextual Note */}
                  <p className="mt-3 text-xs text-slate-400 font-normal leading-relaxed">
                    {stat.sub}
                  </p>

                  {/* Hairline subtle accent underline on hover */}
                  <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-emerald-400/0 group-hover:bg-emerald-400/50 transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Campaigns Grid (3 Authentic Clients) */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {socialMediaProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <TiltCard className="h-full">
                  <div className="relative flex flex-col h-full rounded-3xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] group">

                    {/* Visual Showcase (Client Brand or Campaign Creative) */}
                    <div
                      onClick={() => handleOpenProject(project)}
                      className="relative w-full aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 cursor-pointer flex items-center justify-center p-3"
                    >
                      {project.category === 'clients' ? (
                        /* Clean Brand Emblem Card */
                        <div className="w-full h-full rounded-xl bg-white p-6 flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-105">
                          <img
                            src={project.image}
                            alt={project.clientName}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        /* High-Res Campaign Post */
                        <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-950">
                          <img
                            src={project.image}
                            alt={project.clientName}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                        </div>
                      )}

                      {/* Clean Platform Pill */}
                      {project.platform && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-sm">
                          <Share2 className="h-3 w-3 text-emerald-400" />
                          <span>{project.platform}</span>
                        </div>
                      )}

                      {/* Hover Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>View Details</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-col flex-grow mt-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {project.clientName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-400">
                            <span className="text-slate-300 font-medium">{project.company}</span>
                            <span>•</span>
                            <span className="text-emerald-400 text-xs">{project.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Review / Strategy Quote */}
                      {project.review && (
                        <p className="mt-3 text-xs italic text-slate-300 line-clamp-2">
                          "{project.review}"
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleOpenProject(project)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                          <span>View Details</span>
                        </button>

                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-all"
                          >
                            <span>{project.category === 'clients' ? 'Visit Page' : 'Live Post'}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default SocialMediaMarketing;
