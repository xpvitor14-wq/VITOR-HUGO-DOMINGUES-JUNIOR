import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Car, Driver, Track, SensorySettings } from '../types';
import { soundManager } from '../lib/audio';
import { Zap, Wrench, Sparkles, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

interface RaceCanvasProps {
  activeCar: Car;
  activeDriver: Driver;
  activeTrack: Track;
  sensorySettings: SensorySettings;
  upgrades: Record<string, number>;
  pitStopCleanliness: number;
  pitStopTireHealth: number;
  onLapComplete: (trackReward: number) => void;
  onTurboUse: () => void;
  onGoToPitStop: () => void;
  onChangeTrack: (trackId: string) => void;
  allTracks: Track[];
  trophiesCount: number;
}

interface AICar {
  id: string;
  name: string;
  color: string;
  sticker: string;
  progress: number; // 0 to 1 around track
  speed: number;
}

export const RaceCanvas: React.FC<RaceCanvasProps> = ({
  activeCar,
  activeDriver,
  activeTrack,
  sensorySettings,
  upgrades,
  pitStopCleanliness,
  pitStopTireHealth,
  onLapComplete,
  onTurboUse,
  onGoToPitStop,
  onChangeTrack,
  allTracks,
  trophiesCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [turboActive, setTurboActive] = useState(false);
  const [turboCooldown, setTurboCooldown] = useState(0); // 0 to 100
  const [currentLap, setCurrentLap] = useState(1);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Animation state refs
  const playerProgressRef = useRef<number>(0);
  const aiCarsRef = useRef<AICar[]>([
    { id: 'ai_1', name: 'Gatinho Turbo', color: '#EC4899', sticker: '🐱', progress: 0.15, speed: 0.85 },
    { id: 'ai_2', name: 'Ursinho Veloz', color: '#3B82F6', sticker: '🐻', progress: 0.35, speed: 0.78 },
    { id: 'ai_3', name: 'Coelho F1', color: '#10B981', sticker: '🐰', progress: 0.60, speed: 0.90 },
  ]);

  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string; life: number; size: number }[]>([]);

  // Calculate actual player speed based on stats & upgrades
  const speedUpgrade = upgrades.speed || 1;
  const accelUpgrade = upgrades.acceleration || 1;
  const nitroUpgrade = upgrades.nitro || 1;

  const pitFactor = ((pitStopCleanliness + pitStopTireHealth) / 200) * 0.3 + 0.7; // 0.7 to 1.0 multiplier
  const effectiveBaseSpeed = (activeCar.baseSpeed + speedUpgrade * 4 + activeDriver.speedBonus) * pitFactor;

  // Trigger Turbo
  const handleTriggerTurbo = useCallback(() => {
    if (turboCooldown > 0) return;

    setTurboActive(true);
    setTurboCooldown(100);
    soundManager.playTurbo(sensorySettings);
    onTurboUse();

    // Trigger particles
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      for (let i = 0; i < (sensorySettings.calmMode ? 10 : 25); i++) {
        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: sensorySettings.calmMode ? '#FDE047' : '#F59E0B',
          life: 1.0,
          size: Math.random() * 6 + 3,
        });
      }
    }

    // Nitro duration
    const nitroDuration = 1500 + nitroUpgrade * 100 + activeDriver.nitroBonus * 20;
    setTimeout(() => {
      setTurboActive(false);
    }, nitroDuration);
  }, [turboCooldown, sensorySettings, onTurboUse, nitroUpgrade, activeDriver.nitroBonus]);

  // Auto Turbo Timer if enabled
  useEffect(() => {
    if (!sensorySettings.autoTurbo || isPaused) return;

    const interval = setInterval(() => {
      if (turboCooldown <= 0) {
        handleTriggerTurbo();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [sensorySettings.autoTurbo, isPaused, turboCooldown, handleTriggerTurbo]);

  // Cooldown decrement loop
  useEffect(() => {
    if (turboCooldown <= 0) return;
    const timer = setInterval(() => {
      setTurboCooldown((prev) => Math.max(0, prev - 4));
    }, 100);
    return () => clearInterval(timer);
  }, [turboCooldown]);

  // Main Canvas Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear background & draw track theme
      ctx.clearRect(0, 0, w, h);

      // Track center & dimensions
      const centerX = w / 2;
      const centerY = h / 2;
      const radiusX = Math.min(w, h) * 0.38;
      const radiusY = Math.min(w, h) * 0.26;
      const trackWidth = Math.min(w, h) * 0.14;

      // Draw Background Canvas Gradient according to track
      if (activeTrack.id === 'track_rainbow') {
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, Math.max(w, h));
        bgGrad.addColorStop(0, '#3B0764');
        bgGrad.addColorStop(0.5, '#1E1B4B');
        bgGrad.addColorStop(1, '#0F172A');
        ctx.fillStyle = bgGrad;
      } else if (activeTrack.id === 'track_neon') {
        ctx.fillStyle = '#090D16';
      } else if (activeTrack.id === 'track_cosmic') {
        ctx.fillStyle = '#030712';
      } else {
        // Sunny
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#D97706');
        bgGrad.addColorStop(0.5, '#059669');
        bgGrad.addColorStop(1, '#0284C7');
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(0, 0, w, h);

      // Draw Decorative background stars/grass
      if (activeTrack.id === 'track_sunny') {
        // Draw green oval grass inside track
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX - trackWidth / 2, radiusY - trackWidth / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();
        ctx.restore();
      }

      // Draw Track Asphalt Base
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.lineWidth = trackWidth;
      ctx.strokeStyle = activeTrack.trackColor;
      ctx.stroke();

      // Draw Curb Borders
      ctx.lineWidth = 6;
      ctx.strokeStyle = activeTrack.curbColor1;
      ctx.setLineDash([12, 12]);
      ctx.stroke();

      // Center Lane Dashed Line
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FDE047';
      ctx.setLineDash([10, 15]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Finish Line Marker
      ctx.save();
      const finishAngle = Math.PI * 1.5; // Top of oval
      const finishX = centerX + Math.cos(finishAngle) * radiusX;
      const finishY = centerY + Math.sin(finishAngle) * radiusY;

      ctx.save();
      ctx.translate(finishX, finishY);
      ctx.rotate(0);
      ctx.fillStyle = '#FFFFFF';
      for (let i = -trackWidth / 2; i < trackWidth / 2; i += 12) {
        ctx.fillStyle = i % 24 === 0 ? '#FFFFFF' : '#000000';
        ctx.fillRect(i, -6, 12, 12);
      }
      ctx.restore();
      ctx.restore();

      // Update Player Progress if not paused
      if (!isPaused) {
        const gameSpeed = sensorySettings.gameSpeedScale;
        const currentSpeedMultiplier = (turboActive ? 1.8 : 1.0) * (accelUpgrade * 0.05 + 1);
        const delta = (effectiveBaseSpeed * 0.00012 * currentSpeedMultiplier * gameSpeed);

        playerProgressRef.current += delta;

        // Check lap completion
        if (playerProgressRef.current >= 1.0) {
          playerProgressRef.current -= 1.0;
          setCurrentLap((prev) => prev + 1);
          soundManager.playCoin(sensorySettings);
          onLapComplete(activeTrack.rewardCoins);

          setLastNotification(`Volta ${currentLap} Completada! +${activeTrack.rewardCoins} 🪙`);
          setTimeout(() => setLastNotification(null), 2000);
        }

        // Update AI progress
        aiCarsRef.current.forEach((ai) => {
          ai.progress = (ai.progress + ai.speed * 0.0001 * gameSpeed) % 1.0;
        });

        // Engine hum update
        soundManager.startEngineHum(sensorySettings, turboActive ? 1.0 : 0.5);
      }

      // Helper to calculate (x, y, angle) on the track ellipse
      const getTrackPos = (progress: number, laneOffset: number = 0) => {
        const angle = progress * Math.PI * 2 - Math.PI / 2;
        const rx = radiusX + laneOffset;
        const ry = radiusY + laneOffset;
        const x = centerX + Math.cos(angle) * rx;
        const y = centerY + Math.sin(angle) * ry;

        // Tangent angle for rotation
        const dx = -Math.sin(angle) * rx;
        const dy = Math.cos(angle) * ry;
        const tangentAngle = Math.atan2(dy, dx);

        return { x, y, angle: tangentAngle };
      };

      // Draw AI Cars
      aiCarsRef.current.forEach((ai, idx) => {
        const laneOffset = (idx - 1) * 14;
        const pos = getTrackPos(ai.progress, laneOffset);

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(pos.angle);

        // Body
        ctx.fillStyle = ai.color;
        ctx.beginPath();
        ctx.roundRect(-12, -7, 24, 14, 4);
        ctx.fill();

        // Sticker
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ai.sticker, 0, 0);

        ctx.restore();
      });

      // Draw Player Car
      const playerPos = getTrackPos(playerProgressRef.current, 0);

      ctx.save();
      ctx.translate(playerPos.x, playerPos.y);
      ctx.rotate(playerPos.angle);

      // Turbo Flame Effect
      if (turboActive) {
        ctx.save();
        ctx.fillStyle = sensorySettings.calmMode ? '#FDE047' : '#EF4444';
        ctx.beginPath();
        ctx.moveTo(-16, -4);
        ctx.lineTo(-28 - Math.random() * 8, 0);
        ctx.lineTo(-16, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Player Car Body
      ctx.fillStyle = activeCar.color;
      ctx.beginPath();
      ctx.roundRect(-16, -9, 32, 18, 6);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = activeCar.secondaryColor || '#FFFFFF';
      ctx.stroke();

      // Roof/Window
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(-4, -6, 14, 12, 3);
      ctx.fill();

      // Sticker Emoji
      if (activeCar.sticker) {
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeCar.sticker, 3, 0);
      }

      // Wheels
      ctx.fillStyle = activeCar.wheelStyle === 'neon' ? '#06B6D4' : '#1E293B';
      ctx.fillRect(-12, -11, 8, 3);
      ctx.fillRect(4, -11, 8, 3);
      ctx.fillRect(-12, 8, 8, 3);
      ctx.fillRect(4, 8, 8, 3);

      ctx.restore();

      // Render Particle System
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      soundManager.stopEngineHum();
    };
  }, [
    isPaused,
    sensorySettings,
    effectiveBaseSpeed,
    accelUpgrade,
    turboActive,
    activeCar,
    activeTrack,
    currentLap,
    onLapComplete,
  ]);

  // Handle Resize for responsive canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = Math.max(320, Math.min(500, rect.height || 400));
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const needsPitStop = pitStopCleanliness < 40 || pitStopTireHealth < 40;

  return (
    <div className="flex flex-col gap-3 w-full max-w-7xl mx-auto">
      {/* Track Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
            Pistas:
          </span>
          <div className="flex items-center gap-1.5">
            {allTracks.map((track) => {
              const isSelected = track.id === activeTrack.id;
              const isUnlocked = track.unlocked || trophiesCount >= track.minTrophies;

              return (
                <button
                  key={track.id}
                  disabled={!isUnlocked}
                  onClick={() => onChangeTrack(track.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-950/60 text-slate-600 cursor-not-allowed border border-slate-800'
                  }`}
                >
                  <span>{track.icon}</span>
                  <span>{track.name}</span>
                  {!isUnlocked && (
                    <span className="text-[10px] text-amber-500/80">
                      ({track.minTrophies}🏆)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Play/Pause Control */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          title={isPaused ? 'Continuar Corrida' : 'Pausar Corrida'}
        >
          {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* Main Canvas Race Track Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden border-2 shadow-2xl transition-all ${
          activeTrack.bgGradient
        } ${sensorySettings.highContrast ? 'border-amber-400' : 'border-slate-700/80'}`}
        style={{ minHeight: '380px' }}
      >
        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleTriggerTurbo}
          className="w-full h-full block cursor-pointer touch-none"
        />

        {/* Top Overlay Banner: Driver & Car Info */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Active Car & Driver Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-xl pointer-events-auto">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${activeDriver.avatarColor}`}>
              {activeDriver.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm text-white">
                  {activeCar.name}
                </span>
                <span className="text-xs">{activeCar.sticker}</span>
              </div>
              <p className="text-[11px] text-amber-300 font-bold">
                Piloto: {activeDriver.name}
              </p>
            </div>
          </div>

          {/* Lap Counter & Speed Indicator */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="text-right">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 block leading-tight">
                Volta Atual
              </span>
              <span className="font-black text-lg text-emerald-400">
                #{currentLap}
              </span>
            </div>
          </div>
        </div>

        {/* Center Floating Lap Reward Toast */}
        {lastNotification && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-base shadow-2xl animate-bounce border-2 border-white pointer-events-none">
            {lastNotification}
          </div>
        )}

        {/* Pit Stop Needed Alert */}
        {needsPitStop && (
          <div className="absolute top-16 left-3 right-3 bg-rose-950/90 border border-rose-500/80 backdrop-blur-md p-2.5 rounded-2xl flex items-center justify-between text-white shadow-xl animate-pulse">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-bold">
                Atenção: Carro precisa de Lava-Rápido ou Troca de Pneus!
              </span>
            </div>
            <button
              onClick={onGoToPitStop}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-transform active:scale-95"
            >
              Ir para Pit-Stop 🧼
            </button>
          </div>
        )}

        {/* Bottom Interactive Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          {/* Interactive Tap Area Prompt */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 text-slate-300 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Toque na pista ou no botão para acelerar com Turbo!</span>
          </div>

          {/* Huge Tactile TURBO BOOST Button */}
          <button
            onClick={handleTriggerTurbo}
            disabled={turboCooldown > 0}
            className={`ml-auto flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-black text-base sm:text-lg shadow-2xl transition-all touch-manipulation select-none active:scale-95 ${
              turboCooldown > 0
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 hover:brightness-110 ring-4 ring-amber-400/30'
            }`}
          >
            <Zap className={`w-6 h-6 fill-current ${turboActive ? 'animate-bounce text-slate-950' : 'text-slate-950'}`} />
            <span>{turboCooldown > 0 ? `Aguarde (${Math.ceil(turboCooldown / 20)}s)` : 'TURBO ESTRELA!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
