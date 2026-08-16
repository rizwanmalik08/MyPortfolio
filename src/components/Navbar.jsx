import { useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="container flex items-center justify-between py-4">
        <motion.a
          href="#home"
          className="text-lg font-semibold tracking-wide text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Rizwan
        </motion.a>
        <div className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {links.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative transition hover:text-white"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <motion.a
            href="/cv.pdf"
            download="Rizwan_Malik_CV.pdf"
            className="hidden button-secondary sm:inline-flex"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            Download CV
          </motion.a>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/10 md:hidden"
          >
            Menu
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-slate-950/90 md:hidden">
          <div className="container flex flex-col gap-4 py-6 text-sm text-slate-200">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
