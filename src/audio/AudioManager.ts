class AudioManager {
  private ctx: AudioContext | null = null;
  muted = false;

  private get ac(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  playArrow() {
    if (this.muted) return;
    const ctx = this.ac;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.2);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playAxe() {
    if (this.muted) return;
    const ctx = this.ac;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.15);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playFire() {
    if (this.muted) return;
    const ctx = this.ac;
    const t = ctx.currentTime;
    const dur = 0.28;
    const size = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 1.4);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(180, t + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.38, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur);
  }
}

export const audioManager = new AudioManager();
