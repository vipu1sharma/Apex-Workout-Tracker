import React from 'react';
import { 
  Dumbbell, 
  Settings, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Play, 
  Activity,
  Flame
} from 'lucide-react';

export default function Navbar({ 
  activeWorkout, 
  activeTab, 
  setActiveTab, 
  settings, 
  updateSettings, 
  onOpenSettings,
  streak
}) {
  const isDark = settings.theme === 'dark';

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    updateSettings({ theme: next });
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleUnit = () => {
    const next = settings.unit === 'kg' ? 'lbs' : 'kg';
    updateSettings({ unit: next });
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors border-white/10 bg-[#0D0F12]/90 dark:border-white/10 dark:bg-[#0D0F12]/90 light:bg-white/90 light:border-black/10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] flex items-center justify-center text-black shadow-glow-lime transition-transform group-hover:scale-105">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight font-sans text-white dark:text-white light:text-gray-900">
                APEX
              </span>
              <span className="text-[10px] tracking-widest font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 dark:bg-white/10 light:bg-black/5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] font-bold">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-400 light:text-gray-500 font-medium">
              Minimalist Workout OS
            </span>
          </div>
        </div>

        {/* Center: In-Progress Workout Alert Pill (if active) */}
        {activeWorkout && (
          <button
            onClick={() => setActiveTab('workout')}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'workout' 
                ? 'bg-[#D4FF00] text-black shadow-glow-lime' 
                : 'bg-white/10 hover:bg-white/15 text-[#D4FF00] border border-[#D4FF00]/30 animate-pulse-subtle'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Activity className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px]">{activeWorkout.name}</span>
            <span className="font-mono text-[11px] opacity-80">IN PROGRESS</span>
          </button>
        )}

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Streak Indicator */}
          {streak && streak.streakDays > 0 && (
            <div 
              title={`${streak.streakDays} day workout streak`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-mono">{streak.streakDays}d</span>
            </div>
          )}

          {/* KG / LBS Quick Toggle */}
          <button
            onClick={toggleUnit}
            title={`Switch to ${settings.unit === 'kg' ? 'lbs' : 'kg'}`}
            className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold border transition-colors bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 dark:text-gray-300 light:text-gray-700 light:border-black/10 light:bg-gray-100"
          >
            {settings.unit.toUpperCase()}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={settings.soundEnabled ? 'Mute audio feedback' : 'Unmute audio feedback'}
            className="p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-black"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-black"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Settings & Data Management"
            className="p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-black"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
