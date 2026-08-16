import { motion } from 'framer-motion'
import rizwanPhoto from '../assets/rizwan.jpg.png'

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div
          className="glass grid gap-10 p-10 lg:grid-cols-[0.9fr_1.1fr]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <motion.div
              className="about-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-400 to-sky-300 p-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <img
                    src={rizwanPhoto}
                    alt="Rizwan portrait"
                    className="h-full w-full rounded-full object-cover"
                  />
                </motion.div>
                <div>
                  <p className="text-lg font-semibold text-white">Rizwan</p>
                  <p className="text-sm text-slate-300">
                    Visual Designer & Marketer
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="badge">Branding</span>
                    <span className="badge">SEO</span>
                    <span className="badge">UI/UX</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Creative strategy, clean visuals, and practical tech solutions.
              </p>
              <motion.a
                href="/cv.pdf"
                download="Rizwan_Malik_CV.pdf"
                className="mt-6 button-secondary inline-flex text-center"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Download CV
              </motion.a>
            </motion.div>
          </div>
          <div>
            <p className="section-kicker">About Me</p>
            <h2 className="section-title">Who am I?</h2>
            <p className="mt-4 text-base text-slate-300">
              I am Rizwan, a versatile digital professional with 4 years of
              experience across design, marketing, and development. I combine
              visual storytelling with technical execution to create brands,
              campaigns, and products that perform.
            </p>
            <p className="mt-4 text-base text-slate-300">
              My toolkit spans graphic and UX/UI design, SEO, social media
              marketing, and modern web and app technologies like React,
              React Native, Node.js, Flutter, and C++. I focus on clean visuals,
              measurable growth, and reliable builds.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="dot"></span>
                Brand identity, graphic design, and UX/UI
              </li>
              <li className="flex items-center gap-3">
                <span className="dot"></span>
                Digital marketing, SEO, and social campaigns
              </li>
              <li className="flex items-center gap-3">
                <span className="dot"></span>
                Front-end and mobile app development
              </li>
              <li className="flex items-center gap-3">
                <span className="dot"></span>
                Video editing and content optimization
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
