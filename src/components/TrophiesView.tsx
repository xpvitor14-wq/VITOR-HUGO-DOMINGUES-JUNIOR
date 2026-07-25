import React from 'react';
import { Trophy as TrophyType, SensorySettings } from '../types';
import { ASSETS } from '../data/initialData';
import { soundManager } from '../lib/audio';
import { Award, Trophy, CheckCircle2, Sparkles } from 'lucide-react';

interface TrophiesViewProps {
  trophies: TrophyType[];
  trophiesCount: number;
  sensorySettings: SensorySettings;
  onClaimTrophy: (trophyId: string, rewardCoins: number) => void;
}

export const TrophiesView: React.FC<TrophiesViewProps> = ({
  trophies,
  trophiesCount,
  sensorySettings,
  onClaimTrophy,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Top Trophy Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-yellow-900 to-slate-900 border border-amber-600/60 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shrink-0">
            <img
              src={ASSETS.trophyBadge}
              alt="Galeria de Troféus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              Galeria de Troféus & Conquistas
            </h2>
            <p className="text-xs sm:text-sm text-amber-200">
              Colecione troféus brilhantes por correr, personalizar carros e se divertir!
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="bg-slate-900/90 border border-amber-400/50 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
          <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400/30" />
          <div>
            <span className="text-[10px] uppercase font-black text-amber-300 block">
              Total de Troféus Conquistados
            </span>
            <span className="font-black text-2xl text-yellow-300">
              {trophiesCount} / {trophies.length}
            </span>
          </div>
        </div>
      </div>

      {/* Trophy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trophies.map((trophy) => {
          const isComplete = trophy.progress >= trophy.maxProgress;

          return (
            <div
              key={trophy.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all shadow-xl ${
                trophy.unlocked
                  ? 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/20'
                  : isComplete
                  ? 'bg-slate-900 border-amber-400 animate-pulse'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl p-2 bg-slate-950 rounded-2xl border border-slate-800">
                    {trophy.icon}
                  </span>

                  {trophy.unlocked ? (
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Conquistado!</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 font-bold text-xs rounded-full">
                      Recompensa: +{trophy.rewardCoins} 🪙
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-white mb-1">
                  {trophy.title}
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  {trophy.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Progresso:</span>
                    <span className="text-amber-300">
                      {trophy.progress} / {trophy.maxProgress}
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (trophy.progress / trophy.maxProgress) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {isComplete && !trophy.unlocked ? (
                <button
                  onClick={() => {
                    soundManager.playFanfare(sensorySettings);
                    onClaimTrophy(trophy.id, trophy.rewardCoins);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Resgatar Troféu (+{trophy.rewardCoins} 🪙)</span>
                </button>
              ) : trophy.unlocked ? (
                <div className="text-center text-xs font-bold text-amber-300/80 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  Troféu na sua Galeria ⭐
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500 py-2">
                  Em andamento na pista...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
