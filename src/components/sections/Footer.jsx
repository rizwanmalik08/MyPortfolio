import { ArrowUp } from 'lucide-react';
import { personalInfo, navLinks } from '../../data/portfolioData';

export function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const servicesList = [
    'Social Media Marketing',
    'Graphic Designing',
    'Video Editing',
    'SEO Optimization',
    'Full-Stack Web Dev',
    'UI/UX Design Systems',
    'C++ Desktop Solutions',
    'Cross-Platform Apps',
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#06070d]/90 pt-16 pb-12 z-10 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Main 4-Column Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 text-sm text-slate-400">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white font-bold text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                R
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {personalInfo.name}
                <span className="text-cyan-400">.</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Visual designer, full-stack developer and digital marketer crafting high-converting brand identities, modern web applications, and immersive 3D digital experiences.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for worldwide remote contracts</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-white">
              Navigation
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="lg:col-span-3">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-white">
              Core Capabilities
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-xs">
              {servicesList.map((service) => (
                <li key={service} className="text-slate-400 hover:text-slate-200 transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Direct Links */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-white">
              Stay Connected
            </p>
            <p className="text-xs text-slate-400">
              Get updates about modern web innovations, design case studies, and engineering strategies.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing!');
                e.target.reset();
              }}
              className="flex items-center rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 focus-within:border-cyan-400 transition"
            >
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="w-full bg-transparent px-3 text-xs text-white placeholder:text-slate-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-3.5 py-2 text-[11px] font-bold text-white uppercase tracking-wider hover:opacity-90 transition shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
          <p>© 2026 {personalInfo.fullName}. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {/* GitHub */}
            <a
              href={personalInfo.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white transition"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={personalInfo.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white transition"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href={personalInfo.socialLinks.x}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white transition"
              aria-label="X (formerly Twitter)"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={handleScrollTop}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 hover:border-cyan-400/50 hover:text-white transition"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3 text-cyan-400" />
          </button>
        </div>

      </div>
    </footer>
  );
}
