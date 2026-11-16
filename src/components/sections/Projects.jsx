import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects, stats } from '../../data/portfolioData';
import { ProjectModal } from '../ui/ProjectModal';
import { StatCounter } from '../ui/StatCounter';
import { TiltCard } from '../ui/TiltCard';
import { soundManager } from '../../utils/audioFX';
import { Star, Eye, Users, FolderCheck, Award, Clock, ArrowUpRight, Sparkles } from 'lucide-react';

export function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const statIcons = {
    Users: Users,
    FolderCheck: FolderCheck,
    Award: Award,
    Clock: Clock,
  };

  const handleOpenProject = (project) => {
    soundManager.playClick();
    setSelectedProject(project);
  };

  return (
    <section id="projects" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Selected Works & Case Studies
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Projects & Client Results
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Interactive 3D case studies, custom web applications, and scalable brand campaigns for leading businesses.
          </p>
        </div>

        {/* 3D Tilt Project Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const isFeatured = project.featured;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <TiltCard
                  className={`h-full flex flex-col p-6 sm:p-7 ${
                    isFeatured
                      ? 'border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.18)]'
                      : ''
                  }`}
                  glowColor={isFeatured ? 'rgba(244, 63, 94, 0.15)' : 'rgba(34, 211, 238, 0.15)'}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-4 right-6 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-500/30 z-20">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Featured Client</span>
                    </div>
                  )}

                  {/* Card Image Showcase */}
                  <div
                    className="relative mb-6 aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900 group"
                    onClick={() => handleOpenProject(project)}
                  >
                    <img
                      src={project.image}
                      alt={project.clientName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-60" />
                    
                    {/* Hover Inspect Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40 backdrop-blur-xs">
                      <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        <Eye className="h-4 w-4" />
                        View Details
                      </span>
                    </div>

                    {/* Monogram Badge */}
                    <div
                      className={`absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs text-white border border-white/20 shadow-lg ${
                        isFeatured ? 'bg-rose-500' : 'bg-violet-600'
                      }`}
                    >
                      {project.badge}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {project.clientName}
                        </h3>
                        <span className="text-xs font-mono text-cyan-400">
                          {project.role}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {project.company}
                      </p>

                      <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        "{project.review}"
                      </p>

                      {/* Tags */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleOpenProject(project)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
                      >
                        <span>Case Study</span>
                      </button>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => soundManager.playClick()}
                        className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition ${
                          isFeatured
                            ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 shadow-md shadow-rose-500/30'
                            : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90'
                        }`}
                      >
                        <span>Live</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Animated Statistics Banner */}
        <motion.div
          className="mt-20 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#101124] via-[#0d0e1e] to-[#101124] p-8 sm:p-10 backdrop-blur-2xl shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((s, index) => {
              const IconComponent = statIcons[s.icon] || Star;
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 ${
                    index > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-white">
                      <StatCounter value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-mono mt-0.5">
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Project Detail Modal Dialog */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
