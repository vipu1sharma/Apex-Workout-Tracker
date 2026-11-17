import React, { useState } from 'react';
import { 
  Dumbbell, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { playTapSound, playPRSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function OnboardingModal({ 
  isOpen, 
  onComplete, 
  settings, 
  updateSettings, 
  routines, 
  onStartRoutine 
}) {
  const [step, setStep] = useState(1);
  const [selectedRoutineId, setSelectedRoutineId] = useState(routines[0]?.id || '');

  if (!isOpen) return null;

  const handleNext = () => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('light');
    if (step === 1) {
      setStep(2);
    } else {
      playPRSound(settings.soundEnabled);
      triggerHaptic('success');
      onComplete();
      // Optionally start selected routine
      const chosen = routines.find(r => r.id === selectedRoutineId);
      if (chosen) {
        onStartRoutine(chosen);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl p-6 sm:p-8 animate-scale-up">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4FF00] text-black flex items-center justify-center shadow-glow-lime">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white dark:text-white light:text-gray-900">
              APEX OS
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-gray-500">
            STEP {step} OF 2
          </span>
        </div>

        {step === 1 ? (
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
              WELCOME TO APEX
            </span>
            <h2 className="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight mt-1 mb-2">
              Track in seconds, not minutes.
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Designed for serious lifters. Fast 1-tap set completion, smart previous weight recall, and zero friction in the gym.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">
                  Preferred Units
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ unit: 'kg' })}
                    className={`py-3 rounded-2xl font-mono font-bold text-sm border transition-all ${
                      settings.unit === 'kg'
                        ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00] shadow-glow-lime'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ unit: 'lbs' })}
                    className={`py-3 rounded-2xl font-mono font-bold text-sm border transition-all ${
                      settings.unit === 'lbs'
                        ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-[#D4FF00] shadow-glow-lime'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    Pounds (lbs)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">
                  Primary Training Goal
                </label>
                <select
                  value={settings.goal}
                  onChange={(e) => updateSettings({ goal: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white outline-none"
                >
                  <option value="Hypertrophy & Muscle Building">Hypertrophy & Muscle Building</option>
                  <option value="Pure Strength & Powerlifting">Pure Strength & Powerlifting</option>
                  <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                  <option value="General Health & Athleticism">General Health & Athleticism</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-8 py-3.5 rounded-2xl font-black text-sm bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
              GET READY TO TRAIN
            </span>
            <h2 className="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight mt-1 mb-2">
              Select Your Starter Routine
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              You can start immediately with one of our engineered starter routines or modify it anytime.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-6">
              {routines.slice(0, 4).map((rt) => (
                <div
                  key={rt.id}
                  onClick={() => setSelectedRoutineId(rt.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedRoutineId === rt.id
                      ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-white'
                      : 'border-white/5 bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{rt.name}</span>
                    {selectedRoutineId === rt.id && (
                      <Check className="w-4 h-4 text-[#D4FF00]" />
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {rt.exercises?.length} exercises • ~{rt.estimatedMinutes} mins
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Launch APEX OS <Zap className="w-4 h-4 fill-black" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
