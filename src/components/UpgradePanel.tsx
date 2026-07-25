import React from 'react';
import { Upgrade, SensorySettings } from '../types';
import { INITIAL_UPGRADES } from '../data/initialData';
import { soundManager } from '../lib/audio';
import { ArrowUpCircle, Sparkles } from 'lucide-react';

interface UpgradePanelProps {
  coins: number;
  upgrades: Record<string, number>;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
  sensorySettings: SensorySettings;
}

export const UpgradePanel: React.FC<UpgradePanelProps> = ({
  coins,
  upgrades,
  onBuyUpgrade,
  sensorySettings,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Melhorias & Power-Ups
            </h3>
            <p className="text-xs text-slate-400">
              Evolua as habilidades do seu carro para correr mais rápido!
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Upgrades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {INITIAL_UPGRADES.map((upgrade) => {
          const currentLevel = upgrades[upgrade.id] || 1;
          const isMax = currentLevel >= upgrade.maxLevel;
          const cost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel - 1));
          const canAfford = coins >= cost && !isMax;

          return (
            <div
              key={upgrade.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                canAfford
                  ? 'bg-slate-800/80 border-slate-700 hover:border-amber-500/60'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl p-1 bg-slate-900 rounded-xl border border-slate-800">
                    {upgrade.icon}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full font-black text-xs">
                    Nível {currentLevel}/{upgrade.maxLevel}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs sm:text-sm text-white mb-1">
                  {upgrade.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight mb-3">
                  {upgrade.description}
                </p>
              </div>

              {/* Upgrade Button */}
              <button
                disabled={!canAfford}
                onClick={() => {
                  if (canAfford) {
                    soundManager.playUpgrade(sensorySettings);
                    onBuyUpgrade(upgrade.id, cost);
                  }
                }}
                className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all min-h-[40px] touch-manipulation active:scale-95 ${
                  isMax
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : canAfford
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md'
                    : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {isMax ? (
                  <span>Nível Máximo ⭐</span>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>Evoluir ({cost} 🪙)</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
