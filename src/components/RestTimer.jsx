import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  ChevronUp, 
  ChevronDown, 
  X,
  Timer as TimerIcon,
  Plus,
  Minus
} from 'lucide-react';
import { playTimerDoneSound, playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function RestTimer({ 
  timerState, 
  setTimerState, 
  soundEnabled = true, 
  hapticsEnabled = true 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { duration, remaining, isRunning, isVisible } = timerState;

  useEffect(() => {
    let interval = null;
    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.remaining <= 1) {
            // Timer finished!
            playTimerDoneSound(soundEnabled);
            triggerHaptic('alert');
            return { ...prev, remaining: 0, isRunning: false };
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
    } else if (remaining === 0 && isRunning) {
      setTimerState(prev => ({ ...prev, isRunning: false }));
    }
    return () => clearInterval(interval);
  }, [isRunning, remaining, soundEnabled, setTimerState]);

  if (!isVisible) return null;

  const toggleRun = () => {
    playTapSound(soundEnabled);
    triggerHaptic('light');
    if (remaining === 0) {
      setTimerState(prev => ({ ...prev, remaining: prev.duration, isRunning: true }));
    } else {
      setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }
  };

  const resetTimer = () => {
    playTapSound(soundEnabled);
    triggerHaptic('light');
    setTimerState(prev => ({ ...prev, remaining: prev.duration, isRunning: false }));
  };

  const setPreset = (seconds) => {
    playTapSound(soundEnabled);
    triggerHaptic('light');
    setTimerState(prev => ({ 
      ...prev, 
      duration: seconds, 
      remaining: seconds, 
      isRunning: true 
    }));
  };

  const adjustTime = (delta) => {
    playTapSound(soundEnabled);
    triggerHaptic('light');
    setTimerState(prev => {
      const nextRemaining = Math.max(0, prev.remaining + delta);
      return {
        ...prev,
        remaining: nextRemaining,
        duration: Math.max(prev.duration, nextRemaining)
      };
    });
  };

  const closeTimer = () => {
    playTapSound(soundEnabled);
    setTimerState(prev => ({ ...prev, isVisible: false, isRunning: false }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  return (
    <div className="fixed bottom-20 right-4 z-30 transition-all duration-300">
      
      {/* Expanded Timer Modal / Card */}
      {isExpanded ? (
        <div className="w-80 rounded-2xl p-5 shadow-2xl border transition-all glass-panel border-white/10 dark:border-white/10 dark:bg-[#15181E]/95 light:bg-white/95 light:border-black/10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TimerIcon className="w-4 h-4 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700">
                Rest Timer
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button 
                onClick={closeTimer}
                className="p-1 rounded-lg text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Time Display with Circular / Linear Progress */}
          <div className="flex flex-col items-center justify-center my-3 py-2">
            <div className="text-4xl font-extrabold font-mono tracking-tight text-white dark:text-white light:text-gray-900">
              {formatTime(remaining)}
            </div>
            
            {/* Minimal Progress Bar */}
            <div className="w-full bg-white/10 dark:bg-white/10 light:bg-black/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Adjust Buttons (-15s / +15s) */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => adjustTime(-15)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1 dark:text-gray-300 light:text-gray-700 light:border-black/10"
            >
              <Minus className="w-3 h-3" /> 15s
            </button>
            
            <button
              onClick={toggleRun}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 ${
                isRunning 
                  ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20' 
                  : 'bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" /> Start
                </>
              )}
            </button>

            <button
              onClick={() => adjustTime(15)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1 dark:text-gray-300 light:text-gray-700 light:border-black/10"
            >
              <Plus className="w-3 h-3" /> 15s
            </button>
          </div>

          {/* Preset Buttons (30s, 60s, 90s, 120s) */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10">
            {[30, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => setPreset(sec)}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                  duration === sec && isRunning
                    ? 'border-[#D4FF00] bg-[#D4FF00]/20 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] light:border-[#10B981]'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-black light:border-black/5'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

        </div>
      ) : (
        /* Floating Minimized Pill */
        <div className="flex items-center gap-2 p-1.5 pr-3 rounded-full border shadow-xl backdrop-blur-lg bg-[#15181E]/95 border-white/15 dark:bg-[#15181E]/95 dark:border-white/15 light:bg-white/95 light:border-black/15">
          <button
            onClick={toggleRun}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isRunning 
                ? 'bg-[#D4FF00] text-black shadow-glow-lime' 
                : 'bg-white/10 text-white dark:text-white light:text-black'
            }`}
          >
            {isRunning ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <div 
            onClick={() => setIsExpanded(true)}
            className="flex flex-col cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold text-white dark:text-white light:text-gray-900">
                {formatTime(remaining)}
              </span>
              {isRunning && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px] text-gray-400 tracking-tight">
              Tap to expand
            </span>
          </div>

          <button
            onClick={closeTimer}
            className="p-1 rounded-full text-gray-500 hover:text-gray-300 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
