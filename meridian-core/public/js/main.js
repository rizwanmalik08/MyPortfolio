import { MarcusThreeBackground } from './three-hero.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Three.js WebGL Atmosphere
  try {
    new MarcusThreeBackground('three-canvas-container');
  } catch (err) {
    console.warn('Three.js initialization:', err);
  }

  // 2. Navigation Scroll State & Smooth Links
  setupNavigation();

  // 3. Voices Quote Switcher
  setupVoices();

  // 4. Ventures Modal Details
  setupVentureModal();

  // 5. Impact Counter Animations
  setupCounters();

  // 6. Working Contact Inquiry Form (Connected to Express API & SQLite)
  setupInquiryForm();
});

/**
 * Navigation Scroll Observer & Mobile Drawer
 */
function setupNavigation() {
  const nav = document.querySelector('.site-nav');
  const burger = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('section[id], footer[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 250;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/**
 * Voices Interactive Testimonials Switcher
 */
function setupVoices() {
  const voicesData = [
    {
      name: 'Elena Cardoso',
      role: 'Managing Partner, Meridian Ventures',
      quote: '“Marcus saw the market three years before the rest of us. Betting alongside him changed the trajectory of my entire career.”',
      attribution: 'Elena Cardoso — Managing Partner, Meridian Ventures',
      image: '/assets/images/mv-voice-01.webp'
    },
    {
      name: 'David Okonkwo',
      role: 'Founder & CEO, Cadence Health',
      quote: '“When every institutional VC passed on our hardware prototype, Marcus wrote the first check and spent weekends with our firmware engineers solving heat dissipation.”',
      attribution: 'David Okonkwo — Founder & CEO, Cadence Health',
      image: '/assets/images/team-marcus.jpg'
    },
    {
      name: 'Priya Nandakumar',
      role: 'CEO, Northwind Energy',
      quote: '“He understands grid mechanics and capital markets equally well. That rare combination is why Northwind scaled from pilot to NYSE listing.”',
      attribution: 'Priya Nandakumar — CEO, Northwind Energy',
      image: '/assets/images/team-elena.jpg'
    }
  ];

  const buttons = document.querySelectorAll('.voice-btn');
  const quoteEl = document.getElementById('voice-quote');
  const attrEl = document.getElementById('voice-attribution');
  const imgEl = document.getElementById('voice-image');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(idx) || !voicesData[idx]) return;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = voicesData[idx];

      if (quoteEl && attrEl && imgEl) {
        quoteEl.style.opacity = '0';
        imgEl.style.opacity = '0';

        setTimeout(() => {
          quoteEl.textContent = data.quote;
          attrEl.textContent = data.attribution;
          imgEl.src = data.image;
          imgEl.alt = data.name;

          quoteEl.style.opacity = '1';
          imgEl.style.opacity = '1';
        }, 200);
      }
    });
  });
}

/**
 * Venture Details Modal
 */
