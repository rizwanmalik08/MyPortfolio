/**
 * MERIDIAN CORE — Master Cinematic Motion & Interaction Engine
 * Exact Reference Motion Language, Timing, Sequencing & Three.js Atmosphere
 */

import { MarcusThreeBackground } from './three-hero.js';

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll (Paused initially for preloader)
  lenisInstance = initializeSmoothScroll();

  // 2. Initialize Three.js Architectural WebGL Atmosphere
  initializeThreeScene();

  // 3. Setup Navigation & Mobile Drawer
  setupNavigation();

  // 4. Setup Liquid Displacement Filters
  animateLiquidImage();

  // 5. Setup Interactive Voices Testimonials
  initializeTestimonials();

  // 6. Setup Ventures Modal
  setupVentureModal();

  // 7. Setup Numerical Impact Counters
  setupCounters();

  // 8. Setup Working Consultation Inquiry Form
  setupInquiryForm();

  // 9. Setup Scroll-Triggered Section Reveals
  animateSectionReveal();

  // 10. Start Cinematic Preloader Sequence
  runCinematicPreloader();
});

/* ==========================================================================
   1. TEXT SPLITTING UTILITIES (Characters, Words, Lines)
   ========================================================================== */

/**
 * Splits an element's text into individual character wrappers for staggered upward reveals.
 * @param {HTMLElement} element 
 * @returns {HTMLElement[]} Array of .char-inner elements
 */
export function splitTextIntoCharacters(element) {
  if (!element) return [];
  const text = element.textContent.trim();
  element.innerHTML = '';
  const inners = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const wrap = document.createElement('span');
    wrap.className = 'char-wrap';

    if (char === ' ') {
      wrap.innerHTML = '&nbsp;';
    } else {
      const inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.textContent = char;
      wrap.appendChild(inner);
      inners.push(inner);
    }
    element.appendChild(wrap);
  }

  return inners;
}

/**
 * Splits an element's text into individual word wrappers for staggered reveals.
 * @param {HTMLElement} element 
 * @returns {HTMLElement[]} Array of .quote-word-inner elements
 */
export function splitTextIntoWords(element) {
  if (!element) return [];
  const text = element.textContent.trim();
  element.innerHTML = '';
  const inners = [];

  const words = text.split(/\s+/);
  words.forEach((word) => {
    const wrap = document.createElement('span');
    wrap.className = 'quote-word';

    const inner = document.createElement('span');
    inner.className = 'quote-word-inner';
    inner.textContent = word;

    wrap.appendChild(inner);
    element.appendChild(wrap);
    inners.push(inner);
  });

  return inners;
}

/**
 * Splits heading text into lines for clipped vertical slide reveals.
 * @param {HTMLElement} element 
 * @returns {HTMLElement[]} Array of .split-line-inner elements
 */
export function splitTextIntoLines(element) {
  if (!element) return [];
  const text = element.innerHTML.trim();
  element.innerHTML = '';

  const wrap = document.createElement('span');
  wrap.className = 'split-line';
  const inner = document.createElement('span');
  inner.className = 'split-line-inner';
  inner.innerHTML = text;

  wrap.appendChild(inner);
  element.appendChild(wrap);

  return [inner];
}

/* ==========================================================================
   2. CINEMATIC PRELOADER SEQUENCE (EXACT TIMING SPEC)
   ========================================================================== */
