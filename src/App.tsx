import React, { useState, useEffect, useCallback } from 'react';
import { GameTab, GameState, SensorySettings, Car, Driver } from './types';
import {
  INITIAL_GAME_STATE,
  DEFAULT_SENSORY_SETTINGS,
  INITIAL_CARS,
  INITIAL_DRIVERS,
  INITIAL_TRACKS,
  INITIAL_TROPHIES,
  ASSETS,
} from './data/initialData';
import { soundManager } from './lib/audio';
import { Navbar } from './components/Navbar';
import { SensorySettingsModal } from './components/SensorySettingsModal';
import { RaceCanvas } from './components/RaceCanvas';
import { UpgradePanel } from './components/UpgradePanel';
import { GarageView } from './components/GarageView';
import { DriversView } from './components/DriversView';
import { PitStopMinigame } from './components/PitStopMinigame';
import { TrophiesView } from './components/TrophiesView';
import { SoundExplorationView } from './components/SoundExplorationView';

const STORAGE_KEY = 'race_star_champions_state_v1';
const SENSORY_KEY = 'race_star_champions_sensory_v1';

export default function App() {
  // Load initial states from localStorage
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_GAME_STATE;
  });

  const [sensorySettings, setSensorySettings] = useState<SensorySettings>(() => {
    try {
      const saved = localStorage.getItem(SENSORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SENSORY_SETTINGS;
  });

  const [currentTab, setCurrentTab] = useState<GameTab>('race');
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-Save Game State
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch {
      // Safe fallback
    }
  }, [gameState]);

  // Auto-Save Sensory Settings
  useEffect(() => {
    try {
      localStorage.setItem(SENSORY_KEY, JSON.stringify(sensorySettings));
    } catch {
      // Safe fallback
    }
  }, [sensorySettings]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Passive Idle Earnings Tick (Every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const activeDriver = prev.drivers.find((d) => d.id === prev.selectedDriverId) || prev.drivers[0];
        const coinUpgradeLevel = prev.upgrades.coins || 1;
        const passiveIncome = Math.round(5 * coinUpgradeLevel * activeDriver.coinMultiplier);

        return {
          ...prev,
          coins: prev.coins + passiveIncome,
          totalCoinsEarned: prev.totalCoinsEarned + passiveIncome,
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Get current active objects
  const activeCar = gameState.cars.find((c) => c.id === gameState.selectedCarId) || gameState.cars[0];
  const activeDriver = gameState.drivers.find((d) => d.id === gameState.selectedDriverId) || gameState.drivers[0];
  const activeTrack = gameState.tracks.find((t) => t.id === gameState.selectedTrackId) || gameState.tracks[0];

  // Handler: Lap Completion Reward
  const handleLapComplete = useCallback((trackReward: number) => {
    setGameState((prev) => {
      const driver = prev.drivers.find((d) => d.id === prev.selectedDriverId) || prev.drivers[0];
      const coinUpgrade = prev.upgrades.coins || 1;
      const totalEarned = Math.round(trackReward * driver.coinMultiplier * (1 + coinUpgrade * 0.15));

      const newTotalLaps = prev.totalLapsCompleted + 1;

      // Update Trophy progress for first race and 20 laps
      const updatedTrophies = prev.trophies.map((t) => {
        if (t.id === 'first_race') {
          return { ...t, progress: Math.min(t.maxProgress, t.progress + 1) };
        }
        if (t.id === 'laps_20') {
          return { ...t, progress: Math.min(t.maxProgress, newTotalLaps) };
        }
        return t;
      });

      return {
        ...prev,
        coins: prev.coins + totalEarned,
        totalCoinsEarned: prev.totalCoinsEarned + totalEarned,
        totalLapsCompleted: newTotalLaps,
        trophies: updatedTrophies,
        // Gradual pit stop wear
        pitStopCleanliness: Math.max(10, prev.pitStopCleanliness - 2),
        pitStopTireHealth: Math.max(10, prev.pitStopTireHealth - 3),
      };
    });
  }, []);

  // Handler: Turbo Use Count
  const handleTurboUse = useCallback(() => {
    setGameState((prev) => {
      const newTurbos = prev.totalTurbosUsed + 1;
      const updatedTrophies = prev.trophies.map((t) => {
        if (t.id === 'turbo_master') {
          return { ...t, progress: Math.min(t.maxProgress, newTurbos) };
        }
        return t;
      });

      return {
        ...prev,
        totalTurbosUsed: newTurbos,
        trophies: updatedTrophies,
      };
    });
  }, []);

  // Handler: Upgrade Purchase
  const handleBuyUpgrade = (upgradeId: string, cost: number) => {
    if (gameState.coins < cost) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      upgrades: {
        ...prev.upgrades,
        [upgradeId]: (prev.upgrades[upgradeId] || 1) + 1,
      },
    }));

    showToast(`Melhoria evoluída com sucesso! ⭐`);
  };

  // Handler: Car Select & Unlock
  const handleSelectCar = (carId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedCarId: carId,
    }));
    showToast(`Carro alterado! Prontos para a corrida! 🏎️`);
  };

  const handleUnlockCar = (carId: string, price: number) => {
    if (gameState.coins < price) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - price,
      cars: prev.cars.map((c) => (c.id === carId ? { ...c, unlocked: true } : c)),
      selectedCarId: carId,
    }));

    soundManager.playFanfare(sensorySettings);
    showToast(`Novo carro desbloqueado! Incrível! 🎉`);
  };

  const handleUpdateCarCustomization = (carId: string, updates: Partial<Car>) => {
    setGameState((prev) => ({
      ...prev,
      cars: prev.cars.map((c) => (c.id === carId ? { ...c, ...updates } : c)),
    }));
  };

  const handleCarPainted = () => {
    setGameState((prev) => {
      const updatedTrophies = prev.trophies.map((t) => {
        if (t.id === 'car_painter') {
          return { ...t, progress: 1 };
        }
        return t;
      });
      return { ...prev, trophies: updatedTrophies };
    });
  };

  // Handler: Driver Select & Unlock
  const handleSelectDriver = (driverId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedDriverId: driverId,
    }));
    showToast(`Novo piloto amigo escolhido! 🦁`);
  };

  const handleUnlockDriver = (driverId: string, price: number) => {
    if (gameState.coins < price) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - price,
      drivers: prev.drivers.map((d) => (d.id === driverId ? { ...d, unlocked: true } : d)),
      selectedDriverId: driverId,
    }));

    soundManager.playFanfare(sensorySettings);
    showToast(`Novo piloto convidado para a equipe! 🌟`);
  };

  // Handler: Track Change
  const handleChangeTrack = (trackId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedTrackId: trackId,
    }));
  };

  // Handler: Pit Stop Clean & Repair
  const handleCleanCar = () => {
    setGameState((prev) => {
      const updatedTrophies = prev.trophies.map((t) => {
        if (t.id === 'pit_crew') {
          return { ...t, progress: 1 };
        }
        return t;
      });

      return {
        ...prev,
        coins: prev.coins + 100,
        pitStopCleanliness: 100,
        trophies: updatedTrophies,
      };
    });
    showToast(`Carro limpinho e brilhante! +100 🪙`);
  };

  const handleRepairTires = () => {
    setGameState((prev) => {
      const updatedTrophies = prev.trophies.map((t) => {
        if (t.id === 'pit_crew') {
          return { ...t, progress: 1 };
        }
        return t;
      });

      return {
        ...prev,
        coins: prev.coins + 100,
        pitStopTireHealth: 100,
        trophies: updatedTrophies,
      };
    });
    showToast(`Pneus novinhos em folha! +100 🪙`);
  };

  // Handler: Claim Trophy
  const handleClaimTrophy = (trophyId: string, rewardCoins: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      trophiesCount: prev.trophiesCount + 1,
      trophies: prev.trophies.map((t) => (t.id === trophyId ? { ...t, unlocked: true } : t)),
    }));
    showToast(`Troféu resgatado! +${rewardCoins} 🪙`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      sensorySettings.calmMode
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950'
    }`}>
      {/* Top Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        coins={gameState.coins}
        trophiesCount={gameState.trophiesCount}
        sensorySettings={sensorySettings}
        onOpenSensoryModal={() => setIsSensoryModalOpen(true)}
        onToggleSound={() =>
          setSensorySettings({
            ...sensorySettings,
            soundEnabled: !sensorySettings.soundEnabled,
          })
        }
      />

      {/* Main Game Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl font-black shadow-2xl animate-fade-in border-2 border-white flex items-center gap-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Race View (Pista & Melhores) */}
        {currentTab === 'race' && (
          <div className="space-y-6">
            <RaceCanvas
              activeCar={activeCar}
              activeDriver={activeDriver}
              activeTrack={activeTrack}
              sensorySettings={sensorySettings}
              upgrades={gameState.upgrades}
              pitStopCleanliness={gameState.pitStopCleanliness}
              pitStopTireHealth={gameState.pitStopTireHealth}
              onLapComplete={handleLapComplete}
              onTurboUse={handleTurboUse}
              onGoToPitStop={() => setCurrentTab('pitstop')}
              onChangeTrack={handleChangeTrack}
              allTracks={gameState.tracks}
              trophiesCount={gameState.trophiesCount}
            />

            {/* Upgrades Drawer */}
            <UpgradePanel
              coins={gameState.coins}
              upgrades={gameState.upgrades}
              onBuyUpgrade={handleBuyUpgrade}
              sensorySettings={sensorySettings}
            />
          </div>
        )}

        {/* Tab 2: Garage & Paint Shop */}
        {currentTab === 'garage' && (
          <GarageView
            cars={gameState.cars}
            activeCarId={gameState.selectedCarId}
            coins={gameState.coins}
            sensorySettings={sensorySettings}
            onSelectCar={handleSelectCar}
            onUnlockCar={handleUnlockCar}
            onUpdateCarCustomization={handleUpdateCarCustomization}
            onCarPainted={handleCarPainted}
          />
        )}

        {/* Tab 3: Driver Companions */}
        {currentTab === 'drivers' && (
          <DriversView
            drivers={gameState.drivers}
            activeDriverId={gameState.selectedDriverId}
            coins={gameState.coins}
            sensorySettings={sensorySettings}
            onSelectDriver={handleSelectDriver}
            onUnlockDriver={handleUnlockDriver}
          />
        )}

        {/* Tab 4: Pit-Stop Minigame */}
        {currentTab === 'pitstop' && (
          <PitStopMinigame
            activeCar={activeCar}
            cleanliness={gameState.pitStopCleanliness}
            tireHealth={gameState.pitStopTireHealth}
            sensorySettings={sensorySettings}
            onCleanCar={handleCleanCar}
            onRepairTires={handleRepairTires}
          />
        )}

        {/* Tab 5: Sound Exploration Panel */}
        {currentTab === 'sounds' && (
          <SoundExplorationView
            cars={gameState.cars}
            drivers={gameState.drivers}
            sensorySettings={sensorySettings}
            onUpdateSettings={setSensorySettings}
          />
        )}

        {/* Tab 6: Trophy Cabinet */}
        {currentTab === 'trophies' && (
          <TrophiesView
            trophies={gameState.trophies}
            trophiesCount={gameState.trophiesCount}
            sensorySettings={sensorySettings}
            onClaimTrophy={handleClaimTrophy}
          />
        )}
      </main>

      {/* Sensory & Accessibility Settings Modal */}
      <SensorySettingsModal
        isOpen={isSensoryModalOpen}
        onClose={() => setIsSensoryModalOpen(false)}
        settings={sensorySettings}
        onUpdateSettings={setSensorySettings}
      />
    </div>
  );
}
