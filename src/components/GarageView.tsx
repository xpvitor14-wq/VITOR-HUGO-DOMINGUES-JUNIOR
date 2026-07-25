import React, { useState } from 'react';
import { Car, SensorySettings } from '../types';
import { PAINT_COLORS, STICKERS } from '../data/initialData';
import { soundManager } from '../lib/audio';
import { Sparkles, Palette, Check, Lock, ShieldAlert, Award } from 'lucide-react';

interface GarageViewProps {
  cars: Car[];
  activeCarId: string;
  coins: number;
  sensorySettings: SensorySettings;
  onSelectCar: (carId: string) => void;
  onUnlockCar: (carId: string, price: number) => void;
  onUpdateCarCustomization: (carId: string, updates: Partial<Car>) => void;
  onCarPainted: () => void;
}

export const GarageView: React.FC<GarageViewProps> = ({
  cars,
  activeCarId,
  coins,
  sensorySettings,
  onSelectCar,
  onUnlockCar,
  onUpdateCarCustomization,
  onCarPainted,
}) => {
  const activeCar = cars.find((c) => c.id === activeCarId) || cars[0];
  const [selectedColor, setSelectedColor] = useState(activeCar.color);
  const [selectedSticker, setSelectedSticker] = useState(activeCar.sticker || '⭐');

  const handleApplyColor = (colorHex: string) => {
    setSelectedColor(colorHex);
    onUpdateCarCustomization(activeCar.id, { color: colorHex });
    soundManager.playPop(sensorySettings);
    onCarPainted();
  };

  const handleApplySticker = (stickerEmoji: string) => {
    setSelectedSticker(stickerEmoji);
    onUpdateCarCustomization(activeCar.id, { sticker: stickerEmoji });
    soundManager.playPop(sensorySettings);
  };

  const handleApplyWheel = (wheelStyle: Car['wheelStyle']) => {
    onUpdateCarCustomization(activeCar.id, { wheelStyle });
    soundManager.playPop(sensorySettings);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl text-indigo-300">
            <Palette className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              Garagem & Oficina Criativa
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200">
              Escolha seu carro favorito, mude as cores e cole adesivos super estilosos!
            </p>
          </div>
        </div>

        {/* Selected Car Highlight */}
        <div className="bg-slate-900/80 border border-indigo-500/40 px-5 py-2.5 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">{activeCar.sticker}</span>
          <div>
            <span className="text-[10px] text-indigo-300 uppercase font-black block">
              Carro Atual em Uso
            </span>
            <span className="font-extrabold text-sm sm:text-base text-white">
              {activeCar.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Car Preview Box & Customization Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Visual Car Preview Stage */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[300px]">
            {/* Background Studio Glow */}
            <div
              className="absolute inset-0 opacity-20 transition-all duration-500"
              style={{
                background: `radial-gradient(circle at center, ${activeCar.color} 0%, transparent 70%)`,
              }}
            />

            {/* Custom SVG Car Render */}
            <div className="relative z-10 scale-125 sm:scale-150 my-6 transition-transform hover:scale-160 duration-300">
              <svg width="200" height="100" viewBox="0 0 200 100" className="drop-shadow-2xl">
                {/* Wheels Shadow */}
                <ellipse cx="60" cy="78" rx="22" ry="6" fill="#000000" opacity="0.4" />
                <ellipse cx="140" cy="78" rx="22" ry="6" fill="#000000" opacity="0.4" />

                {/* Main Body */}
                <path
                  d={
                    activeCar.shape === 'beetle'
                      ? 'M 20,60 Q 30,25 90,20 Q 150,20 180,60 Z'
                      : activeCar.shape === 'f1'
                      ? 'M 10,65 L 40,50 L 150,50 L 190,65 Z'
                      : activeCar.shape === 'truck'
                      ? 'M 20,65 L 20,35 L 110,35 L 180,65 Z'
                      : 'M 20,60 Q 50,30 110,30 Q 160,30 180,60 Z'
                  }
                  fill={activeCar.color}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />

                {/* Roof & Window Glass */}
                <path
                  d="M 60,40 Q 90,25 130,28 L 135,45 Z"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />

                {/* Sticker Emoji in Window */}
                <text x="95" y="40" fontSize="16" textAnchor="middle">
                  {activeCar.sticker}
                </text>

                {/* Front Headlight */}
                <circle cx="172" cy="55" r="5" fill="#FDE047" />

                {/* Wheels */}
                <circle cx="60" cy="65" r="14" fill="#1E293B" stroke={activeCar.wheelStyle === 'neon' ? '#06B6D4' : '#64748B'} strokeWidth="3" />
                <circle cx="60" cy="65" r="6" fill="#94A3B8" />

                <circle cx="140" cy="65" r="14" fill="#1E293B" stroke={activeCar.wheelStyle === 'neon' ? '#06B6D4' : '#64748B'} strokeWidth="3" />
                <circle cx="140" cy="65" r="6" fill="#94A3B8" />
              </svg>
            </div>

            {/* Car Name & Stats Overview */}
            <div className="relative z-10 w-full max-w-md bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-white">
                  {activeCar.name}
                </span>
                <span className="text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  {activeCar.description}
                </span>
              </div>

              {/* Stats Bars */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center text-xs">
                  <span className="w-24 text-slate-400 font-bold">Velocidade:</span>
                  <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
                      style={{ width: `${activeCar.baseSpeed}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-black text-amber-300">
                    {activeCar.baseSpeed}
                  </span>
                </div>

                <div className="flex items-center text-xs">
                  <span className="w-24 text-slate-400 font-bold">Aceleração:</span>
                  <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all"
                      style={{ width: `${activeCar.baseAccel}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-black text-blue-300">
                    {activeCar.baseAccel}
                  </span>
                </div>

                <div className="flex items-center text-xs">
                  <span className="w-24 text-slate-400 font-bold">Nitro Nitro:</span>
                  <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all"
                      style={{ width: `${activeCar.baseNitro}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-black text-purple-300">
                    {activeCar.baseNitro}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color & Sticker Painting Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
            {/* Color Palette */}
            <div>
              <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Escolha a Cor do Carro (Pintura Especial)</span>
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {PAINT_COLORS.map((color) => {
                  const isSelected = activeCar.color === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => handleApplyColor(color.hex)}
                      title={color.name}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border-2 shadow-md touch-manipulation active:scale-90 ${
                        isSelected
                          ? 'border-white scale-110 ring-4 ring-amber-400/40'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <Check className="w-5 h-5 text-slate-950 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sticker Selection */}
            <div>
              <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Escolha o Adesivo de Capô</span>
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {STICKERS.map((sticker) => {
                  const isSelected = activeCar.sticker === sticker.emoji;
                  return (
                    <button
                      key={sticker.id}
                      onClick={() => handleApplySticker(sticker.emoji)}
                      className={`p-2.5 rounded-2xl border text-xl flex flex-col items-center justify-center transition-all touch-manipulation active:scale-95 ${
                        isSelected
                          ? 'bg-purple-950 border-purple-400 ring-2 ring-purple-400/30 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{sticker.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wheel Style Selection */}
            <div>
              <h3 className="font-extrabold text-sm text-white mb-3">
                Rodas & Aros
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'standard', label: 'Roda Clássica' },
                  { id: 'neon', label: 'Aro Neon Ciano' },
                  { id: 'star', label: 'Aro Estrela' },
                  { id: 'chrome', label: 'Cromado Prata' },
                ].map((wheel) => {
                  const isSelected = activeCar.wheelStyle === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => handleApplyWheel(wheel.id as Car['wheelStyle'])}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500 border-amber-400 text-slate-950'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {wheel.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Selection Grid */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-black text-base text-white flex items-center justify-between">
              <span>Coleção de Carros ({cars.filter((c) => c.unlocked).length}/{cars.length})</span>
            </h3>

            <div className="space-y-3">
              {cars.map((car) => {
                const isActive = car.id === activeCarId;
                const canAfford = coins >= car.price;

                return (
                  <div
                    key={car.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30'
                        : car.unlocked
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border"
                        style={{ backgroundColor: car.color, borderColor: '#FFFFFF40' }}
                      >
                        {car.sticker}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-white">
                          {car.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {car.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {car.unlocked ? (
                      <button
                        onClick={() => onSelectCar(car.id)}
                        disabled={isActive}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white cursor-default'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
                        }`}
                      >
                        {isActive ? 'Em Uso ⭐' : 'Escolher'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onUnlockCar(car.id, car.price)}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Desbloquear ({car.price} 🪙)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
