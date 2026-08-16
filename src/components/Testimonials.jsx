import { motion } from 'framer-motion'

const testimonials = [
  {
    quote:
      'Alex is an amazing developer. He delivered the project on time with great quality.',
    name: 'Sarah Johnson',
    role: 'CEO, TechCorp',
  },
  {
    quote:
      'Great communication and high-quality work. I highly recommend him!',
    name: 'Michael Brown',
    role: 'Founder, DevStudio',
  },
  {
    quote:
      'Professional, creative and dedicated. Will work with him again!',
    name: 'Emily Davis',
    role: 'Product Manager',
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="glass px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Testimonials</p>
              <h2 className="section-title">What clients say</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.article
                key={item.name}
                className="card-hover rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <p className="text-2xl text-violet-300">“</p>
                <p className="mt-2">{item.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="avatar">{item.name.slice(0, 2)}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
