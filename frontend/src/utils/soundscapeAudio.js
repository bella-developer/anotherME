/**
 * ESO Zenith Sanctuary Soundscape Audio Engine
 * Pure Web Audio API Generative Soundscapes
 * 100% autonomous, zero external network dependency, no missing audio files
 */

class SoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.currentTrack = null;
    this.activeNodes = [];
    this.isPlaying = false;
    this.volume = 0.5;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return true;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  stop() {
    if (!this.audioCtx) return;
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Ignore already stopped nodes
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  play(trackName = 'rain') {
    if (!this.init()) return;
    this.stop();
    this.currentTrack = trackName;
    this.isPlaying = true;

    switch (trackName) {
      case 'rain':
        this.playKyotoRain();
        break;
      case 'hearth':
        this.playMidnightHearth();
        break;
      case 'nordic':
        this.playNordicSolitude();
        break;
      case 'celestial':
        this.playCelestialTheta();
        break;
      default:
        this.playKyotoRain();
    }
  }

  // --- 1. Kyoto Rain: Pink noise filtered with gentle droplet simulation ---
  playKyotoRain() {
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter rain to sound like soft window rain
    const lowpass = this.audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(850, this.audioCtx.currentTime);

    const highpass = this.audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(150, this.audioCtx.currentTime);

    const rainGain = this.audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);

    whiteNoise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, lowpass, highpass, rainGain);
  }

  // --- 2. Midnight Hearth: Low warm fire crackling and deep ambient rumble ---
  playMidnightHearth() {
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise for deep warm fireplace bed
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
      // Sparse micro-crackles
      if (Math.random() < 0.0007) {
        output[i] += (Math.random() - 0.5) * 0.6;
      }
    }

    const brownNoise = this.audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const lowpass = this.audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(420, this.audioCtx.currentTime);

    const hearthGain = this.audioCtx.createGain();
    hearthGain.gain.setValueAtTime(0.65, this.audioCtx.currentTime);

    brownNoise.connect(lowpass);
    lowpass.connect(hearthGain);
    hearthGain.connect(this.masterGain);

    brownNoise.start();
    this.activeNodes.push(brownNoise, lowpass, hearthGain);
  }

  // --- 3. Nordic Solitude: 432Hz ambient drone with gentle phase shift ---
  playNordicSolitude() {
    const osc1 = this.audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(108, this.audioCtx.currentTime); // A2 base

    const osc2 = this.audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(216.5, this.audioCtx.currentTime); // Slight detune for shimmer

    const osc3 = this.audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(432, this.audioCtx.currentTime); // Pure 432Hz harmonic

    // LFO to slowly sweep filter
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime); // Slow 12s cycle

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(180, this.audioCtx.currentTime);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const droneGain = this.audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    this.activeNodes.push(osc1, osc2, osc3, lfo, lfoGain, filter, droneGain);
  }

  // --- 4. Celestial Theta: Focus & deep contemplative state (6Hz theta wave) ---
  playCelestialTheta() {
    const merger = this.audioCtx.createChannelMerger(2);

    // Left ear: 216Hz
    const leftOsc = this.audioCtx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(216, this.audioCtx.currentTime);

    // Right ear: 222Hz (6Hz binaural beat = Theta state)
    const rightOsc = this.audioCtx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(222, this.audioCtx.currentTime);

    const leftGain = this.audioCtx.createGain();
    leftGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    const rightGain = this.audioCtx.createGain();
    rightGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);

    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);

    merger.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.activeNodes.push(leftOsc, rightOsc, leftGain, rightGain, merger);
  }
}

export const soundscape = new SoundscapeEngine();
export default soundscape;
