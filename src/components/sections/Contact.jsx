import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/portfolioData';
import { soundManager } from '../../utils/audioFX';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Copy,
  Check,
  Clock,
  Radio,
  Zap,
  Globe2,
  Layers,
  Code2,
  Palette,
  TrendingUp,
} from 'lucide-react';

// Project intent tags for interactive quick-selection
const PROJECT_TYPES = [
  { id: 'uiux', label: 'UI/UX & Branding', icon: Palette, color: 'from-pink-500 to-rose-400' },
  { id: 'web3d', label: 'Full-Stack & 3D Web', icon: Code2, color: 'from-cyan-500 to-blue-400' },
  { id: 'mobile', label: 'Mobile App Dev', icon: Layers, color: 'from-violet-500 to-indigo-400' },
  { id: 'marketing', label: 'SEO & Growth Strategy', icon: TrendingUp, color: 'from-emerald-500 to-teal-400' },
];

/**
 * Kinetic Telemetry Radar Motion Graphics
 * Concentric frequency rings with sweeping laser beam and dynamic coordinates
 */
function KineticSignalRadar() {
  return (
    <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none pointer-events-none opacity-85">
      {/* Outer Concentric Pulse Rings */}
      <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-4 rounded-full border border-dotted border-violet-500/25 animate-[spin_40s_linear_infinite_reverse]" />
      <div className="absolute inset-8 rounded-full border border-white/10" />
      <div className="absolute inset-14 rounded-full border border-cyan-400/20" />

      {/* Crosshair Grid Lines */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />

      {/* 360-Degree Sweeping Laser Radar Beam */}
      <div className="absolute inset-0 rounded-full overflow-hidden animate-[spin_4.5s_linear_infinite]">
        <div className="h-full w-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_310deg,rgba(56,189,248,0.35)_355deg,rgba(255,255,255,0.7)_360deg)]" />
      </div>

      {/* Central Beacon Node */}
      <div className="relative flex h-3 w-3 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300 shadow-[0_0_12px_#38bdf8]" />
      </div>

      {/* Orbiting Telemetry Blips */}
      <div className="absolute top-3 right-6 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
      <div className="absolute bottom-6 left-5 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa] animate-pulse delay-150" />

      {/* Telemetry Corner Markings */}
      <span className="absolute top-1 left-2 font-mono text-[8px] text-cyan-400/60 tracking-wider">RX//98%</span>
      <span className="absolute bottom-1 right-2 font-mono text-[8px] text-slate-500 tracking-wider">31.5°N</span>
    </div>
  );
}

export function Contact() {
  const [selectedType, setSelectedType] = useState('web3d');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [copiedField, setCopiedField] = useState(null);
  const [lahoreTime, setLahoreTime] = useState('');

  // Live Pakistan Standard Time (PKT // UTC+5)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setLahoreTime(timeStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text, fieldName) => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleSelectType = (id) => {
    soundManager.playHover();
    setSelectedType(id);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    soundManager.playClick();
    setStatus({ state: 'loading', message: 'Transmitting packet to Rizwan Malik...' });
    const formData = new FormData(event.target);
    formData.append('project_intent', selectedType);

    try {
      const response = await fetch(personalInfo.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus({
          state: 'success',
          message: 'Transmission received! Thank you for reaching out. I will respond to your inquiry within 2 hours.',
        });
        event.target.reset();

        // Celebration Confetti Explosion
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#6366f1', '#10b981', '#f43f5e', '#ffffff'],
        });

        setTimeout(() => setStatus({ state: 'idle', message: '' }), 8000);
      } else {
        const data = await response.json();
        setStatus({
          state: 'error',
          message: data.error || 'Failed to transmit message. Please connect directly via WhatsApp.',
        });
      }
    } catch (error) {
      console.error('Contact error:', error);
      setStatus({
        state: 'error',
        message: 'Network lag detected. Please message directly on WhatsApp (+92 3260388261).',
      });
    }
  };

  return (
    <section id="contact" className="relative py-28 z-10 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Main Architectural Glass Console */}
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c0f24]/90 via-[#070918]/95 to-[#04060f]/98 p-7 sm:p-12 lg:p-14 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.85)]"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient Cosmic Horizon Lighting */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-violet-600/15 blur-[130px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

          {/* Top Live Telemetry Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
            {/* Live System Availability */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>SYSTEM ONLINE // ACCEPTING Q1-Q2 PROJECTS</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-slate-300">
                <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
                <span>DIRECT ENCRYPTED CHANNEL</span>
              </div>
            </div>

            {/* Live Time in Lahore (UTC+5) */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>LAHORE, PK:</span>
              <span className="font-semibold text-white tracking-wider tabular-nums">{lahoreTime || '17:15 PKT'}</span>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Left Column: Form & Scope Selector */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  Initiate Project Inquiry
                </span>
                <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Let's Build Something{' '}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-rose-300 bg-clip-text text-transparent">
                    Extraordinary.
                  </span>
                </h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
                  Have an ambitious vision, need high-performance full-stack web engineering, bespoke visual identity, or scalable digital marketing? Send your requirements below.
                </p>
              </div>

              {/* Project Type Quick Selector */}
              <div className="pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                  Select Project Discipline:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectType(type.id)}
                        className={`group relative flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-left transition-all duration-300 border cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400/70 bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-white scale-[1.01]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isSelected ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-mono font-medium truncate">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* High-Performance Form */}
              <form onSubmit={onSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Alexander Vance"
                    onFocus={() => soundManager.playHover()}
                    className="w-full rounded-2xl border border-white/10 bg-[#060814]/80 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300"
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
                    placeholder="alexander@company.com"
                    onFocus={() => soundManager.playHover()}
                    className="w-full rounded-2xl border border-white/10 bg-[#060814]/80 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300"
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
                    placeholder="Share your goals, timeline, and design or engineering specs..."
                    onFocus={() => soundManager.playHover()}
                    className="w-full rounded-2xl border border-white/10 bg-[#060814]/80 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={status.state === 'loading'}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 sm:py-4 px-6 text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 shadow-[0_4px_30px_rgba(6,182,212,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer overflow-hidden"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 text-cyan-200" />
                  <span>
                    {status.state === 'loading' ? 'Encrypting & Transmitting...' : 'Send Project Proposal →'}
                  </span>
                  
                  {/* Subtle Shimmer Ray */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </button>

                {/* Status Message Feedback Alert */}
                <AnimatePresence>
                  {status.message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-4 flex items-center gap-3 rounded-2xl p-4 text-xs font-mono ${
                        status.state === 'success'
                          ? 'border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                          : 'border border-rose-500/40 bg-rose-950/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                      }`}
                    >
                      {status.state === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                      )}
                      <span className="leading-relaxed">{status.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Right Column: Instant WhatsApp Portal + Telemetry Radar & Direct Channels */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              {/* Top Radar Motion Graphics Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080b1a]/85 p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
                <div className="space-y-1.5 z-10">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-400 flex items-center gap-1.5">
                    <Radio className="h-3 w-3 animate-ping" />
                    LIVE SIGNAL RADAR
                  </span>
                  <h4 className="text-base font-bold text-white tracking-tight">Active Frequency</h4>
                  <p className="text-xs text-slate-400 max-w-[190px]">
                    Direct point-to-point connection with Lahore HQ.
                  </p>
                </div>

                {/* Kinetic Signal Radar Component */}
                <div className="shrink-0 -my-4 -mr-4">
                  <KineticSignalRadar />
                </div>
              </div>

              {/* Bespoke Holographic WhatsApp Direct Beam Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-[#071318]/90 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(16,185,129,0.15)] transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                      <MessageSquare className="h-6 w-6" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Instant WhatsApp Chat
                      </h4>
                      <p className="text-xs text-emerald-400/90 font-mono">Typically responds in ~10 mins</p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  Prefer direct messaging over email? Tap below to start an encrypted, immediate WhatsApp conversation with Rizwan Malik.
                </p>

                <a
                  href={personalInfo.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="mt-4 group/btn relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              </div>

              {/* Direct Info List with One-Click Copy */}
              <div className="rounded-3xl border border-white/10 bg-[#080b1a]/85 p-6 backdrop-blur-xl shadow-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                    Direct Contact Directory
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider">CLICK TO COPY</span>
                </div>

                {/* Email Item */}
                <div
                  onClick={() => handleCopy(personalInfo.email, 'email')}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  title="Click to copy email address"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase text-slate-400">Email Address</span>
                      <span className="block text-xs font-semibold text-white group-hover:text-cyan-300 truncate transition-colors">
                        {personalInfo.email}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {copiedField === 'email' ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                        <Check className="h-3 w-3" /> Copied!
                      </span>
                    ) : (
                      <span className="text-slate-500 group-hover:text-slate-300 p-1">
                        <Copy className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone Item */}
                <div
                  onClick={() => handleCopy(personalInfo.phone, 'phone')}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  title="Click to copy phone number"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase text-slate-400">Direct Phone</span>
                      <span className="block text-xs font-semibold text-white group-hover:text-cyan-300 truncate transition-colors">
                        {personalInfo.phone}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {copiedField === 'phone' ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                        <Check className="h-3 w-3" /> Copied!
                      </span>
                    ) : (
                      <span className="text-slate-500 group-hover:text-slate-300 p-1">
                        <Copy className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-400">Studio Location</span>
                    <span className="block text-xs font-semibold text-white">{personalInfo.location}</span>
                  </div>
                </div>

                {/* Social Badges Grid */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={personalInfo.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playHover()}
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white transition-all shadow-sm"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href={personalInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playHover()}
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white transition-all shadow-sm"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={personalInfo.socialLinks.x}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playHover()}
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white transition-all shadow-sm"
                  >
                    X (Twitter) ↗
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
