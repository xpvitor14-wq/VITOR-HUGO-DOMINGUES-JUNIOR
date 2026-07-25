import { SensorySettings } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEnginePlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a short pleasant coin ding
  playCoin(settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      const vol = settings.soundVolume * (settings.calmMode ? 0.3 : 0.5);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback silent
    }
  }

  // Play turbo boost sound sweep
  playTurbo(settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = settings.calmMode ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);

      const vol = settings.soundVolume * (settings.calmMode ? 0.25 : 0.4);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // Play upgrade chime
  playUpgrade(settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const vol = settings.soundVolume * 0.4;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  // Play bubble pop for car wash
  playPop(settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 200, now + 0.05);

      const vol = settings.soundVolume * 0.3;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Fallback
    }
  }

  // Play victory fanfare chord
  playFanfare(settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const chords = [
        { freq: 523.25, delay: 0 },
        { freq: 659.25, delay: 0.1 },
        { freq: 783.99, delay: 0.2 },
        { freq: 1046.50, delay: 0.35 },
      ];
      const vol = settings.soundVolume * (settings.calmMode ? 0.3 : 0.5);

      chords.forEach(({ freq, delay }) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch {
      // Fallback
    }
  }

  // Soothing engine hum loop
  startEngineHum(settings: SensorySettings, speedRatio: number) {
    if (!settings.soundEnabled || !settings.engineHum || settings.soundVolume <= 0) {
      this.stopEngineHum();
      return;
    }
    this.initCtx();
    if (!this.ctx) return;

    try {
      const targetFreq = 80 + speedRatio * 120; // gentle pitch 80Hz - 200Hz
      const targetVol = settings.soundVolume * (settings.calmMode ? 0.08 : 0.15);

      if (!this.engineOsc || !this.isEnginePlaying) {
        this.engineOsc = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();

        this.engineOsc.type = 'sine'; // very soft sine hum
        this.engineOsc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);
        this.engineGain.gain.setValueAtTime(targetVol, this.ctx.currentTime);

        this.engineOsc.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);

        this.engineOsc.start();
        this.isEnginePlaying = true;
      } else if (this.engineOsc && this.engineGain) {
        this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
        this.engineGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.1);
      }
    } catch {
      // Fallback
    }
  }

  stopEngineHum() {
    if (this.engineOsc && this.isEnginePlaying) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch {
        // Safe disconnect
      }
      this.engineOsc = null;
      this.engineGain = null;
      this.isEnginePlaying = false;
    }
  }

  // Play unique sound for specific Car
  playCarSound(carId: string, settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vol = settings.soundVolume * (settings.calmMode ? 0.25 : 0.4);

      if (carId === 'fusca_star') {
        // Soft classic beetle engine purr
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.2);
        osc.frequency.linearRampToValueAtTime(120, now + 0.5);
      } else if (carId === 'turbo_relampago') {
        // Fast electric whistle sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.4);
      } else if (carId === 'formula_estrela') {
        // High crisp F1 tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.3);
      } else if (carId === 'cyber_monster') {
        // Cyber synth bass hum
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.6);
      } else if (carId === 'dino_mobile') {
        // Dino fun low rumble
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.2);
        osc.frequency.linearRampToValueAtTime(80, now + 0.5);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
      }

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Fallback
    }
  }

  // Play friendly vocal/character chime for Driver
  playDriverSound(driverId: string, settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const vol = settings.soundVolume * (settings.calmMode ? 0.3 : 0.5);

      if (driverId === 'leo_lion') {
        // Leo Lion warmth chord (C4, G4, C5)
        [261.63, 392.0, 523.25].forEach((freq, idx) => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime + idx * 0.08;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        });
      } else if (driverId === 'luna_cat') {
        // Luna Cat purr melody (E5, G#5, B5)
        [659.25, 830.61, 987.77].forEach((freq, idx) => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime + idx * 0.09;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        });
      } else if (driverId === 'sparky_robot') {
        // Sparky Robot playful synth arpeggio (C5, D5, E5, G5)
        [523.25, 587.33, 659.25, 783.99].forEach((freq, idx) => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime + idx * 0.06;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(vol * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
        });
      } else if (driverId === 'bia_bunny') {
        // Bia Bunny high hop cascade (G5, B5, D6, G6)
        [783.99, 987.77, 1174.66, 1567.98].forEach((freq, idx) => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime + idx * 0.07;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        });
      }
    } catch {
      // Fallback
    }
  }

  // Play relaxing pentatonic chime note
  playCalmChime(noteIndex: number, settings: SensorySettings) {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const pentatonicScale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C D E G A C D E
      const freq = pentatonicScale[noteIndex % pentatonicScale.length];

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const vol = settings.soundVolume * (settings.calmMode ? 0.2 : 0.35);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2); // long soothing decay

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // Fallback
    }
  }
}

export const soundManager = new SoundManager();
