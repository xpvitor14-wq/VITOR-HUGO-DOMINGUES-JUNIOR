import React, { useState } from 'react';
import { Car, Driver, SensorySettings } from '../types';
import { soundManager } from '../lib/audio';
import { Volume2, Music, Sparkles, Heart, Mic, Play, Pause, Disc } from 'lucide-react';

interface SoundExplorationViewProps {
  cars: Car[];
  drivers: Driver[];
  sensorySettings: SensorySettings;
  onUpdateSettings: (settings: SensorySettings) => void;
}

export const SoundExplorationView: React.FC<SoundExplorationViewProps> = ({
  cars,
  drivers,
  sensorySettings,
  onUpdateSettings,
}) => {
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);
  const [continuousHumActive, setContinuousHumActive] = useState<boolean>(false);
  const [humPitch, setHumPitch] = useState<number>(0.4);

  const handlePlayCarSound = (car: Car) => {
    setPlayingSoundId(car.id);
    soundManager.playCarSound(car.id, sensorySettings);
    setTimeout(() => setPlayingSoundId(null), 800);
  };

  const handlePlayDriverSound = (driver: Driver) => {
    setPlayingSoundId(driver.id);
    soundManager.playDriverSound(driver.id, sensorySettings);
    setTimeout(() => setPlayingSoundId(null), 800);
  };

  const handlePlayFx = (fxType: string) => {
    setPlayingSoundId(fxType);
    if (fxType === 'coin') soundManager.playCoin(sensorySettings);
    if (fxType === 'turbo') soundManager.playTurbo(sensorySettings);
    if (fxType === 'pop') soundManager.playPop(sensorySettings);
    if (fxType === 'upgrade') soundManager.playUpgrade(sensorySettings);
    if (fxType === 'fanfare') soundManager.playFanfare(sensorySettings);
    setTimeout(() => setPlayingSoundId(null), 800);
  };

  const handlePlayChime = (noteIdx: number) => {
    setPlayingSoundId(`chime_${noteIdx}`);
    soundManager.playCalmChime(noteIdx, sensorySettings);
    setTimeout(() => setPlayingSoundId(null), 800);
  };

  const toggleContinuousHum = () => {
    const next = !continuousHumActive;
    setContinuousHumActive(next);
    if (next) {
      soundManager.startEngineHum(sensorySettings, humPitch);
    } else {
      soundManager.stopEngineHum();
    }
  };

  const handleHumChange = (newPitch: number) => {
    setHumPitch(newPitch);
    if (continuousHumActive) {
      soundManager.startEngineHum(sensorySettings, newPitch);
    }
  };

  const soundNotes = [
    { label: 'Dó 🌸', color: 'from-pink-500 to-rose-400' },
    { label: 'Ré ☀️', color: 'from-amber-400 to-yellow-300 text-slate-950' },
    { label: 'Mi 🌿', color: 'from-emerald-400 to-teal-300 text-slate-950' },
    { label: 'Sol 🌊', color: 'from-sky-400 to-blue-500' },
    { label: 'Lá 🔮', color: 'from-purple-400 to-indigo-500' },
    { label: 'Dó 2 ✨', color: 'from-pink-400 to-purple-400' },
    { label: 'Ré 2 ⚡', color: 'from-yellow-300 to-amber-500 text-slate-950' },
    { label: 'Mi 2 🍃', color: 'from-teal-300 to-emerald-500 text-slate-950' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 border border-sky-600/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-sky-500/20 border border-sky-400/30 rounded-2xl text-sky-300">
            <Volume2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              Explorador Sensorial de Sons & Música 🎧
            </h2>
            <p className="text-xs sm:text-sm text-sky-200">
              Espaço calmo e sem pressa para ouvir, testar e relaxar com todos os sons dos carros, pilotos e notas musicais.
            </p>
          </div>
        </div>

        {/* Calm Status Badge */}
        <div className="bg-slate-900/80 border border-sky-400/40 px-4 py-2 rounded-2xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-300" />
          <span className="text-xs font-bold text-sky-200">
            Ambiente Calmo Sem Tempo
          </span>
        </div>
      </div>

      {/* Section 1: Sons dos Carros */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-base text-white">
            Sons de Motores dos Carros
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {cars.map((car) => {
            const isPlaying = playingSoundId === car.id;
            return (
              <button
                key={car.id}
                onClick={() => handlePlayCarSound(car)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all touch-manipulation active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-950 border-amber-400 ring-4 ring-amber-400/30 scale-105'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow"
                      style={{ backgroundColor: car.color }}
                    >
                      {car.sticker}
                    </span>
                    <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-amber-300 animate-bounce' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="font-extrabold text-xs text-white mb-1">
                    {car.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Toque para ouvir o tom suave do motor!
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-1 text-[10px] font-bold text-amber-300">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Ouvir Motor</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Sons dos Pilotos Amigos */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          <h3 className="font-extrabold text-base text-white">
            Saudações & Melodias dos Pilotos
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {drivers.map((driver) => {
            const isPlaying = playingSoundId === driver.id;
            return (
              <button
                key={driver.id}
                onClick={() => handlePlayDriverSound(driver)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all touch-manipulation active:scale-95 ${
                  isPlaying
                    ? 'bg-purple-950 border-purple-400 ring-4 ring-purple-400/30 scale-105'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${driver.avatarColor}`}>
                  {driver.avatarEmoji}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {driver.name}
                  </h4>
                  <p className="text-[11px] text-purple-300 font-bold">
                    {driver.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <Music className="w-3 h-3 text-purple-400" />
                    Toque para ouvir a voz alegre
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Teclado Relaxante Pentatônico (Chimes Calmos) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">
                Teclado Relaxante Pentatônico
              </h3>
              <p className="text-xs text-slate-400">
                Notas musicais harmoniosas que sempre soam perfeitas juntas!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {soundNotes.map((note, idx) => {
            const isPlaying = playingSoundId === `chime_${idx}`;
            return (
              <button
                key={idx}
                onClick={() => handlePlayChime(idx)}
                className={`py-6 px-3 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-2 bg-gradient-to-b ${note.color} shadow-lg transition-transform active:scale-90 touch-manipulation ${
                  isPlaying ? 'ring-4 ring-white scale-110' : 'hover:brightness-110'
                }`}
              >
                <span>{note.label}</span>
                <Sparkles className="w-4 h-4 opacity-75" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 4: Zumbido Contínuo Relaxante (Sensorial Frequência Constante) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-300">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Zumbido de Frequência Contínua (Vibração Suave)
              </h3>
              <p className="text-xs text-slate-400">
                Um tom contínuo e suave de motor para autorregulação sensorial.
              </p>
            </div>
          </div>

          <button
            onClick={toggleContinuousHum}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              continuousHumActive
                ? 'bg-rose-500 text-slate-950 animate-pulse'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {continuousHumActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{continuousHumActive ? 'Parar Som Suave' : 'Iniciar Som Suave'}</span>
          </button>
        </div>

        {continuousHumActive && (
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Ajustar Tom da Frequência:</span>
              <span className="font-bold text-indigo-300">
                {Math.round(80 + humPitch * 120)} Hz (Grave & Acolhedor)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={humPitch}
              onChange={(e) => handleHumChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Section 5: Outros Efeitos do Jogo */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="font-extrabold text-base text-white">
          Efeitos de Áudio do Jogo
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'coin', label: 'Moeda Ding 🪙', icon: '🪙' },
            { id: 'turbo', label: 'Impulso Turbo ⚡', icon: '⚡' },
            { id: 'pop', label: 'Bolha Pop 🫧', icon: '🫧' },
            { id: 'upgrade', label: 'Evolução ✨', icon: '✨' },
            { id: 'fanfare', label: 'Vitória 🏆', icon: '🏆' },
          ].map((fx) => {
            const isPlaying = playingSoundId === fx.id;
            return (
              <button
                key={fx.id}
                onClick={() => handlePlayFx(fx.id)}
                className={`p-3.5 rounded-2xl border text-center font-extrabold text-xs flex flex-col items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-500 border-amber-300 text-slate-950 scale-105'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span className="text-2xl">{fx.icon}</span>
                <span>{fx.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