function runCinematicPreloader() {
  const preloader = document.getElementById('cinematic-preloader');
  const numEl = document.getElementById('preloader-num');
  const contentEl = document.querySelector('.preloader-content');

  // Accessibility Check: Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !preloader) {
    if (preloader) preloader.style.display = 'none';
    if (lenisInstance) lenisInstance.start();
    document.body.style.overflow = '';
    animateHeroSequence(true);
    return;
  }

  // 1. Initial State: Lock scrolling & stop Lenis
  document.body.style.overflow = 'hidden';
  if (lenisInstance) lenisInstance.stop();

  // 2. Animate counter from 0% to 100% over exactly 2000ms
  const duration = 2000;
  const startTime = performance.now();

  function updateCounter(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth quadratic ease-out
    const easedProgress = 1 - Math.pow(1 - progress, 2);
    const currentVal = Math.round(easedProgress * 100);

    if (numEl) numEl.textContent = currentVal;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      if (numEl) numEl.textContent = 100;
      onCounterComplete();
    }
  }

  requestAnimationFrame(updateCounter);

  function onCounterComplete() {
    // 5. Once counter reaches 100%, fade out labels over 300ms
    if (contentEl) contentEl.classList.add('fade-out');

    // 6. Wait 200ms
    setTimeout(() => {
      // 7. Animate preloader upward (650ms, cubic-bezier(0.22, 1, 0.36, 1))
      preloader.classList.add('wipe-up');

      // 9. When upward wipe finishes (~650ms)
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lenisInstance) lenisInstance.start();

        // 10. Start hero entrance sequence
        animateHeroSequence(false);
      }, 650);
    }, 500); // 300ms fade + 200ms delay
  }
}

/* ==========================================================================
   3. HERO SIGNATURE MOTION (CHARACTER & LINE SEQUENCING)
   ========================================================================== */
export function animateHeroSequence(instant = false) {
  const lineEls = document.querySelectorAll('.hero-name .hn-line');
  const roleInners = document.querySelectorAll('.role-line .role-inner');
  const heroDesc = document.getElementById('hero-desc');
  const heroPortrait = document.getElementById('hero-portrait');
  const portraitImg = document.getElementById('hero-portrait-img');
  const scrollCue = document.getElementById('scroll-cue');

  if (instant) {
    lineEls.forEach(line => {
      splitTextIntoCharacters(line).forEach(char => char.classList.add('revealed'));
    });
    roleInners.forEach(r => r.classList.add('revealed'));
    if (heroDesc) heroDesc.classList.add('revealed');
    if (heroPortrait) heroPortrait.classList.add('revealed');
    if (scrollCue) scrollCue.classList.add('revealed');
    return;
  }

  // Split lines into characters
  const line1 = lineEls[0];
  const line2 = lineEls[1];

  const charsLine1 = line1 ? splitTextIntoCharacters(line1) : [];
  const charsLine2 = line2 ? splitTextIntoCharacters(line2) : [];

  // Line 1 characters: 52ms stagger, 900ms duration
  charsLine1.forEach((char, idx) => {
    setTimeout(() => {
      char.classList.add('revealed');
    }, idx * 52);
  });

  // Line 2 characters: starts 240ms after Line 1 starts, 52ms stagger
  setTimeout(() => {
    charsLine2.forEach((char, idx) => {
      setTimeout(() => {
        char.classList.add('revealed');
      }, idx * 52);
    });
  }, 240);

  // Role labels: 80ms stagger, 760ms duration
  roleInners.forEach((role, idx) => {
    setTimeout(() => {
      role.classList.add('revealed');
    }, 180 + (idx * 80));
  });

  // Hero description reveal: 520ms duration
  setTimeout(() => {
    if (heroDesc) heroDesc.classList.add('revealed');
  }, 320);

  // Founder cutout portrait reveal: scale 1.04 -> 1, opacity 0 -> 1 over 900ms
  setTimeout(() => {
    if (heroPortrait) heroPortrait.classList.add('revealed');
  }, 200);

  // Scroll cue appears after hero sequence settles
  setTimeout(() => {
    if (scrollCue) scrollCue.classList.add('revealed');
  }, 1400);

  // Mouse Parallax on Founder Cutout Portrait
  if (heroPortrait && portraitImg) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function portraitParallaxLoop() {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      portraitImg.style.transform = `translate3d(${currentX * -12}px, ${currentY * -8}px, 0)`;
      requestAnimationFrame(portraitParallaxLoop);
    }
    requestAnimationFrame(portraitParallaxLoop);
  }
}

