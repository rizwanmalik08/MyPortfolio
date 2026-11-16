import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, Terminal, CheckCircle2, Award, Globe, Code2, Palette, TrendingUp, Layers, Cpu, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { TiltCard } from '../ui/TiltCard';
import { soundManager } from '../../utils/audioFX';
import rizwanPhoto from '../../assets/rizwan.jpg.png';

export function About() {
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'philosophy' | 'growth'

  const tabContent = {
    story: {
      title: "Versatile Creative & Technical Background",
      text: "With over 4 years of hands-on experience, I bridge the gap between aesthetic visual design and robust software engineering. Having founded DigiServiceZone and ARService, I have led dozens of successful brand transformations, bespoke web platforms, and performance marketing campaigns that deliver measurable business growth.",
      bullets: [
        "Founder of DigiServiceZone & ARService",
        "Over 100+ projects completed globally",
        "Holistic expertise from Figma to production code"
      ]
    },
    philosophy: {
      title: "Clean Architecture & 60 FPS Web Experiences",
      text: "I believe digital experiences should be both visually breathtaking and lightning-fast. My development workflow pairs clean component hierarchies in React and Next.js with procedural WebGL shaders and smooth physics, ensuring zero bloat, full accessibility, and silky 60–120 FPS performance across all devices.",
      bullets: [
        "Procedural 3D & WebGL shaders without heavy assets",
        "Pixel-perfect responsive UX across mobile & desktop",
        "Strict adherence to modern web standards & accessibility"
      ]
    },
    growth: {
      title: "Data-Driven Marketing & Conversion Optimization",
      text: "Great products need strategic visibility. My digital marketing toolkit combines deep technical SEO, on-page schema optimization, Google Analytics tracking, and high-converting paid social campaigns to systematically grow organic reach, improve user engagement, and scale client revenue.",
      bullets: [
        "Data-backed on-page and technical SEO",
        "High-converting visual ad campaigns & reels",
        "Measurable client revenue & traffic growth"
      ]
    }
  };

  const disciplines = [
    {
      title: "Brand Identity & UI/UX",
      icon: Palette,
      color: "from-pink-500/20 to-purple-500/5",
      border: "border-pink-500/30",
      accent: "text-pink-400",
      skills: ["Figma Systems", "Wireframing", "Prototypes", "Visual Assets"],
    },
    {
      title: "Full-Stack Web & 3D Apps",
      icon: Code2,
      color: "from-cyan-500/20 to-blue-500/5",
      border: "border-cyan-500/30",
      accent: "text-cyan-400",
      skills: ["React & Next.js", "Three.js / R3F", "Tailwind CSS", "Node.js REST"],
    },
    {
      title: "Mobile App Engineering",
      icon: Layers,
      color: "from-violet-500/20 to-indigo-500/5",
      border: "border-violet-500/30",
      accent: "text-violet-400",
      skills: ["React Native", "Flutter", "Cross-Platform", "Mobile UI"],
    },
    {
      title: "Digital Marketing & SEO",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
      skills: ["Technical SEO", "Google Analytics", "Social Ads", "Conversion Rate"],
    },
  ];

  return (
    <section id="about" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Cyber Terminal Master Chassis */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#090b16]/90 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
          
          {/* Chassis Top Bar / HUD Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-3.5 text-xs font-mono">
            {/* Terminal Window Controls */}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_#f43f5e]" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_#f59e0b]" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_#10b981]" />
              <span className="ml-3 text-slate-400 hidden sm:inline">
                system://identity/rizwan_malik.sys
              </span>
            </div>

            {/* Live Telemetry Ticker */}
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>STATUS: OPTIMAL</span>
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline text-violet-300">
                ROLE: LEAD ARCHITECT
              </span>
            </div>
          </div>

          {/* Master Bento Grid Content */}
          <div className="p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-12">
              
              {/* Bento Tile 1: Holographic Identity Card (Col 4) */}
              <div className="lg:col-span-4 flex flex-col">
                <TiltCard className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    {/* Header with Equalizer Visualizer */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                        <Terminal className="h-3.5 w-3.5" />
                        <span>BIO_CORE.v4</span>
                      </div>
                      
                      {/* Audio Frequency Equalizer Animation */}
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1.2s_infinite]" style={{ height: '60%' }} />
                        <span className="w-1 bg-violet-400 rounded-full animate-[bounce_0.8s_infinite]" style={{ height: '100%' }} />
                        <span className="w-1 bg-pink-400 rounded-full animate-[bounce_1.4s_infinite]" style={{ height: '40%' }} />
                        <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1.0s_infinite]" style={{ height: '80%' }} />
                      </div>
                    </div>

                    {/* Avatar with Rotating Cyber Ring */}
                    <div className="mt-6 flex flex-col items-center text-center">
                      <div className="relative h-28 w-28 rounded-2xl p-1 border-2 border-cyan-400/50 bg-gradient-to-tr from-violet-600 to-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        <img
                          src={rizwanPhoto}
                          alt="Rizwan"
                          className="h-full w-full rounded-xl object-cover"
                          width="240"
                          height="240"
                          loading="lazy"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#090b16]"></span>
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-white flex items-center gap-2">
                        {personalInfo.name}
                      </h3>
                      <p className="text-xs font-mono text-cyan-300 mt-0.5">
                        {personalInfo.role}
                      </p>

                      {/* Monogram Badges */}
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[10px] font-mono">
                        <span className="rounded-md border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-violet-300">
                          UI/UX
                        </span>
                        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/15 px-2 py-0.5 text-cyan-300">
                          Full-Stack
                        </span>
                        <span className="rounded-md border border-pink-500/30 bg-pink-500/15 px-2 py-0.5 text-pink-300">
                          SEO
                        </span>
                      </div>
                    </div>

                    {/* Coordinates & Core Specs */}
                    <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs font-mono text-slate-300">
                      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
                        <span className="text-slate-400">LOCATION:</span>
                        <span className="text-white font-semibold">Lahore, PK [31.52° N]</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
                        <span className="text-slate-400">EXPERIENCE:</span>
                        <span className="text-cyan-300 font-semibold">4+ Years Active</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
                        <span className="text-slate-400">ENTREPRENEUR:</span>
                        <span className="text-violet-300 font-semibold">DigiServiceZone</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Border-Beam Download CV Button */}
                  <a
                    href={personalInfo.cvUrl}
                    download="Rizwan_Malik_CV.pdf"
                    onMouseEnter={() => soundManager.playHover()}
                    onClick={() => soundManager.playClick()}
                    className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-2xl p-[1.5px] shadow-[0_0_25px_rgba(124,58,237,0.35)] transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7c3aed_0%,#22d3ee_50%,#f43f5e_100%)]" />
                    <span className="flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-[#0e1022] py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-3xl transition group-hover:bg-[#13162e]">
                      <Download className="h-4 w-4 text-cyan-400 transition-transform group-hover:-translate-y-0.5" />
                      <span>Download Curriculum Vitae</span>
                    </span>
                  </a>
                </TiltCard>
              </div>

              {/* Bento Tile 2: Narrative & Interactive Story Tabs (Col 8) */}
              <div className="lg:col-span-8 space-y-8 flex flex-col justify-between">
                
                {/* Vision Headline */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Strategic Core & Methodology
                  </span>
                  <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    Bridging Visual Storytelling, Scalable Code & Digital Growth
                  </h2>
                </div>

                {/* Interactive Mission Switcher Tabs */}
                <div className="rounded-2xl border border-white/10 bg-[#0d0e1c]/80 p-6 backdrop-blur-xl">
                  {/* Tab Selector Buttons */}
                  <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                    {[
                      { id: 'story', label: '01 // THE JOURNEY' },
                      { id: 'philosophy', label: '02 // TECH ARCHITECTURE' },
                      { id: 'growth', label: '03 // GROWTH & SEO' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveTab(tab.id);
                        }}
                        className={`rounded-xl px-4 py-2 text-xs font-mono transition-all ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                            : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Tab Panel */}
                  <div className="mt-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-bold text-white">
                          {tabContent[activeTab].title}
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {tabContent[activeTab].text}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                          {tabContent[activeTab].bullets.map((b, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-slate-200"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Live Telemetry Progress Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                    <span className="block text-2xl font-black text-cyan-400">98%</span>
                    <span className="text-[10px] uppercase text-slate-400 mt-1 block">Code Performance</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                    <span className="block text-2xl font-black text-violet-400">95%</span>
                    <span className="text-[10px] uppercase text-slate-400 mt-1 block">UI/UX Fidelity</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                    <span className="block text-2xl font-black text-pink-400">92%</span>
                    <span className="text-[10px] uppercase text-slate-400 mt-1 block">SEO Lift</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                    <span className="block text-2xl font-black text-emerald-400">100%</span>
                    <span className="text-[10px] uppercase text-slate-400 mt-1 block">On-Time Delivery</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bento Bottom Row: 4 Interactive Discipline Power-Cards */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
                    Core Technical Pillars
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Specialized Execution Matrix
                  </h3>
                </div>
                <span className="hidden sm:inline-block text-xs font-mono text-slate-500">
                  HOVER TO INSPECT CAPABILITIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {disciplines.map((d, index) => {
                  const Icon = d.icon;
                  return (
                    <TiltCard
                      key={d.title}
                      className="p-5"
                      glowColor="rgba(34, 211, 238, 0.15)"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${d.border} bg-white/5 ${d.accent}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          // 0{index + 1}
                        </span>
                      </div>

                      <h4 className="mt-4 text-base font-bold text-white">
                        {d.title}
                      </h4>

                      <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                        {d.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
