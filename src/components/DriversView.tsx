import React from 'react';
import { Driver, SensorySettings } from '../types';
import { soundManager } from '../lib/audio';
import { Users, Check, Lock, Sparkles, Heart } from 'lucide-react';

interface DriversViewProps {
  drivers: Driver[];
  activeDriverId: string;
  coins: number;
  sensorySettings: SensorySettings;
  onSelectDriver: (driverId: string) => void;
  onUnlockDriver: (driverId: string, price: number) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  drivers,
  activeDriverId,
  coins,
  sensorySettings,
  onSelectDriver,
  onUnlockDriver,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-slate-900 border border-purple-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/20 border border-purple-400/30 rounded-2xl text-purple-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              Pilotos Amigos & Companheiros
            </h2>
            <p className="text-xs sm:text-sm text-purple-200">
              Escolha seu amigo de corrida! Cada um traz vantagens especiais para a equipe.
            </p>
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {drivers.map((driver) => {
          const isActive = driver.id === activeDriverId;
          const canAfford = coins >= driver.price;

          return (
            <div
              key={driver.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden shadow-xl ${
                isActive
                  ? 'bg-purple-950/70 border-purple-400 ring-4 ring-purple-400/30 scale-[1.02]'
                  : driver.unlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div>
                {/* Avatar Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl border-2 shadow-lg ${driver.avatarColor}`}>
                    {driver.avatarEmoji}
                  </div>

                  {isActive && (
                    <span className="px-3 py-1 bg-purple-500 text-white font-black text-xs rounded-full flex items-center gap-1 shadow">
                      <Check className="w-3.5 h-3.5" />
                      <span>Em Uso</span>
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-white mb-0.5">
                  {driver.name}
                </h3>
                <p className="text-xs font-bold text-purple-300 mb-2">
                  {driver.title}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {driver.description}
                </p>

                {/* Perk Box */}
                <div className="bg-slate-950/80 border border-purple-500/30 p-3 rounded-2xl mb-4">
                  <span className="text-[10px] uppercase font-black text-purple-400 block mb-1">
                    Super Habilidade:
                  </span>
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{driver.perkText}</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {driver.unlocked ? (
                <button
                  onClick={() => {
                    onSelectDriver(driver.id);
                    soundManager.playFanfare(sensorySettings);
                  }}
                  disabled={isActive}
                  className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs transition-all touch-manipulation active:scale-95 ${
                    isActive
                      ? 'bg-purple-800 text-purple-200 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 shadow-md'
                  }`}
                >
                  {isActive ? 'Piloto Ativo' : 'Escolher Piloto'}
                </button>
              ) : (
                <button
                  disabled={!canAfford}
                  onClick={() => onUnlockDriver(driver.id, driver.price)}
                  className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Convidar ({driver.price} 🪙)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
