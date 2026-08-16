function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container grid gap-10 text-sm text-slate-400 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold text-white">Portfolio.</p>
          <p className="mt-3 text-sm text-slate-400">
            Building modern, responsive, and professional user experiences.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Quick Links</p>
          <div className="mt-4 space-y-2">
            <a href="#home" className="block transition hover:text-white">
              Home
            </a>
            <a href="#about" className="block transition hover:text-white">
              About
            </a>
            <a href="#projects" className="block transition hover:text-white">
              Projects
            </a>
            <a href="#contact" className="block transition hover:text-white">
              Contact
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Services</p>
          <div className="mt-4 space-y-2">
            <p>Social Media Marketing</p>
            <p>Graphic Designing</p>
            <p>Video Editing</p>
            <p>SEO</p>
            <p>Web Development</p>
            <p>UI/UX Design</p>
            <p>Frontend Development</p>
            <p>Responsive Design</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Subscribe</p>
          <p className="mt-4 text-sm text-slate-400">
            Get updates about my latest projects and articles.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 p-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-400">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
        <p>© 2026 Rizwan. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/rizwanmalik08"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rizwan-malik-5919692b7/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
