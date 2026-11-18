/**
/**
 * Modern High-Reliability Web Audio Synthesizer
 * Zero-bandwidth, pure Web Audio API synthesizer for tactile UI micro-sounds.
 * Resilient against browser autoplay policies, suspended contexts, and rapid clicks.
 */

let audioCtx = null;
let soundEnabled = true;

// Pre-initialize and register global user-gesture unlock
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch (_) {}
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
  window.addEventListener('keydown', unlockAudio, { passive: true, once: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

function runWithActiveContext(callback) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume()
      .then(() => {
        try { callback(ctx); } catch (_) {}
      })
      .catch(() => {});
  } else {
    try { callback(ctx); } catch (_) {}
  }
}

export const soundManager = {
  toggleSound() {
    if (soundEnabled) {
      // Play a quick low mute tone before muting
      runWithActiveContext((ctx) => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      });
      soundEnabled = false;
    } else {
      soundEnabled = true;
      // Play an upbeat unmute chime
      runWithActiveContext((ctx) => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      });
    }
    return soundEnabled;
  },

  isSoundEnabled() {
    return soundEnabled;
  },

  // Subtle sci-fi hover chirp
  playHover() {
    runWithActiveContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    });
  },

  // Crisp tactile click tone that triggers reliably on every click
  playClick() {
    runWithActiveContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    });
  },

  // Portal energy pulse tone
  playWarp() {
    runWithActiveContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    });
  },

  // Cinematic Laser Etch & Chrome Resonance Impact
  playCinematicSculpt() {
    runWithActiveContext((ctx) => {
      const now = ctx.currentTime;

      // 1. High-frequency laser tracing sizzle
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(8000, now + 0.35);
      filter.Q.value = 4.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now);

      // 2. Resonant Chrome Chord & Sub Impact
      setTimeout(() => {
        runWithActiveContext((c) => {
          const t = c.currentTime;
          // Deep impact sub
          const sub = c.createOscillator();
          const subG = c.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(90, t);
          sub.frequency.exponentialRampToValueAtTime(45, t + 0.8);
          subG.gain.setValueAtTime(0.2, t);
          subG.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
          sub.connect(subG);
          subG.connect(c.destination);
          sub.start(t);
          sub.stop(t + 0.8);

          // Crystal metallic harmonics (E5, G#5, B5, E6)
          [659.25, 830.61, 987.77, 1318.51].forEach((freq, idx) => {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.03);
            gain.gain.setValueAtTime(0.04 / (idx + 1), t + idx * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.03 + 1.2);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(t + idx * 0.03);
            osc.stop(t + idx * 0.03 + 1.2);
          });
        });
      }, 750);
    });
  }
};
