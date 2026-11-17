import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Layers, 
  Repeat, 
  Weight, 
  Check, 
  Share2, 
  Sparkles, 
  Smile, 
  Zap,
  X
} from 'lucide-react';
import { playPRSound, playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { formatVolume, formatWeight } from '../utils/units';

export default function WorkoutSummaryModal({ 
  summaryData, 
  onSave, 
  onDiscard, 
  settings 
}) {
  const [rpe, setRpe] = useState(8);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const {
    name,
    durationSeconds,
    exercisesCompletedCount,
    totalSets,
    totalReps,
    totalVolumeKg,
    newPRs = [],
    exerciseNames = []
  } = summaryData;

  // Trigger celebration on mount
  useEffect(() => {
    if (newPRs.length > 0) {
      playPRSound(settings.soundEnabled);
    }
    triggerHaptic('success');
  }, []);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours > 0) return `${hours}h ${remMins}m`;
    return `${mins} min`;
  };

  const handleShare = () => {
    playTapSound(settings.soundEnabled);
    const shareText = `🔥 APEX Workout Complete!\n` +
      `Workout: ${name}\n` +
      `Duration: ${formatDuration(durationSeconds)}\n` +
      `Volume: ${formatVolume(totalVolumeKg, settings.unit)}\n` +
      `Sets: ${totalSets} | Reps: ${totalReps}\n` +
      (newPRs.length > 0 ? `🏆 PRs: ${newPRs.length} new records!\n` : '') +
      `Tracked with APEX Minimalist Workout OS`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmSave = () => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('medium');
    onSave({
      rpe,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl p-6 sm:p-8 my-auto relative animate-scale-up">
        
        {/* Top Celebration Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#D4FF00] text-black flex items-center justify-center shadow-glow-lime mb-3">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] mb-1">
            WORKOUT COMPLETED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">
            Outstanding Work!
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            {name} logged and saved automatically.
          </p>
        </div>

        {/* PR Achievement Callout (if any PR achieved) */}
        {newPRs.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4FF00]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4FF00]">
                {newPRs.length} Personal Record{newPRs.length > 1 ? 's' : ''} Crushed!
              </span>
            </div>
            <div className="space-y-1.5">
              {newPRs.map((pr, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-semibold">{pr.exerciseId}</span>
                  <span className="font-mono font-bold text-[#D4FF00]">
                    {pr.weight} {settings.unit} × {pr.reps} ({pr.type})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-mono font-extrabold text-base text-white dark:text-white light:text-gray-900">
              {formatDuration(durationSeconds)}
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-medium">Duration</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Weight className="w-4 h-4" />
            </div>
            <div className="font-mono font-extrabold text-base text-white dark:text-white light:text-gray-900 truncate">
              {formatVolume(totalVolumeKg, settings.unit)}
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-medium">Volume</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Layers className="w-4 h-4" />
            </div>
            <div className="font-mono font-extrabold text-base text-white dark:text-white light:text-gray-900">
              {totalSets}
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-medium">Sets Done</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Repeat className="w-4 h-4" />
            </div>
            <div className="font-mono font-extrabold text-base text-white dark:text-white light:text-gray-900">
              {totalReps}
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-medium">Total Reps</div>
          </div>
        </div>

        {/* Rate of Perceived Exertion (RPE) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700">
              Rate Your Effort (RPE)
            </label>
            <span className="font-mono text-xs font-bold text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
              {rpe}/10 — {rpe <= 4 ? 'Easy' : rpe <= 7 ? 'Moderate' : rpe <= 9 ? 'Hard / Intense' : 'Maximum Effort'}
            </span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setRpe(num)}
                className={`py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  rpe === num 
                    ? 'bg-[#D4FF00] text-black shadow-glow-lime scale-105' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Reflection Notes */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700 mb-2">
            Workout Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="How did you feel? Energy levels, nutrition, recovery notes..."
            className="w-full text-xs p-3 rounded-2xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirmSave}
            className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            Save to Workout History
          </button>

          <button
            onClick={handleShare}
            className="py-3.5 px-5 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-white dark:text-white light:text-gray-900 border border-white/10 dark:border-white/10 light:border-black/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>

      </div>
    </div>
  );
}
