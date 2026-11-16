import { useState } from 'react';
import { certificates } from '../../data/portfolioData';
import { CertificateModal } from '../ui/CertificateModal';
import { soundManager } from '../../utils/audioFX';
import { Award, ZoomIn, CheckCircle } from 'lucide-react';

export function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  const handleOpenCert = (cert) => {
    soundManager.playClick();
    setSelectedCert(cert);
  };

  return (
    <section id="certificates" className="relative py-24 z-10 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Verified Credentials
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Professional Certifications
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Industry-recognized credentials in digital marketing, Google Analytics, SEO, and creative advertising strategies.
          </p>
        </div>

        {/* GPU-Accelerated Marquee Slider (0 CPU thread cost) */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="animate-marquee-left flex gap-6">
            {[...certificates, ...certificates].map((cert, index) => (
              <div
                key={`${cert.id}-${index}`}
                className="w-[280px] sm:w-[360px] flex-shrink-0"
              >
                <div
                  onClick={() => handleOpenCert(cert)}
                  className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d18]/90 p-2.5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-cyan-400/50 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(34,211,238,0.2)]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Hover Glow & Zoom Cue */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 text-white p-4 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg mb-2">
                        <ZoomIn className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider">
                        Inspect Certificate
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Title Bar */}
                  <div className="mt-2.5 px-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {cert.title}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Lightbox */}
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />

      </div>
    </section>
  );
}