/* ==========================================================================
   4. LIQUID IMAGE DISPLACEMENT FILTERS (feTurbulence + feDisplacementMap)
   ========================================================================== */
export function animateLiquidImage() {
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch) return; // Skip heavy SVG filter loops on mobile devices

  const filterConfigs = [
    {
      targetSelector: '#hero-portrait',
      filterId: 'dispHero',
      turbId: 'turbHero',
      restingScale: 1,
      hoverScale: 30,
      restingFreq: 0.009,
      hoverFreq: 0.022
    },
    {
      targetSelector: '.venture',
      filterId: 'dispVentures',
      turbId: 'turbVentures',
      restingScale: 1,
      hoverScale: 28,
      restingFreq: 0.009,
      hoverFreq: 0.024
    },
    {
      targetSelector: '.voice-panel',
      filterId: 'dispVoices',
      turbId: 'turbVoices',
      restingScale: 1,
      hoverScale: 22,
      restingFreq: 0.009,
      hoverFreq: 0.02
    }
  ];

  filterConfigs.forEach(cfg => {
    const dispEl = document.getElementById(cfg.filterId);
    const turbEl = document.getElementById(cfg.turbId);
    if (!dispEl || !turbEl) return;

    let currentScale = cfg.restingScale;
    let targetScale = cfg.restingScale;
    let currentFreq = cfg.restingFreq;
    let targetFreq = cfg.restingFreq;
    let isHovering = false;
    let animId = null;

    function springLoop() {
      currentScale += (targetScale - currentScale) * 0.085;
      currentFreq += (targetFreq - currentFreq) * 0.085;

      dispEl.setAttribute('scale', currentScale.toFixed(2));
      turbEl.setAttribute('baseFrequency', currentFreq.toFixed(4));

      // Continue animating until settled
      if (Math.abs(targetScale - currentScale) > 0.05 || isHovering) {
        animId = requestAnimationFrame(springLoop);
      } else {
        dispEl.setAttribute('scale', cfg.restingScale.toString());
        turbEl.setAttribute('baseFrequency', cfg.restingFreq.toString());
        animId = null;
      }
    }

    const targets = document.querySelectorAll(cfg.targetSelector);
    targets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        isHovering = true;
        targetScale = cfg.hoverScale;
        targetFreq = cfg.hoverFreq;
        if (!animId) animId = requestAnimationFrame(springLoop);
      });

      target.addEventListener('mouseleave', () => {
        isHovering = false;
        targetScale = cfg.restingScale;
        targetFreq = cfg.restingFreq;
        if (!animId) animId = requestAnimationFrame(springLoop);
      });
    });
  });
}

/* ==========================================================================
   5. LENIS SMOOTH SCROLLING INITIALIZATION
   ========================================================================== */
export function initializeSmoothScroll() {
  if (typeof window.Lenis === 'undefined') {
    console.warn('Lenis not found. Fallback to native scrolling.');
    return null;
  }

  const lenis = new window.Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.05,
    touchMultiplier: 1.8
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth Anchor Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, {
          offset: 0,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

  // Back to Top button
  const btt = document.getElementById('back-to-top');
  if (btt) {
    btt.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.4 });
    });
  }

  return lenis;
}

/* ==========================================================================
   6. THREE.JS 3D SCENE INITIALIZATION
   ========================================================================== */
export function initializeThreeScene() {
  try {
    new MarcusThreeBackground('three-sculpture-container');
  } catch (err) {
    console.warn('Three.js initialization notice:', err);
  }
}

/* ==========================================================================
   7. INTERACTIVE TESTIMONIALS (WORD-BY-WORD REVEAL ENGINE)
   ========================================================================== */
