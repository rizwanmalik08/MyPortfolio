import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Quote, 
  Share2, 
  Sparkles
} from 'lucide-react';

export function ProjectModal({ project, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!project || !mounted) return null;

  const isClient = project.category === 'clients';

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop covering entire screen */}
      <motion.div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Window Container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0e101f] p-5 sm:p-7 shadow-[0_25px_90px_rgba(0,0,0,0.9)] text-white max-h-[85vh] my-auto flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                <Share2 className="h-3 w-3" />
                {project.platform || (isClient ? 'Client Account' : 'Social Campaign')}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {project.clientName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {project.company} • {project.role}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Body */}
        <div className="overflow-y-auto pr-1 py-5 flex-grow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Visual Showcase */}
            <div className="md:col-span-6 flex flex-col items-center">
              {isClient ? (
                /* Elegant Client Brand Presentation (No raw white boxes, no fake zoom) */
                <div className="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[280px] shadow-inner">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-white p-5 shadow-2xl flex items-center justify-center">
                    <img
                      src={project.image}
                      alt={project.clientName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="mt-4 text-xs font-medium text-slate-400">
                    Official Client Account • Managed Campaigns
                  </span>
                </div>
              ) : (
                /* Clean High-Resolution Creative Showcase */
                <div className="relative w-full aspect-square max-h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 flex items-center justify-center shadow-xl">
                  <img
                    src={project.image}
                    alt={project.clientName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Right Column: Authentic Details */}
            <div className="md:col-span-6 flex flex-col space-y-4">
              
              {/* Client Feedback Quote */}
              {project.review && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 sm:p-5 backdrop-blur-sm">
                  <Quote className="h-4 w-4 text-emerald-400 mb-1 opacity-80" />
                  <p className="text-xs sm:text-sm italic text-emerald-200/90 leading-relaxed">
                    "{project.review}"
                  </p>
                  <div className="mt-2 text-xs font-semibold text-emerald-400">
                    Verified Client Feedback
                  </div>
                </div>
              )}

              {/* Work Overview */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Campaign Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Deliverables Checklist */}
              {project.deliverables && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Services &amp; Deliverables
                  </h4>
                  <div className="space-y-1.5">
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Scope &amp; Platforms
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
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
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:opacity-95 transition"
              >
                <span>{isClient ? 'Visit Client Page' : 'Visit Official Link'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default ProjectModal;