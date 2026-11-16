import { motion } from 'framer-motion';
import { testimonials } from '../../data/portfolioData';
import { Quote, Star, MessageSquare } from 'lucide-react';

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 z-10">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5" />
            Social Proof
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Client Testimonials
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Real feedback from startup founders, agency partners, and product managers.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d0e1d]/85 p-7 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(34,211,238,0.1)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div>
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <Quote className="h-7 w-7 text-violet-400/40 mb-3" />

                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Row */}
              <div className="mt-8 flex items-center gap-3.5 border-t border-white/10 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 font-bold text-xs text-white shadow-md">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
