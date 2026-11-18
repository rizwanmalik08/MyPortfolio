import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { graphicDesignProjects, graphicDesignCategories } from '../../data/portfolioData';
import { ProjectModal } from '../ui/ProjectModal';
import { TiltCard } from '../ui/TiltCard';
import { soundManager } from '../../utils/audioFX';
import { 
  Palette, 
  Sparkles, 
  Eye, 
  ArrowUpRight, 
  Layers, 
  FileText, 
  Printer, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';

export function GraphicDesign() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categoryIcons = {
    all: Layers,
    branding: Palette,
    posters: FileText,
    corporate: Printer,
  };

  const handleOpenProject = (project) => {
    soundManager.playClick();
    setSelectedProject(project);
  };

  const filteredProjects = activeCategory === 'all'
    ? graphicDesignProjects
    : graphicDesignProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="graphic-design" className="relative py-24 z-10 scroll-mt-20">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[100px]" />

      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-400 flex items-center gap-2">
            <Palette className="h-3.5 w-3.5" />
            Visual Identity &amp; Creative Art Direction
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Graphic Design &amp; Branding
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Commercial branding, visual identity systems, high-converting posters, and executive corporate collateral crafted with precision.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {graphicDesignCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Layers;
            const isActive = activeCategory === cat.id;
            const count = cat.id === 'all' 
              ? graphicDesignProjects.length 
              : graphicDesignProjects.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-white shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/10 hover:border-white/20'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGraphicCategory"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <TiltCard className="h-full">
                  <div className="relative flex flex-col h-full rounded-3xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-fuchsia-500/40 hover:shadow-[0_15px_40px_rgba(217,70,239,0.15)] group">
                    
                    {/* Media Image Showcase */}
                    <div 
                      onClick={() => handleOpenProject(project)}
                      className="relative w-full aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/50 cursor-pointer"
                    >
                      <img
                        src={project.image}
                        alt={project.clientName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {project.badge && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-600/90 text-white font-mono text-xs font-bold shadow-lg">
                            {project.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-mono text-fuchsia-300 border border-fuchsia-500/30 backdrop-blur-md">
                        <Sparkles className="h-3 w-3 text-fuchsia-400" />
                        <span>Design Asset</span>
                      </div>

                      {/* Hover Overlay Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                          <Maximize2 className="h-3.5 w-3.5" />
                          Full HD Preview
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-col flex-grow mt-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                            {project.clientName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-400">
                            <span className="text-slate-300 font-medium">{project.company}</span>
                            <span>•</span>
                            <span className="text-fuchsia-400 font-mono text-[11px]">{project.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Client Review Quote */}
                      {project.review && (
                        <p className="mt-3 text-xs italic text-slate-400 line-clamp-2">
                          "{project.review}"
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-mono text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Deliverables Highlights */}
                      {project.deliverables && (
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                          {project.deliverables.slice(0, 2).map((del, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <CheckCircle2 className="h-3 w-3 text-fuchsia-400 shrink-0" />
                              <span className="truncate">{del}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bottom Action Buttons */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleOpenProject(project)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-fuchsia-400" />
                          <span>Full Design</span>
                        </button>

                        <a
                          href={project.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/20 hover:text-white transition-all shadow-[0_0_12px_rgba(217,70,239,0.2)]"
                        >
                          <span>HD View</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
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
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

export default GraphicDesign;
