import { motion } from 'framer-motion'
import rizwanPhoto from '../assets/rizwan.jpg.png'

function Hero() {
  return (
    <section id="home" className="section pt-28">
      <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <motion.p
            className="section-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Visual Designer with Programming & Marketing Skills
          </motion.p>
          <motion.h1
            className="text-4xl font-semibold leading-tight text-white sm:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hi, I am
            <span className="block text-5xl sm:text-6xl">Rizwan</span>
            <span className="block bg-gradient-to-r from-violet-300 via-sky-300 to-white bg-clip-text text-transparent">
              Visual Designer & Digital Marketer
            </span>
          </motion.h1>
          <motion.p
            className="text-lg text-slate-300"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Visual designer and digital marketer with 4 years of experience in
            branding, SEO, and modern web development.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a href="#projects" className="button-primary">
              View Projects
            </a>
            <a href="#contact" className="button-secondary">
              Contact Me
            </a>
          </motion.div>
          <motion.div
            className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-sm text-slate-300"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="pill">Graphic Design</span>
            <span className="pill">Digital Marketing</span>
            <span className="pill">4+ Years Experience</span>
          </motion.div>
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <span>Scroll down</span>
            <span className="scroll-dot"></span>
          </motion.div>
        </div>
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="hero-blob"></div>
          <div className="hero-ring"></div>
          <div className="relative z-10 h-64 w-64 sm:h-72 sm:w-72 lg:h-96 lg:w-96">
            <motion.img
              src={rizwanPhoto}
              alt="Rizwan portrait"
              className="h-full w-full rounded-full border border-white/10 object-cover shadow-[0_30px_60px_rgba(15,23,42,0.6)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
