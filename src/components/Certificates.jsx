import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const certificates = [
  {
    title: 'Tube Ads',
    image: '/certificates/certificate1.jpg',
  },
  {
    title: 'Digital Marketing',
    image: '/certificates/certificate2.jpg',
  },
  {
    title: 'Google Analytics',
    image: '/certificates/certificate3.jpg',
  },
  {
    title: 'On Page SEO',
    image: '/certificates/certificate4.jpg',
  },
  {
    title: 'Certificate 5',
    image: '/certificates/certificate5.jpg',
  },
  {
    title: 'Certificate 6',
    image: '/certificates/certificate6.jpg',
  },
  {
    title: 'Certificate 7',
    image: '/certificates/certificate7.jpg',
  },
]

function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null)

  return (
    <section id="certificates" className="section py-20 bg-slate-950 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl md:text-7xl font-bold text-cyan-400 mb-16 tracking-wide">
          Certificates
        </h2>
        <div className="overflow-hidden flex w-full relative">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {[...certificates, ...certificates].map((cert, index) => (
              <div
                key={index}
                className="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0"
              >
                <div 
                  className="w-full aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-lg border border-white/10 flex items-center justify-center p-2 transition-transform hover:scale-105 duration-300 cursor-pointer"
                  onClick={() => cert.image && setSelectedCert(cert.image)}
                >
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt="Certificate"
                      className="w-full h-full object-cover rounded-lg pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                      [Image Placeholder]
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={selectedCert}
              alt="Full size certificate"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop if they click the image directly
            />
            <button 
              className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
              onClick={() => setSelectedCert(null)}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Certificates
