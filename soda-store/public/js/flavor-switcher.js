/**
 * SODA Flavor Switcher Coordinator
 * Handles carousel controls, card clicking, GSAP synchronization, and active state
 */
export class FlavorSwitcher {
  constructor(sodaScene) {
    this.sodaScene = sodaScene;
    this.currentFlavor = 'diet-classic';
    this.flavors = [
      {
        slug: 'diet-classic',
        name: 'Diet Classic',
        tagline: 'Pure Botanical Kola',
        price: 2.99,
        fruit: 'Cherries',
        accent: '#0b8a78'
      },
      {
        slug: 'zero-lime',
        name: 'Zero Lime',
        tagline: 'Zesty Persian Lime',
        price: 2.99,
        fruit: 'Blueberries',
        accent: '#0b4f8a'
      }
    ];

    this.init();
  }

  init() {
    // 1. Flavor Cards
    const cards = document.querySelectorAll('.flavor-card, .flavor-card-pill');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const flavorSlug = card.dataset.flavor;
        if (flavorSlug && flavorSlug !== this.currentFlavor) {
          this.switch(flavorSlug);
        }
      });
    });

    // 2. Carousel Next / Prev Controls
    const prevBtn = document.getElementById('flavor-prev');
    const nextBtn = document.getElementById('flavor-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.toggleFlavor());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.toggleFlavor());
    }

    // 3. Quick Selector Radios in Product Section
    const radioInputs = document.querySelectorAll('input[name="flavor-select"]');
    radioInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        this.switch(e.target.value);
      });
    });
  }

  toggleFlavor() {
    const next = this.currentFlavor === 'diet-classic' ? 'zero-lime' : 'diet-classic';
    this.switch(next);
  }

  switch(flavorSlug) {
    if (this.currentFlavor === flavorSlug) return;
    if (this.sodaScene && this.sodaScene.isSwitching) return;

    this.currentFlavor = flavorSlug;

    // 1. Trigger Three.js 720° spin and asset swap
    if (this.sodaScene) {
      this.sodaScene.switchFlavor(flavorSlug);
    }

    // 2. Update Hero Flavor Cards
    const cards = document.querySelectorAll('.flavor-card, .flavor-card-pill');
    cards.forEach((card) => {
      const match = card.dataset.flavor === flavorSlug;
      card.classList.toggle('active', match);
      card.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // 3. Update Radios & UI badges across page
    const radio = document.querySelector(`input[name="flavor-select"][value="${flavorSlug}"]`);
    if (radio) radio.checked = true;

    // 4. Update dynamic active flavor label
    const labelEl = document.getElementById('active-flavor-name');
    if (labelEl) {
      labelEl.textContent = flavorSlug === 'zero-lime' ? 'Zero Lime' : 'Diet Classic';
    }

    // 5. Update body attribute for CSS hooks
    document.body.dataset.activeFlavor = flavorSlug;
  }
}
