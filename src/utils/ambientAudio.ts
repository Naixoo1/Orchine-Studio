'use client';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private lfoNode: OscillatorNode | null = null;

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // 1. Generate 5 seconds of pink noise buffer (warm organic forest wind)
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    // 2. Low-pass filter to simulate soft breeze through trees & silk rustle
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(380, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // 3. LFO to gently undulate wind intensity
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.frequency.setValueAtTime(0.18, this.ctx.currentTime); // Gentle 0.18Hz wave
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    this.lfoNode.connect(lfoGain);
    lfoGain.connect(this.filterNode.frequency);
    this.lfoNode.start();

    // 4. Master Gain Node
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    // 5. Looping noise source
    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.noiseNode.start();
  }

  public play() {
    this.init();
    if (!this.ctx || !this.gainNode) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + 1.5);
    this.isPlaying = true;
  }

  public pause() {
    if (!this.ctx || !this.gainNode) return;
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
    this.isPlaying = false;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getActive(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = typeof window !== 'undefined' ? new AmbientSoundEngine() : null;
