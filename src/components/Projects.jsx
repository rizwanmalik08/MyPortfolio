import { motion } from 'framer-motion'

const clientWork = [
  {
    clientName: 'New Jersey',
    company: 'New Jersey',
    role: 'Frontend Development',
    review: 'DigiServiceZone delivered beyond our expectations. Highly professional and reliable.',
    link: 'https://newjersey.pk/',
    image: '/new_jersey.png',
    badge: 'N',
    featured: false,
  },
  {
    clientName: 'Noor Chemicals',
    company: 'Noor Chemicals',
    role: 'Social Media Marketing',
    review: 'Excellent communication, modern design and exceptional support throughout.',
    link: 'https://www.facebook.com/profile.php?id=100090117847386',
    image: '/noor_chemicals.png',
    badge: 'N',
    featured: true,
  },
  {
    clientName: 'Shaban Chemicals',
    company: 'Shaban Chemicals',
    role: 'Social Media Marketing',
    review: 'A great team to work with. They understood our requirements perfectly.',
    link: 'https://www.facebook.com/shabanchemical/',
    image: '/shaban_chemical.png',
    badge: 'S',
    featured: false,
  },
]

function Projects() {
  return (
    <section id="projects" className="section bg-[#0A0F1E]">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-slate-400 max-w-2xl text-sm mb-12">
            Building meaningful digital experiences for businesses and brands.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3 relative">
          {clientWork.map((work, index) => (
            <motion.article
              key={work.clientName}
              className={`relative flex flex-col items-center p-8 rounded-3xl text-center border bg-slate-900/50 backdrop-blur-md transition-all duration-300 ${
                work.featured 
                  ? 'border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)] z-10 scale-[1.02]' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              {work.featured && (
                <div className="absolute -top-3 right-6 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Featured Client
                </div>
              )}

              <div className="relative mb-6">
                <div className={`w-24 h-24 rounded-full p-1 ${work.featured ? 'bg-gradient-to-br from-rose-500 to-rose-700' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {work.image ? (
                      <img src={work.image} alt={work.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-white/50">{work.clientName.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white border-2 border-slate-900 ${
                  work.featured ? 'bg-rose-500' : 'bg-indigo-600'
                }`}>
                  {work.badge}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {work.clientName}
                <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </h3>
              <p className={`text-sm font-medium mt-1 ${work.featured ? 'text-rose-400' : 'text-indigo-400'}`}>
                {work.company}
              </p>
              <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider">{work.role}</p>

              <p className="text-sm text-slate-300 leading-relaxed mb-8 flex-grow">
                {work.review}
              </p>

              <div className="flex items-center gap-3 w-full mt-auto">
                <a
                  href={work.link}
                  target={work.link !== '#' ? '_blank' : undefined}
                  rel={work.link !== '#' ? 'noreferrer' : undefined}
                  className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all ${
                    work.featured 
                      ? 'bg-gradient-to-r from-rose-500 to-rose-700 hover:opacity-90 shadow-lg shadow-rose-500/20' 
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  View Profile
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </a>
                <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
                <a
                  href={work.link}
                  target={work.link !== '#' ? '_blank' : undefined}
                  rel={work.link !== '#' ? 'noreferrer' : undefined}
                  className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Statistics Bar */}
        <div className="mt-16 w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-rose-500/30 flex items-center justify-center text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">50+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Happy Clients</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-800"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">100+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Projects Completed</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-800"></div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-rose-500/30 flex items-center justify-center text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">98%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Client Satisfaction</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-800"></div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="m10 17.5 1.5-5 3.5 1-2 5-1.5-.5Z"/><path d="m14 17.5-1.5-5-3.5 1 2 5 1.5-.5Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">4+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Years of Experience</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Projects