function setupVentureModal() {
  const modal = document.getElementById('venture-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('close-modal-btn');
  const ventureCards = document.querySelectorAll('.venture');

  const venturesInfo = {
    'helix-robotics': {
      title: 'Helix Robotics',
      industry: 'Industrial Automation & Deep Robotics',
      year: '2019',
      outcome: 'Acquired — $1.1B',
      image: '/assets/images/mv-venture-01.webp',
      description: 'Reinvented high-throughput warehouse logistics with autonomous mobile robotics and multi-agent fleet choreography. Scaled to over 18,000 active automated units operational across 40 countries.',
      deliverables: [
        'Proprietary SLAM computer vision and dynamic obstacle avoidance',
        'Fleet orchestration platform reducing fulfillment cycle time by 48%',
        'Deployment in tier-1 e-commerce distribution centers worldwide',
        'Strategic acquisition by global logistics conglomerate for $1.1B'
      ],
      metrics: '40 Countries • 18,000+ Units • $1.1B Exit'
    },
    'northwind-energy': {
      title: 'Northwind Energy',
      industry: 'Climate Infrastructure & Grid Energy',
      year: '2015',
      outcome: 'IPO — NYSE: NWND',
      image: '/assets/images/mv-venture-02.webp',
      description: 'Scaled utility-grade multi-megawatt battery energy storage systems that stabilize trans-regional renewable power grids during peak transmission fluctuations.',
      deliverables: [
        'Utility-scale lithium & flow battery synchronization architectures',
        '2.4 GWh of clean dispatchable power deployed across North America & Europe',
        'Dynamic frequency regulation algorithms preventing grid brownouts',
        'Successful initial public offering on the New York Stock Exchange'
      ],
      metrics: '2.4 GWh Capacity • NYSE: NWND • 100% Clean Dispatch'
    },
    'cadence-health': {
      title: 'Cadence Health',
      industry: 'Digital Medicine & Continuous Monitoring',
      year: '2011',
      outcome: 'Acquired — $640M',
      image: '/assets/images/mv-venture-03.webp',
      description: 'Architected an ambient clinical intelligence engine providing real-time biometric telemetry and continuous preventative care for chronic patient populations.',
      deliverables: [
        'FDA-cleared physiological sensor suite and predictive risk modeling',
        'Supported over 14 million patient-months with 98.4% diagnostic reliability',
        'Hospital readmission reduction of 36% across partner health systems',
        'Acquired for $640M by leading healthcare technology provider'
      ],
      metrics: '14M+ Patients • -36% Readmissions • $640M Acquisition'
    },
    'vane-capital': {
      title: 'Vane Capital',
      industry: 'Venture Partnership & Frontier Deep-Tech',
      year: '2008',
      outcome: 'Active — $900M AUM',
      image: '/assets/images/mv-venture-04.webp',
      description: 'Private venture partnership investing early-stage conviction capital into breakthrough founders tackling hard, non-consensus engineering challenges.',
      deliverables: [
        '$900M in assets under management across flagship vintage funds',
        '28 early-stage deep-tech, energy, and AI infrastructure investments',
        'Consistent top-decile IRR performance over a 16-year track record',
        'Hands-on operational playbook: conviction before consensus'
      ],
      metrics: '$900M AUM • 28 Investments • 4 Exits'
    }
  };

  ventureCards.forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-slug');
      const data = venturesInfo[slug];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="aspect-ratio: 16/9; overflow: hidden; border-radius: 4px; margin-bottom: 2rem;">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--line); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 2.2rem; text-transform: uppercase; color: var(--foreground);">${data.title}</h2>
            <p style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent); margin-top: 0.25rem;">${data.industry} • ${data.year}</p>
          </div>
          <span style="font-size: 0.95rem; font-weight: 700; color: var(--foreground); background: rgba(255, 59, 29, 0.15); border: 1px solid var(--accent); padding: 6px 14px; border-radius: 9999px;">
            ${data.outcome}
          </span>
        </div>
        <p style="color: var(--muted); font-size: 1.05rem; line-height: 1.65; margin-bottom: 2rem;">
          ${data.description}
        </p>
        <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--muted); margin-bottom: 1rem;">
          Key Milestones &amp; Deliverables
        </h4>
        <ul style="list-style: none; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
          ${data.deliverables.map(d => `
            <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; color: var(--foreground);">
              <span style="color: var(--accent); font-weight: bold;">•</span>
              <span>${d}</span>
            </li>
          `).join('')}
        </ul>
        <div style="border-top: 1px solid var(--line); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted);">Track Record Metric</span>
          <span style="font-family: var(--font-display); font-size: 1.2rem; color: var(--accent);">${data.metrics}</span>
        </div>
      `;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/**
 * Animated Numerical Counters for Impact Section
 */
function setupCounters() {
  const statElements = document.querySelectorAll('.stat-fig');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const format = el.getAttribute('data-format') || '';

          if (isNaN(target)) return;

          const duration = 1600;
          const startTime = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            let formattedVal = current.toFixed(target % 1 === 0 ? 0 : 1);
            if (format === 'comma') {
              formattedVal = Math.round(current).toLocaleString();
            }

            el.textContent = `${prefix}${formattedVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              if (format === 'comma') {
                el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
              } else {
                el.textContent = `${prefix}${target}${suffix}`;
              }
            }
          }

          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.3 });

  const impactSec = document.getElementById('impact');
  if (impactSec) observer.observe(impactSec);
}

/**
 * Working Consultation Inquiry Form Connected to SQLite Express Backend
 */
function setupInquiryForm() {
  const form = document.getElementById('inquiry-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-inquiry-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const company = form.company.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Please complete all required fields (*).';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Transmitting...</span>';
    statusEl.textContent = '';

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, subject, message })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        statusEl.className = 'form-status success';
        statusEl.textContent = 'Inquiry logged directly to secure database. Marcus will review your message.';
        form.reset();
      } else {
        statusEl.className = 'form-status error';
        statusEl.textContent = data.error || 'Failed to transmit inquiry. Please try again.';
      }
    } catch (err) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Network or server error. Please check your connection.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Transmit Strategic Inquiry</span><span class="submit-arrow">→</span>';
    }
  });
}
