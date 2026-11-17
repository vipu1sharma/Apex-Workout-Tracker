import React from 'react';
import { 
  Home, 
  Dumbbell, 
  Layers, 
  Search, 
  TrendingUp, 
  Calendar,
  Flame
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, activeWorkout }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { 
      id: 'workout', 
      label: activeWorkout ? 'Active' : 'Workout', 
      icon: Dumbbell,
      badge: activeWorkout ? true : false 
    },
    { id: 'routines', label: 'Routines', icon: Layers },
    { id: 'exercises', label: 'Exercises', icon: Search },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'calendar', label: 'History', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-colors border-white/10 bg-[#0D0F12]/95 dark:border-white/10 dark:bg-[#0D0F12]/95 light:bg-white/95 light:border-black/10 pb-safe">
      <div className="max-w-xl mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 select-none ${
                isActive 
                  ? 'text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] font-semibold scale-105' 
                  : 'text-gray-400 hover:text-gray-200 dark:hover:text-gray-200 light:text-gray-500 light:hover:text-black'
              }`}
            >
              {/* Badge for active workout */}
              {tab.badge && (
                <span className="absolute -top-0.5 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4FF00]"></span>
                </span>
              )}

              <div className={`p-1 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-white/10 dark:bg-white/10 light:bg-emerald-50' 
                  : 'bg-transparent'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
