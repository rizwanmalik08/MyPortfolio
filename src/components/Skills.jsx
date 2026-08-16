import { motion } from 'framer-motion'

const skills = [
  { name: 'HTML/CSS', detail: 'Clean, responsive layouts', level: 95 },
  { name: 'Tailwind CSS', detail: 'Utility-first styling', level: 95 },
  { name: 'JavaScript', detail: 'ES6+ and tooling', level: 90 },
  { name: 'C/C++', detail: 'Logic-driven programs', level: 75 },
  { name: 'Python', detail: 'Automation and scripting', level: 90 },
  { name: 'MySQL', detail: 'Relational databases', level: 90 },
  { name: 'React.js', detail: 'Component-driven UI', level: 85 },
  { name: 'React Native', detail: 'Cross-platform apps', level: 85 },
  { name: 'Node.js', detail: 'Backend fundamentals', level: 85 },
  { name: 'Flutter', detail: 'Mobile UI builds', level: 85 },
  { name: 'Mongo DB', detail: 'NoSQL data stores', level: 85 },
  { name: 'Graphic Designing', detail: 'Brand visuals', level: 85 },
  { name: 'SEO', detail: 'Search optimization', level: 80 },
  { name: 'UX/UI Designing', detail: 'User-centered design', level: 95 },
  { name: 'Video Editing', detail: 'Post-production', level: 90 },
  { name: 'Social Media Marketing', detail: 'Campaign strategy', level: 95 },
]

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-kicker">Skills</p>
            <h2 className="section-title">My skills</h2>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-6 overflow-hidden">
          {/* Top Row Slider (Moves Left) */}
          <div className="flex w-full relative">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {[...skills.slice(0, 8), ...skills.slice(0, 8)].map((skill, index) => (
                <div
                  key={`top-${index}`}
                  className="w-[280px] flex-shrink-0 glass p-5 text-white rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="icon-chip bg-white/10 rounded-lg px-2 py-1 text-xs font-medium">{skill.name.slice(0, 2)}</div>
                    <span className="text-xs text-slate-400 font-medium">{skill.level}%</span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{skill.name}</h3>
                  <p className="mt-2 text-xs text-slate-400">{skill.detail}</p>
                  <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-sky-300"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Row Slider (Moves Right) */}
          <div className="flex w-full relative">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {[...skills.slice(8, 16), ...skills.slice(8, 16)].map((skill, index) => (
                <div
                  key={`bottom-${index}`}
                  className="w-[280px] flex-shrink-0 glass p-5 text-white rounded-xl border border-white/5 bg-white/5 transition-colors hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="icon-chip bg-white/10 rounded-lg px-2 py-1 text-xs font-medium">{skill.name.slice(0, 2)}</div>
                    <span className="text-xs text-slate-400 font-medium">{skill.level}%</span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{skill.name}</h3>
                  <p className="mt-2 text-xs text-slate-400">{skill.detail}</p>
                  <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-sky-300"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
