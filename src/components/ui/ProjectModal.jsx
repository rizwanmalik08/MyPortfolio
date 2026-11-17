import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Quote, Globe, Palette, Sparkles, ZoomIn, Layers } from 'lucide-react';

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

  const isGraphicPost = project.type === 'graphic-post';
  const isWebsite = project.type === 'website';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#121324] via-[#0d0e1c] to-[#0a0a14] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.85)] text-white max-h-[92vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                {isWebsite && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Website / Web App
                  </span>
                )}
                {isGraphicPost && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider text-pink-400 font-semibold">
                    <Palette className="h-3 w-3" />
                    Social Media Post / Graphic
                  </span>
                )}
                {!isWebsite && !isGraphicPost && (
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
                    {project.role}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-2xl font-bold sm:text-3xl text-white flex flex-wrap items-center gap-2">
                {project.clientName}
                <span className="text-sm font-normal text-slate-400">({project.company})</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto pr-1 py-4 space-y-6">
            {/* Media Visual Showcase */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950 group">
              <div className={`w-full flex items-center justify-center ${isGraphicPost ? 'aspect-square max-h-[460px] bg-black/60 p-2 sm:p-4' : 'aspect-[16/9]'}`}>
                <img
                  src={project.image}
                  alt={project.clientName}
                  className={`object-contain transition-transform duration-500 ${
                    isZoomed ? 'scale-125' : 'scale-100 group-hover:scale-[1.02]'
                  } ${isGraphicPost ? 'max-h-full rounded-xl shadow-2xl' : 'h-full w-full object-cover'}`}
                />
              </div>

              {/* Zoom / Fullscreen preview button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md border border-white/20 transition hover:bg-black/90"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                <span>{isZoomed ? 'Reset Zoom' : 'Zoom 100%'}</span>
              </button>

              {/* Graphic Info Badge (if post) */}
              {isGraphicPost && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/70 px-3.5 py-1.5 text-[11px] font-mono text-slate-300 backdrop-blur-md border border-white/15">
                  <Layers className="h-3.5 w-3.5 text-pink-400" />
                  <span>1080 × 1080px (Square Feed Creative)</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4 text-sm text-slate-300">
              <p className="text-base leading-relaxed text-slate-200">
                {project.description}
              </p>

              {/* Metrics & Highlights */}
              {project.metrics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span className="font-medium">{m}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Client Review Quote */}
              {project.review && (
                <div className="rounded-2xl border border-white/10 bg-violet-950/20 p-4 relative">
                  <Quote className="h-6 w-6 text-violet-400/40 absolute top-3 right-3" />
                  <p className="text-xs uppercase tracking-wider text-violet-300 font-semibold mb-1">
                    Client Feedback &amp; Review
                  </p>
                  <p className="text-sm italic text-slate-300 pr-6">
                    "{project.review}"
                  </p>
                </div>
              )}

              {/* Technologies / Tools Tags */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2 font-mono">
                  {isGraphicPost ? 'Design Tools & Formats' : 'Technologies & Architecture'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 shrink-0">
            <button
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white"
            >
              Close
            </button>

            <div className="flex items-center gap-3">
              {isGraphicPost ? (
                <a
                  href={project.image}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-violet-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] transition hover:opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open Full Artwork</span>
                </a>
              ) : (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition hover:opacity-90"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Visit Live Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
