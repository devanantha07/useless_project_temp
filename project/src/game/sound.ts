let ctx: AudioContext | null = null;
let enabled = false;

function getCtx(): AudioContext | null {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
  if (value) {
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume();
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  startOffset = 0,
): void {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const now = c.currentTime + startOffset;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

export function playClick(): void {
  playTone(800, 0.05, 'square', 0.08);
}

export function playCountdownBeep(): void {
  playTone(600, 0.15, 'sine', 0.12);
}

export function playDramaStart(): void {
  playTone(880, 0.3, 'sawtooth', 0.15);
  playTone(440, 0.3, 'sawtooth', 0.1, 0.05);
}

export function playLevelPassed(): void {
  playTone(523, 0.15, 'sine', 0.15);
  playTone(659, 0.15, 'sine', 0.15, 0.12);
  playTone(784, 0.3, 'sine', 0.15, 0.24);
}

export function playLevelFailed(): void {
  playTone(300, 0.2, 'sawtooth', 0.12);
  playTone(200, 0.4, 'sawtooth', 0.12, 0.15);
}

export function playAchievement(): void {
  playTone(659, 0.1, 'sine', 0.12);
  playTone(880, 0.1, 'sine', 0.12, 0.08);
  playTone(1047, 0.25, 'sine', 0.12, 0.16);
}
