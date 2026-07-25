import React from 'react';
import { SensorySettings } from '../types';
import { X, Sparkles, Volume2, ShieldCheck, Zap, Eye, Gauge, Check } from 'lucide-react';

interface SensorySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SensorySettings;
  onUpdateSettings: (newSettings: SensorySettings) => void;
}

export const SensorySettingsModal: React.FC<SensorySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleField = (field: keyof SensorySettings) => {
    onUpdateSettings({
      ...settings,
      [field]: !settings[field],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide">
                Painel Sensorial & Acessibilidade
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                Ajustes pensados com carinho para autismo e conforto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Calm Mode Box */}
          <div
            onClick={() => toggleField('calmMode')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
              settings.calmMode
                ? 'bg-emerald-950/60 border-emerald-500/80 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${settings.calmMode ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-emerald-300">
                  Modo Calmo Sensorial (Calm Mode)
                </span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${settings.calmMode ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                  {settings.calmMode && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Suaviza cores, reduz piscadas de luz, desacelera efeitos visuais e mantém o áudio em tons harmônicos relaxantes.
              </p>
            </div>
          </div>

          {/* Sound & Audio Controls */}
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <Volume2 className="w-5 h-5" />
                <span>Sons & Efeitos Sonoros</span>
              </div>
              <button
                onClick={() => toggleField('soundEnabled')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  settings.soundEnabled
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                }`}
              >
                {settings.soundEnabled ? 'Ligado' : 'Mudo'}
              </button>
            </div>

            {settings.soundEnabled && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Volume do Som</span>
                    <span className="font-bold text-slate-200">
                      {Math.round(settings.soundVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        soundVolume: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <span className="text-xs text-slate-300">
                    Zumbido Suave de Motor (Sensorial Frequência Baixa)
                  </span>
                  <button
                    onClick={() => toggleField('engineHum')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      settings.engineHum ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {settings.engineHum ? 'Sim' : 'Não'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Game Speed & Auto Turbo */}
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Gauge className="w-5 h-5" />
              <span>Ritmo e Controle do Jogo</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">
                Velocidade da Pista (Para facilitar acompanhamento visual):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 0.6, label: '0.6x (Suave & Calmo)' },
                  { value: 0.8, label: '0.8x (Moderado)' },
                  { value: 1.0, label: '1.0x (Padrão)' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        gameSpeedScale: option.value,
                      })
                    }
                    className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                      settings.gameSpeedScale === option.value
                        ? 'bg-amber-500 border-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Turbo Toggle */}
            <div
              onClick={() => toggleField('autoTurbo')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                settings.autoTurbo ? 'bg-amber-950/50 border-amber-500/80' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  Turbo Automático (Ideal para quem só quer assistir)
                </span>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${settings.autoTurbo ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'}`}>
                {settings.autoTurbo && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Visual Display Adjustments */}
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-300" />
              <div>
                <span className="font-bold text-purple-200 block text-xs">
                  Modo Alto Contraste
                </span>
                <span className="text-[11px] text-slate-400">
                  Destaca contornos para facilitar leitura de botões
                </span>
              </div>
            </div>
            <button
              onClick={() => toggleField('highContrast')}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                settings.highContrast ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {settings.highContrast ? 'Ativado' : 'Desativado'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            Pronto & Salvar ✨
          </button>
        </div>
      </div>
    </div>
  );
};
