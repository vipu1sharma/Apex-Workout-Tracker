import React, { useRef, useState } from 'react';
import { 
  X, 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Volume2, 
  Vibrate, 
  ShieldCheck, 
  Flame, 
  Dumbbell,
  Sparkles,
  Trash2
} from 'lucide-react';
import { playSetCompleteSound, playPRSound, playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { exportAllData, importAllData, resetAllDataToDefault } from '../utils/storage';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  updateSettings, 
  onDataReload 
}) {
  const fileInputRef = useRef(null);
  const [exportNotice, setExportNotice] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

  const handleTestSound = () => {
    playSetCompleteSound(true);
    triggerHaptic('success');
  };

  const handleExport = () => {
    playTapSound(settings.soundEnabled);
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-workout-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importAllData(parsed);
        playPRSound(settings.soundEnabled);
        setImportStatus('Backup restored successfully!');
        if (onDataReload) onDataReload();
        setTimeout(() => setImportStatus(''), 3500);
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid APEX backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all workouts to starter demo data? This will overwrite recent unsaved changes.')) {
      resetAllDataToDefault();
      if (onDataReload) onDataReload();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl p-6 relative my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10 light:border-black/10 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
            <h3 className="text-xl font-extrabold text-white dark:text-white light:text-gray-900">
              Preferences & Data
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          
          {/* Digital Product Pro Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#D4FF00]/10 to-transparent border border-[#D4FF00]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4FF00] text-black flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white dark:text-white light:text-gray-900">
                  APEX PRO — Digital Edition
                </div>
                <div className="text-[11px] text-gray-400">
                  Lifetime License Active • All Features Unlocked
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#D4FF00] text-black">
              ACTIVE
            </span>
          </div>

          {/* User Name & Goal */}
          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={settings.name || ''}
                onChange={(e) => updateSettings({ name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                placeholder="Athlete"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                Primary Fitness Goal
              </label>
              <select
                value={settings.goal}
                onChange={(e) => updateSettings({ goal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-white dark:text-white light:text-gray-900 outline-none"
              >
                <option value="Hypertrophy & Muscle Building">Hypertrophy & Muscle Building</option>
                <option value="Pure Strength & Powerlifting">Pure Strength & Powerlifting</option>
                <option value="Fat Loss & Metabolic Conditioning">Fat Loss & Metabolic Conditioning</option>
                <option value="Endurance & Cardiovascular Capacity">Endurance & Cardiovascular Capacity</option>
                <option value="Longevity & Functional Mobility">Longevity & Functional Mobility</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Target Days/Week
                </label>
                <select
                  value={settings.daysPerWeek}
                  onChange={(e) => updateSettings({ daysPerWeek: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-white dark:text-white light:text-gray-900 outline-none font-mono"
                >
                  {[2, 3, 4, 5, 6, 7].map(d => (
                    <option key={d} value={d}>{d} days / week</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Units
                </label>
                <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-black/30 border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateSettings({ unit: 'kg' })}
                    className={`py-1.5 rounded-lg font-mono font-bold ${
                      settings.unit === 'kg' 
                        ? 'bg-[#D4FF00] text-black shadow-glow-lime' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    KG
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ unit: 'lbs' })}
                    className={`py-1.5 rounded-lg font-mono font-bold ${
                      settings.unit === 'lbs' 
                        ? 'bg-[#D4FF00] text-black shadow-glow-lime' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    LBS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rest Timer Settings */}
          <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700">
              Rest Timer Configuration
            </span>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white dark:text-white light:text-gray-900">Auto-Start on Set Complete</div>
                <div className="text-[10px] text-gray-400">Automatically triggers timer when marking a set done</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStartTimer}
                onChange={(e) => updateSettings({ autoStartTimer: e.target.checked })}
                className="w-4 h-4 rounded text-[#D4FF00] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">
                Default Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono">
                {[30, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => updateSettings({ timerDefault: sec })}
                    className={`py-1.5 rounded-lg font-bold border transition-colors ${
                      settings.timerDefault === sec
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback & Sound */}
          <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white dark:text-white light:text-gray-900">Audio Feedback</div>
                <div className="text-[10px] text-gray-400">Synthesized web-audio chimes for sets and timer</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSound}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-mono"
                >
                  Test Sound
                </button>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#D4FF00] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Backup & Restore Data */}
          <div className="space-y-2 pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10">
            <div className="font-bold text-white dark:text-white light:text-gray-900">
              Data Management & Backup
            </div>
            <p className="text-[11px] text-gray-400">
              Your workout data is saved offline in your browser. Export anytime to back up your records.
            </p>

            {exportNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
                <Check className="w-4 h-4" /> Backup file exported!
              </div>
            )}

            {importStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
                <Check className="w-4 h-4" /> {importStatus}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON Backup
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Import Backup
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetDemo}
                className="w-full py-2 px-3 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Realistic Demo Workout History
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 mt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black shadow-glow-lime hover:brightness-110 transition-transform active:scale-95"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
