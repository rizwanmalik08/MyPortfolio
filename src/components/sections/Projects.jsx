import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, projectCategories, stats } from '../../data/portfolioData';
import { ProjectModal } from '../ui/ProjectModal';
import { StatCounter } from '../ui/StatCounter';
import { TiltCard } from '../ui/TiltCard';
import { soundManager } from '../../utils/audioFX';
import { 
  Star, 
  Eye, 
  Users, 
  FolderCheck, 
  Award, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  Globe, 
  Palette, 
  TrendingUp, 
  LayoutGrid,
  Layers
} from 'lucide-react';

export function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const statIcons = {
    Users: Users,
    FolderCheck: FolderCheck,
    Award: Award,
    Clock: Clock,
  };

  const categoryIcons = {
    all: LayoutGrid,
    web: Globe,
    graphics: Palette,
    marketing: TrendingUp,
  };

  const handleOpenProject = (project) => {
    soundManager.playClick();
    setSelectedProject(project);
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Selected Works &amp; Case Studies
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Projects &amp; Client Results
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Interactive 3D case studies, live web applications, and high-impact social media post graphics for leading businesses.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {projectCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || LayoutGrid;
            const isActive = activeCategory === cat.id;
            const count = cat.id === 'all' 
              ? projects.length 
              : projects.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/10 hover:border-white/20'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeProjectCategory"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-mono ${
                    isActive
                      ? 'bg-black/30 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3D Tilt Project Cards Grid */}
        <motion.div 
          layout
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const isFeatured = project.featured;
              const isWeb = project.type === 'website';
              const isGraphic = project.type === 'graphic-post';

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="h-full"
                >
                  <TiltCard
                    className={`h-full flex flex-col p-6 sm:p-7 ${
                      isFeatured
                        ? 'border-cyan-500/40 shadow-[0_0_35px_rgba(34,211,238,0.15)]'
                        : isGraphic
                        ? 'border-pink-500/30'
                        : ''
                    }`}
                    glowColor={
                      isFeatured
                        ? 'rgba(34, 211, 238, 0.2)'
                        : isGraphic
                        ? 'rgba(236, 72, 153, 0.18)'
                        : 'rgba(124, 58, 237, 0.15)'
                    }
                  >
                    {/* Top Badges */}
                    <div className="absolute top-4 right-6 flex items-center gap-2 z-20">
                      {isWeb && (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shadow-lg backdrop-blur-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Live Site</span>
                        </div>
                      )}
                      {isGraphic && (
                        <div className="flex items-center gap-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-300 shadow-lg backdrop-blur-md">
                          <Palette className="h-3 w-3" />
                          <span>Post Graphic</span>
                        </div>
                      )}
                      {isFeatured && (
                        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/25">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>

                    {/* Card Image Showcase */}
                    <div
                      className={`relative mb-6 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950 group ${
                        isGraphic ? 'aspect-[4/3] p-2 flex items-center justify-center' : 'aspect-[16/10]'
                      }`}
                      onClick={() => handleOpenProject(project)}
                    >
                      <img
                        src={project.image}
                        alt={project.clientName}
                        className={`transition-transform duration-500 group-hover:scale-105 ${
                          isGraphic
                            ? 'h-full w-auto max-h-full object-contain rounded-xl shadow-lg'
                            : 'h-full w-full object-cover'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-50" />
                      
                      {/* Hover Inspect Pill */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40 backdrop-blur-xs">
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                          <Eye className="h-4 w-4" />
                          <span>{isGraphic ? 'Inspect Artwork' : 'View Details'}</span>
                        </span>
                      </div>

                      {/* Monogram Badge */}
                      <div
                        className={`absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs text-white border border-white/20 shadow-lg ${
                          isGraphic 
                            ? 'bg-pink-600' 
                            : isWeb 
                            ? 'bg-cyan-600' 
                            : 'bg-violet-600'
                        }`}
                      >
                        {project.badge}
                      </div>

                      {/* Post Format Indicator */}
                      {isGraphic && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-mono text-slate-300 backdrop-blur-xs border border-white/10">
                          <Layers className="h-2.5 w-2.5 text-pink-400" />
                          <span>Square 1:1</span>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {project.clientName}
                          </h3>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-300">
                            {project.company}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-mono text-cyan-400">
                            {project.role}
                          </span>
                        </div>

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
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>{isGraphic ? 'Full Post' : 'Case Study'}</span>
                        </button>

                        {isWeb ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => soundManager.playClick()}
                            className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 shadow-md shadow-emerald-500/20"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : isGraphic ? (
                          <a
                            href={project.image}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => soundManager.playClick()}
                            className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition bg-gradient-to-r from-pink-600 to-rose-500 hover:opacity-90 shadow-md shadow-pink-500/20"
                          >
                            <span>HD View</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => soundManager.playClick()}
                            className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90"
                          >
                            <span>Live</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

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
