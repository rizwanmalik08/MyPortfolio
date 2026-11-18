import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Quote, 
  Globe, 
  Palette, 
  Sparkles, 
  ZoomIn, 
  ZoomOut,
  Layers, 
  Share2, 
  TrendingUp,
  Maximize2
} from 'lucide-react';

export function ProjectModal({ project, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const isSocialMedia = project.type === 'social-media' || project.type === 'graphic-post';
  const isWebsite = project.type === 'website';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#101223] via-[#0c0d1c] to-[#070814] p-5 sm:p-7 shadow-[0_25px_90px_rgba(0,0,0,0.85)] text-white max-h-[92vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-2.5">
              {project.badge && (
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-600 to-violet-600 text-white font-mono text-xs font-bold shadow-md">
                  {project.badge}
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">
                    {project.role}
                  </span>
                  {project.platform && (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                      <Share2 className="h-2.5 w-2.5" />
                      {project.platform}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  {project.clientName}
                  <span className="text-xs sm:text-sm font-normal text-slate-400">
                    • {project.company}
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Main Body: Two-Column Split Layout on Desktop */}
          <div className="overflow-y-auto pr-1 py-4 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Uncropped Image Showcase */}
              <div className="md:col-span-7 flex flex-col items-center">
                <div className="relative w-full aspect-square max-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 flex items-center justify-center group shadow-xl">
                  <img
                    src={project.image}
                    alt={project.clientName}
                    className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />

                  {/* Zoom Controls Overlay */}
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs text-white backdrop-blur-md border border-white/20 transition hover:bg-slate-900"
                  >
                    {isZoomed ? (
                      <>
                        <ZoomOut className="h-3 w-3 text-pink-400" />
                        <span>Fit View</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="h-3 w-3 text-cyan-400" />
                        <span>Zoom</span>
                      </>
                    )}
                  </button>

                  {/* Square Format Indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-md border border-white/10">
                    <Layers className="h-3 w-3 text-emerald-400" />
                    <span>Square 1:1 Creative</span>
                  </div>
                </div>

                <div className="mt-3 w-full flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Click image to zoom</span>
                  <a
                    href={project.image}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <Maximize2 className="h-3 w-3" />
                    <span>View original HD file</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Structured Campaign Details */}
              <div className="md:col-span-5 flex flex-col space-y-4">
                
                {/* Client Review / Testimonial Box */}
                {project.review && (
                  <div className="relative rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 backdrop-blur-sm">
                    <Quote className="h-4 w-4 text-emerald-400 mb-1" />
                    <p className="text-xs sm:text-sm italic text-emerald-200/90 leading-relaxed">
                      "{project.review}"
                    </p>
                    <div className="mt-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                      Verified Client Feedback
                    </div>
                  </div>
                )}

                {/* Campaign Performance Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                      Key Campaign Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.metrics.map((metric, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs font-mono font-semibold text-slate-200"
                        >
                          <span className="text-emerald-400 mr-1.5">✓</span>
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategy & Overview */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Campaign Scope
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                {project.deliverables && (
                  <div>
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Campaign Deliverables
                    </h4>
                    <div className="space-y-1">
                      {project.deliverables.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Channels &amp; Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 shrink-0">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition"
            >
              Close
            </button>

            <div className="flex items-center gap-2.5">
              {/* Client External Link (if exists, e.g. Facebook page) */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition shadow-sm"
                >
                  <Share2 className="h-3 w-3" />
                  <span>View Client Page</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {/* Open High-Res Full Image */}
              <a
                href={project.image}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(236,72,153,0.35)] transition hover:opacity-90"
              >
                <Sparkles className="h-3 w-3" />
                <span>Open Full HD</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProjectModal;
