import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Quote } from 'lucide-react';

export function ProjectModal({ project, onClose }) {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#121324] to-[#0a0a14] p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-white"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
                {project.role}
              </span>
              <h3 className="mt-1 text-2xl font-bold sm:text-3xl text-white flex items-center gap-2">
                {project.clientName}
                <span className="text-sm font-normal text-slate-400">({project.company})</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Project Screenshot Showcase */}
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            <img
              src={project.image}
              alt={project.clientName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-60" />
          </div>

          {/* Body Content */}
          <div className="mt-6 space-y-5 text-sm text-slate-300">
            <p className="text-base leading-relaxed text-slate-200">
              {project.description}
            </p>

            {/* Metrics & Highlights */}
            {project.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Client Feedback Quote */}
            {project.review && (
              <div className="rounded-2xl border border-white/10 bg-violet-950/20 p-4 relative">
                <Quote className="h-6 w-6 text-violet-400/40 absolute top-3 right-3" />
                <p className="text-xs uppercase tracking-wider text-violet-300 font-semibold mb-1">
                  Client Review
                </p>
                <p className="text-sm italic text-slate-300 pr-6">
                  "{project.review}"
                </p>
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Technologies Used
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
            <button
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white"
            >
              Close
            </button>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition hover:opacity-90"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
