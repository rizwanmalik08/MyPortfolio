import { motion } from 'framer-motion';
import { Download, CheckCircle2, Award, Sparkles, Layers, Briefcase } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import rizwanPhoto from '../../assets/rizwan.jpg.png';

export function About() {
  return (
    <section id="about" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 sm:p-12 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          {/* Subtle Ambient Backing Glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Card: Hologram Profile Card */}
            <div className="lg:col-span-5">
              <motion.div
                className="relative rounded-3xl border border-white/15 bg-[#0f1122]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition hover:border-cyan-400/40"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-violet-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <img
                      src={rizwanPhoto}
                      alt="Rizwan"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {personalInfo.name}
                      <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                    </h3>
                    <p className="text-xs text-cyan-300 font-mono mt-0.5">
                      Visual Designer & Marketer
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] font-mono">
                      <span className="rounded-md border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-violet-300">
                        Branding
                      </span>
                      <span className="rounded-md border border-cyan-500/30 bg-cyan-500/15 px-2 py-0.5 text-cyan-300">
                        SEO
                      </span>
                      <span className="rounded-md border border-pink-500/30 bg-pink-500/15 px-2 py-0.5 text-pink-300">
                        Full-Stack
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                  Creative strategy, clean visuals, high-performance web development, and practical software engineering.
                </p>

                {/* Quick Info Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Location</span>
                    <p className="font-semibold text-white mt-0.5">{personalInfo.location}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Experience</span>
                    <p className="font-semibold text-cyan-400 mt-0.5">4+ Years Active</p>
                  </div>
                </div>

                {/* CV Download CTA */}
                <a
                  href={personalInfo.cvUrl}
                  download="Rizwan_Malik_CV.pdf"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-violet-600/30 transition hover:opacity-90 active:scale-[0.99]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Curriculum Vitae</span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: Bio & Core Disciplines */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  About Me
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Bridging Design, Marketing & Technical Engineering
                </h2>
              </div>

              {personalInfo.aboutParagraphs.map((para, index) => (
                <p key={index} className="text-base text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Highlights List */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-3">
                  Core Disciplines & Focus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {personalInfo.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-3 text-sm text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
