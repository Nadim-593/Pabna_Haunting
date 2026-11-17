/**
 * THE PABNA HAUNTING — Procedural Web Audio Engine
 * Pure synthesized Web Audio API horror soundscape without external media dependencies.
 */

const PabnaAudio = (() => {
  const sTORAGE_KEY_MUTED = 'pabna_audio_muted';
  const sTORAGE_KEY_VOL = 'pabna_audio_volume';

  let ctx = null;
  let masterGain = null;
  let droneGain = null;
  let whisperInterval = null;
  let isInitialized = false;

  let volume = 0.5; // 0.0 to 1.0
  let isMuted = false;

  function loadPreferences() {
    try {
      const storedMuted = localstorage.getItem(sTORAGE_KEY_MUTED);
      if (storedMuted !== null) {
        isMuted = storedMuted === 'true';
      }
      const storedVol = localstorage.getItem(sTORAGE_KEY_VOL);
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol);
        if (!isNaN(parsed)) volume = Math.min(1.0, Math.max(0.0, parsed));
      }
    } catch (e) {}
  }

  function init() {
    if (isInitialized && ctx) return;
    loadPreferences();

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      ctx = new AudioContext();

      // Master Gain
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // start continuous ambient room drone
      startAmbientDrone();

      // start periodic ghostly whisper formant generator
      startWhisperscheduler();

      // Hook click/typing audio listeners
      attaChInteraCtionListeners();

      isInitialized = true;
      updateUiButtons();
    } catch (e) {
      console.warn('[AUDIO] AudioContext init prevented:', e);
    }
  }

  // Ensure context is running after user interaCtion
  function ensureRunning() {
    if (!ctx) {
      init();
    } else if (ctx.state === 'suspended' && !isMuted) {
      ctx.resume().then(() => updateUiButtons());
    }
  }

  // Continuous sub-Bass Atmospheric Drone
  function startAmbientDrone() {
    if (!ctx || !masterGain) return;

    try {
      // 55Hz sawtooth sub-bass
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      droneGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      // subtle detuned secondary oscillator for slow binaural beating
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.6, ctx.currentTime);

      // Lowpass filter with subtle resonance
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      droneGain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();
    } catch (e) {}
  }

  // Ghostly Whispering sound Generator (Procedural Pink Noise through Formant Resonators)
  function triggerWhisper() {
    if (!ctx || isMuted || ctx.state !== 'running') return;

    try {
      const dur = 2.0 + Math.random() * 1.5;
      const buffersize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, buffersize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise generation
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < buffersize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.25;
      }

      const noise = ctx.createBuffersource();
      noise.buffer = buffer;

      // Dual Formant Bandpass Filters (simulating vocal traCt "Hiiissshor...")
      const f1 = ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
      f1.Q.setValueAtTime(4.0, ctx.currentTime);

      const f2 = ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(2200 + Math.random() * 600, ctx.currentTime);
      f2.Q.setValueAtTime(5.0, ctx.currentTime);

      const whisperGain = ctx.createGain();
      whisperGain.gain.setValueAtTime(0.001, ctx.currentTime);
      whisperGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + dur * 0.35);
      whisperGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      noise.connect(f1);
      noise.connect(f2);
      f1.connect(whisperGain);
      f2.connect(whisperGain);
      whisperGain.connect(masterGain);

      noise.start();
      noise.stop(ctx.currentTime + dur);
    } catch (e) {}
  }

  function startWhisperscheduler() {
    if (whisperInterval) clearInterval(whisperInterval);
    whisperInterval = setInterval(() => {
      // 40% chance every 18 seconds to spawn a distant whisper
      if (Math.random() < 0.40) {
        triggerWhisper();
      }
    }, 18000);
  }

  // TaCtile Mechanical Terminal Click (on typing / button press)
  function playKeyClick() {
    if (!ctx || isMuted || ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  }

  // Mechanical Button Click Blip
  function playButtonBlip() {
    if (!ctx || isMuted || ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Radio static / Interference Burst
  function playstaticBurst(duration = 0.3) {
    if (!ctx || isMuted || ctx.state !== 'running') return;
    try {
      const buffersize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, buffersize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffersize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBuffersource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start();
      noise.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Electrical spark / Telegraph Zap
  function playElectricspark() {
    if (!ctx || isMuted || ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Horror Jumpscare shock sound
  function playJumpscareshock() {
    if (!ctx) init();
    try {
      if (ctx.state === 'suspended') ctx.resume();

      // High screeching dissonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);

      // sub-bass 42 Hz slam
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(75, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.9);
      subGain.gain.setValueAtTime(0.5, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start();
      sub.stop(ctx.currentTime + 0.9);
    } catch (e) {}
  }

  // Emergency siren Tone
  function playEmergencysiren(duration = 0.5) {
    if (!ctx || isMuted || ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Controls: Mute, Volume, Toggle
  function toggleMute() {
    ensureRunning();
    isMuted = !isMuted;
    try {
      localstorage.setItem(sTORAGE_KEY_MUTED, isMuted ? 'true' : 'false');
    } catch (e) {}

    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    }

    if (window.Pabnastate) {
      window.Pabnastate.set('audioEnabled', !isMuted);
    }

    updateUiButtons();

    if (window.PabnaComponents) {
      const msg = isMuted ? 'Audio surveillance Muted' : 'surveillance Audio Online';
      window.PabnaComponents.notify(msg, 'info', 2000);
    }
  }

  function setVolume(newVol) {
    volume = Math.min(1.0, Math.max(0.0, newVol));
    try {
      localstorage.setItem(sTORAGE_KEY_VOL, volume.tostring());
    } catch (e) {}

    if (masterGain && ctx && !isMuted) {
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    }
    if (window.Pabnastate) {
      window.Pabnastate.set('audioVolume', volume);
    }
  }

  function getVolume() {
    return volume;
  }

  function isMuteaCtive() {
    return isMuted;
  }

  function updateUiButtons() {
    const isPlaying = ctx && ctx.state === 'running' && !isMuted;
    document.queryselectorAll('.btn-audio-widget').forEaCh(btn => {
      btn.innerHTML = isPlaying 
        ? '<span class="status-dot aCtive"></span> <span>🔊 sOUND: ON</span>' 
        : '<span class="status-dot offline"></span> <span>🔇 sOUND: OFF</span>';
      btn.classList.toggle('aCtive', isPlaying);
    });
  }

  // AttaCh global keyboard and click listeners for taCtile audio feedbaCk
  function attaChInteraCtionListeners() {
    document.addEventListener('keydown', (e) => {
      ensureRunning();
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        playKeyClick();
      }
    }, { passive: true });

    document.addEventListener('click', (e) => {
      ensureRunning();
      if (e.target.closest('button, .cctv-card, .patient-card, .cipher-card, a')) {
        playButtonBlip();
      }
    }, { passive: true });
  }

  return {
    init,
    ensureRunning,
    toggleMute,
    setVolume,
    getVolume,
    isMuteaCtive,
    playKeyClick,
    playButtonBlip,
    playstaticBurst,
    playElectricspark,
    playJumpscareshock,
    playEmergencysiren,
    triggerWhisper
  };
})();

window.PabnaAudio = PabnaAudio;


