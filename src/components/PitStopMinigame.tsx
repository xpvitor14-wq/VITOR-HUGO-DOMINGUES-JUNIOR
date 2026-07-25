import React, { useState } from 'react';
import { Car, SensorySettings } from '../types';
import { soundManager } from '../lib/audio';
import { Wrench, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface PitStopMinigameProps {
  activeCar: Car;
  cleanliness: number;
  tireHealth: number;
  sensorySettings: SensorySettings;
  onCleanCar: () => void;
  onRepairTires: () => void;
}

export const PitStopMinigame: React.FC<PitStopMinigameProps> = ({
  activeCar,
  cleanliness,
  tireHealth,
  sensorySettings,
  onCleanCar,
  onRepairTires,
}) => {
  const [bubbles, setBubbles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [tiresChecked, setTiresChecked] = useState<boolean[]>([false, false, false, false]);

  const handlePopBubble = (index: number) => {
    soundManager.playPop(sensorySettings);
    setBubbles((prev) => prev.filter((i) => i !== index));

    if (bubbles.length <= 1) {
      soundManager.playFanfare(sensorySettings);
      onCleanCar();
      setTimeout(() => setBubbles([1, 2, 3, 4, 5, 6, 7, 8]), 1000);
    }
  };

  const handleCheckTire = (index: number) => {
    soundManager.playPop(sensorySettings);
    const newTires = [...tiresChecked];
    newTires[index] = true;
    setTiresChecked(newTires);

    if (newTires.every((t) => t)) {
      soundManager.playFanfare(sensorySettings);
      onRepairTires();
      setTimeout(() => setTiresChecked([false, false, false, false]), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 border border-teal-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-teal-500/20 border border-teal-400/30 rounded-2xl text-teal-300">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              Lava-Rápido & Oficina Pit-Stop
            </h2>
            <p className="text-xs sm:text-sm text-teal-200">
              Estação relaxante! Lave seu carro com bolhas e troque os pneus para velocidade total.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minigame 1: Lava-Rápido de Bolhas */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>🧼 Lava-Rápido de Espuma</span>
              </h3>
              <span className="text-xs font-black text-teal-300 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                Limpeza: {cleanliness}%
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Toque nas bolhas de sabão para estourar todas e deixar o carro brilhando!
            </p>

            {/* Interactive Car Wash Area */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[200px] flex items-center justify-center relative overflow-hidden">
              {/* Car Icon */}
              <div className="text-7xl select-none" style={{ filter: cleanliness === 100 ? 'drop-shadow(0 0 15px #38BDF8)' : 'none' }}>
                🏎️
              </div>

              {/* Bubble Overlays */}
              <div className="absolute inset-0 p-4 flex flex-wrap items-center justify-center gap-4">
                {bubbles.map((b) => (
                  <button
                    key={b}
                    onClick={() => handlePopBubble(b)}
                    className="w-12 h-12 bg-sky-400/70 hover:bg-sky-300 border-2 border-white rounded-full flex items-center justify-center text-xl shadow-lg backdrop-blur-sm animate-bounce cursor-pointer touch-manipulation active:scale-75 transition-all"
                  >
                    🫧
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onCleanCar();
              soundManager.playFanfare(sensorySettings);
            }}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black rounded-2xl shadow-lg hover:brightness-110 transition-transform active:scale-95"
          >
            Lavagem Completa Instantânea (+100 🪙)
          </button>
        </div>

        {/* Minigame 2: Troca de Pneus */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>🛞 Troca de Pneus Rápidos</span>
              </h3>
              <span className="text-xs font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                Pneus: {tireHealth}%
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Toque nos 4 pneus para apertar os parafusos e deixar o carro pronto para a pista!
            </p>

            {/* Interactive Tire Grid */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[200px] grid grid-cols-2 gap-4 items-center justify-center">
              {tiresChecked.map((isChecked, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCheckTire(idx)}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all touch-manipulation active:scale-90 ${
                    isChecked
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛞</span>
                    <span className="font-bold text-xs">Pneu #{idx + 1}</span>
                  </div>
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[3]" />
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold">Toque!</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              onRepairTires();
              soundManager.playFanfare(sensorySettings);
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-2xl shadow-lg hover:brightness-110 transition-transform active:scale-95"
          >
            Revisão de Pneus Instantânea (+100 🪙)
          </button>
        </div>
      </div>
    </div>
  );
};
