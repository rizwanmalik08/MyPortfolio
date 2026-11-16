import { motion } from 'framer-motion';
import { services } from '../../data/portfolioData';
import { Palette, Code2, Smartphone, TrendingUp, Cpu, Film, CheckCircle, ArrowRight } from 'lucide-react';

export function Services() {
  const iconMap = {
    Palette: Palette,
    Code2: Code2,
    Smartphone: Smartphone,
    TrendingUp: TrendingUp,
    Cpu: Cpu,
    Film: Film,
  };

  return (
    <section id="services" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">
              Specialized Solutions
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Services & Expertise
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Full-cycle creative and technical services designed to transform business ideas into high-converting digital products.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code2;

            return (
              <motion.div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d0e1b]/80 p-7 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(34,211,238,0.12)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                {/* Ambient Top Glow in Card */}
                <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                <div className="relative z-10">
                  {/* Icon Chip */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-cyan-400 shadow-md group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Deliverables:
                    </p>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Link */}
                <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <a href="#contact" className="inline-flex items-center gap-1.5 hover:underline">
                    <span>Discuss this service</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
