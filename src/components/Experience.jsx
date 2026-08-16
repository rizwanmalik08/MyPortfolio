import { motion } from 'framer-motion'

const experiences = [
  {
    period: '2021 - Present',
    title: 'Freelance Digital Services',
    company: 'No (Company)',
    bullets: [
      'Providing freelance services in graphic design, digital marketing, and basic web development.',
      'Worked with small businesses to create branding materials.',
      'Run online marketing campaigns and social media content.',
    ],
  },
  {
    period: '2022 - Present',
    title: 'Founder - ARService',
    company: 'ARService',
    bullets: [
      'Delivered C++-based solutions for client-specific software needs.',
      'Built custom desktop tools and logic-driven programs.',
      'Provided technical consulting and troubleshooting for small businesses.',
    ],
  },
  {
    period: '2023 - Present',
    title: 'Founder - DigiServiceZone',
    company: 'DigiServiceZone',
    bullets: [
      'Developed branding and digital strategies for clients across industries.',
      'Managed and executed SEO campaigns to improve search visibility and traffic.',
    ],
  },
]

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="glass grid gap-10 p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="section-kicker">Experience</p>
            <h2 className="section-title">Building products with impact</h2>
            <div className="mt-8 space-y-6">
              {experiences.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="relative border-l border-white/10 pl-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-violet-400"></div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    {item.period}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-violet-200">{item.company}</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="dot mt-1"></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl"></div>
            <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl"></div>
            <div className="space-y-5 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Experience
                </p>
                <p className="mt-2 text-white">4+ Years Experience</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Focus
                </p>
                <p className="mt-2 text-white">Design & Marketing</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Technical
                </p>
                <p className="mt-2 text-white">C++ Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
