import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/portfolioData';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';

export function Contact() {
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ state: 'loading', message: 'Encrypting & sending message...' });
    const formData = new FormData(event.target);

    try {
      const response = await fetch(personalInfo.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus({
          state: 'success',
          message: 'Thank you! Your message has been sent successfully. I will get back to you within 24 hours.',
        });
        event.target.reset();

        // Celebration confetti burst!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#22d3ee', '#ec4899', '#ffffff'],
        });

        setTimeout(() => setStatus({ state: 'idle', message: '' }), 8000);
      } else {
        const data = await response.json();
        setStatus({
          state: 'error',
          message: data.error || 'Failed to send message. Please try WhatsApp or email directly.',
        });
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setStatus({
        state: 'error',
        message: 'Network issue. Please message me directly on WhatsApp (+92 3260388261).',
      });
    }
  };

  return (
    <section id="contact" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#111326]/90 to-[#090a14]/95 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          {/* Ambient Portal Halo Glow */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Get In Touch
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Let's Build Something Extraordinary
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-lg">
                Have a project in mind, need full-stack development, brand identity design, or digital marketing growth? Drop a message below.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Project Details & Scope *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    placeholder="Tell me about your goals, timelines, or requirements..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.state === 'loading'}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] transition hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <span>
                    {status.state === 'loading' ? 'Transmitting...' : 'Send Message'}
                  </span>
                </button>

                {/* Status Message Feedback */}
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 flex items-center gap-2.5 rounded-2xl p-4 text-xs ${
                      status.state === 'success'
                        ? 'border border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                        : 'border border-rose-500/30 bg-rose-950/30 text-rose-300'
                    }`}
                  >
                    {status.state === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Right Column: Contact Cards & Instant WhatsApp */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* WhatsApp Quick Chat CTA */}
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Instant WhatsApp Chat</h4>
                    <p className="text-xs text-slate-400">Direct response within minutes</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-300">
                  Prefer direct messaging over email? Click below to chat directly on WhatsApp.
                </p>

                <a
                  href={personalInfo.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition shadow-lg shadow-emerald-600/30"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              {/* Direct Info List */}
              <div className="rounded-3xl border border-white/10 bg-[#0c0d1c]/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 border-b border-white/10 pb-3">
                  Direct Contact Information
                </p>

                {/* Email */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Email</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="block text-xs font-semibold text-white hover:text-cyan-300 truncate transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Phone Call</span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="block text-xs font-semibold text-white hover:text-cyan-300 transition-colors"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Location</span>
                    <p className="text-xs font-semibold text-white">{personalInfo.location}</p>
                  </div>
                </div>

                {/* Social Badges */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={personalInfo.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:border-white/30 hover:text-white transition"
                  >
                    GitHub
                  </a>
                  <a
                    href={personalInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:border-white/30 hover:text-white transition"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={personalInfo.socialLinks.x}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:border-white/30 hover:text-white transition"
                  >
                    X (Twitter)
                  </a>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
