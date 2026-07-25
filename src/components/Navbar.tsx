import React from 'react';
import { GameTab, SensorySettings } from '../types';
import { Settings, Sparkles, Trophy, Car, Users, Wrench, Award, Volume2, VolumeX, Music } from 'lucide-react';

interface NavbarProps {
  currentTab: GameTab;
  setCurrentTab: (tab: GameTab) => void;
  coins: number;
  trophiesCount: number;
  sensorySettings: SensorySettings;
  onOpenSensoryModal: () => void;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  coins,
  trophiesCount,
  sensorySettings,
  onOpenSensoryModal,
  onToggleSound,
}) => {
  const tabs: { id: GameTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'race', label: 'Corrida', icon: <Car className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
    { id: 'garage', label: 'Garagem', icon: <Sparkles className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500' },
    { id: 'drivers', label: 'Pilotos', icon: <Users className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'pitstop', label: 'Lava-Rápido', icon: <Wrench className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' },
    { id: 'sounds', label: 'Painel de Sons 🎧', icon: <Music className="w-5 h-5" />, color: 'from-sky-500 to-blue-600' },
    { id: 'trophies', label: 'Troféus', icon: <Award className="w-5 h-5" />, color: 'from-yellow-500 to-amber-600' },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-40 border-b border-slate-800 shadow-lg">
      {/* Top row: Brand + Currency + Sensory Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab('race')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl">
              ⭐
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 bg-clip-text text-transparent leading-none">
              Race Star
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-200/80 font-medium tracking-wide">
              Champions Idle
            </p>
          </div>
        </div>

        {/* Currency Counters */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-amber-500/30 px-3 py-1.5 rounded-full shadow-inner">
            <span className="text-lg animate-bounce">🪙</span>
            <span className="font-black text-amber-300 text-sm sm:text-base tracking-wide">
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Trophies */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-yellow-500/30 px-3 py-1.5 rounded-full shadow-inner">
            <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400/30" />
            <span className="font-black text-yellow-300 text-sm sm:text-base">
              {trophiesCount}
            </span>
          </div>
        </div>

        {/* Sensory & Settings Quick Controls */}
        <div className="flex items-center gap-1.5">
          {/* Audio Quick Mute */}
          <button
            onClick={onToggleSound}
            title={sensorySettings.soundEnabled ? 'Som Ativado' : 'Som Desativado'}
            className={`p-2 rounded-xl border transition-all ${
              sensorySettings.soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-rose-950/80 border-rose-800/60 text-rose-300'
            }`}
          >
            {sensorySettings.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5 text-rose-400" />
            )}
          </button>

          {/* Sensory / Accessibility Settings Modal Button */}
          <button
            onClick={onOpenSensoryModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              sensorySettings.calmMode
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-indigo-900/60 border-indigo-700/60 text-indigo-200 hover:bg-indigo-800/80'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span className="hidden md:inline">
              {sensorySettings.calmMode ? 'Modo Calmo ✨' : 'Acessibilidade'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-2 sm:px-4 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md scale-[1.02]`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