export function initializeTestimonials() {
  const voicesData = [
    {
      name: 'Elena Cardoso',
      role: 'Managing Partner, Meridian Ventures',
      quote: '“Marcus and the Meridian team saw the market three years before the rest of us. Betting alongside them changed the trajectory of my entire career.”',
      attribution: 'Elena Cardoso — Managing Partner, Meridian Ventures',
      image: '/assets/images/mv-voice-01.webp'
    },
    {
      name: 'David Okonkwo',
      role: 'Founder & CEO, Cadence Health',
      quote: '“When every institutional VC passed on our clinical telemetry hardware, Marcus wrote the first check and spent weekends with our firmware engineers solving thermal dissipation.”',
      attribution: 'David Okonkwo — Founder & CEO, Cadence Health',
      image: '/assets/images/team-marcus.jpg'
    },
    {
      name: 'Priya Nandakumar',
      role: 'CEO, Northwind Energy',
      quote: '“He understands grid dispatch dynamics and global capital markets equally well. That rare conviction is why Northwind scaled from prototype to NYSE listing.”',
      attribution: 'Priya Nandakumar — CEO, Northwind Energy',
      image: '/assets/images/team-elena.jpg'
    }
  ];

  const buttons = document.querySelectorAll('.voice-btn');
  const quoteEl = document.getElementById('voice-quote');
  const attrEl = document.getElementById('voice-attribution');
  const imgEl = document.getElementById('voice-image');

  function renderQuoteWithWordReveal(text) {
    if (!quoteEl) return;
    quoteEl.textContent = text;
    const words = splitTextIntoWords(quoteEl);

    // Stagger word reveal: 22ms stagger, 520ms duration (cubic-bezier(0.165, 0.84, 0.44, 1))
    words.forEach((w, idx) => {
      setTimeout(() => {
        w.classList.add('revealed');
      }, idx * 22);
    });
  }

  // Initial render of first quote
  if (quoteEl) {
    renderQuoteWithWordReveal(voicesData[0].quote);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(idx) || !voicesData[idx]) return;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = voicesData[idx];

      // Smooth switch with image fade
      if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
          imgEl.src = data.image;
          imgEl.alt = data.name;
          imgEl.style.opacity = '1';
        }, 180);
      }

      if (attrEl) {
        attrEl.textContent = data.attribution;
      }

      renderQuoteWithWordReveal(data.quote);
    });
  });
}

/* ==========================================================================
   8. SCROLL-TRIGGERED SECTION REVEALS (IntersectionObserver)
   ========================================================================== */
export function animateSectionReveal() {
  const sections = document.querySelectorAll('.reveal-section');

  // Split headings into lines for clean slide up
  document.querySelectorAll('.split-heading').forEach(heading => {
    splitTextIntoLines(heading);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;

        // Reveal split headings
        const headingInners = sec.querySelectorAll('.split-line-inner');
        headingInners.forEach((hi, idx) => {
          setTimeout(() => hi.classList.add('revealed'), idx * 100);
        });

        // Reveal body text
        const bodyEls = sec.querySelectorAll('.reveal-body');
        bodyEls.forEach((b, idx) => {
          setTimeout(() => b.classList.add('revealed'), 120 + (idx * 60));
        });

        // Reveal cards with progressive stagger
        const cards = sec.querySelectorAll('.reveal-card');
        cards.forEach((card, idx) => {
          setTimeout(() => {
            card.classList.add('revealed');
          }, 150 + (idx * 75));
        });

        observer.unobserve(sec);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(s => observer.observe(s));
}

/* ==========================================================================
   9. NAVIGATION SCROLL SPY & BURGER MENU
   ========================================================================== */
function setupNavigation() {
  const nav = document.querySelector('.site-nav');
  const burger = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Section Spy
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

/* ==========================================================================
   10. CASE STUDY VENTURE MODAL
   ========================================================================== */
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
      if (lenisInstance) lenisInstance.stop();
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ==========================================================================
   11. NUMERICAL IMPACT COUNTERS
   ========================================================================== */
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

/* ==========================================================================
   12. WORKING CONSULTATION INQUIRY FORM
   ========================================================================== */
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
        statusEl.textContent = 'Inquiry logged directly to secure database. Our partners will review your message.';
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
