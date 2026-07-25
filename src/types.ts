export type GameTab = 'race' | 'garage' | 'drivers' | 'pitstop' | 'sounds' | 'trophies';

export interface Car {
  id: string;
  name: string;
  description: string;
  baseSpeed: number; // 1-100
  baseAccel: number; // 1-100
  baseNitro: number; // 1-100
  price: number;
  unlocked: boolean;
  color: string; // hex
  secondaryColor?: string;
  sticker?: string; // emoji or id
  spoilerStyle: 'none' | 'sport' | 'wings' | 'cyber';
  wheelStyle: 'standard' | 'neon' | 'star' | 'chrome';
  shape: 'sedan' | 'f1' | 'truck' | 'beetle' | 'futuristic' | 'dino';
}

export interface Driver {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  title: string;
  description: string;
  perkText: string;
  coinMultiplier: number;
  speedBonus: number;
  nitroBonus: number;
  unlocked: boolean;
  price: number;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  icon: string;
  bgGradient: string;
  trackColor: string;
  curbColor1: string;
  curbColor2: string;
  unlocked: boolean;
  minTrophies: number;
  lapsToWin: number;
  rewardCoins: number;
}

export interface Upgrade {
  id: 'speed' | 'acceleration' | 'nitro' | 'pitstop' | 'coins';
  name: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  icon: string;
  description: string;
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
}

export interface SensorySettings {
  calmMode: boolean; // slows particles, softens colors
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  engineHum: boolean; // continuous soothing engine hum
  highContrast: boolean;
  largeText: boolean;
  gameSpeedScale: number; // 0.6 (calm) to 1.2 (fast)
  autoTurbo: boolean; // auto taps turbo for kids who prefer watching
}

export interface GameState {
  coins: number;
  trophiesCount: number;
  selectedCarId: string;
  selectedDriverId: string;
  selectedTrackId: string;
  cars: Car[];
  drivers: Driver[];
  upgrades: Record<string, number>; // upgradeId -> level
  trophies: Trophy[];
  tracks: Track[];
  pitStopCleanliness: number; // 0 to 100
  pitStopTireHealth: number; // 0 to 100
  totalLapsCompleted: number;
  totalTurbosUsed: number;
  totalCoinsEarned: number;
  totalPitStopsDone: number;
}
