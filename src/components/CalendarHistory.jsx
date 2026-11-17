import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Clock, 
  Trophy, 
  Layers, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Flame,
  FileText
} from 'lucide-react';
import { calculateWorkoutVolume, calculateTotalSets } from '../utils/analytics';
import { formatVolume, formatWeight } from '../utils/units';
import { playTapSound } from '../utils/sound';

export default function CalendarHistory({ 
  workouts, 
  setWorkouts, 
  exercisesLibrary, 
  settings 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(new Date().toISOString().split('T')[0]);
  const [historySearch, setHistorySearch] = useState('');
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => {
    playTapSound(settings.soundEnabled);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    playTapSound(settings.soundEnabled);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    playTapSound(settings.soundEnabled);
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateKey(now.toISOString().split('T')[0]);
  };

  // Calendar Day generation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Convert Sunday (0) to Monday-based index (0 is Monday, 6 is Sunday)
  const mondayBasedFirstDay = (firstDayIndex + 6) % 7;

  // Map workouts by dateKey (YYYY-MM-DD)
  const workoutsByDate = {};
  workouts.forEach(w => {
    if (!w.completed || !w.date) return;
    const dKey = w.dateKey || w.date.split('T')[0];
    if (!workoutsByDate[dKey]) workoutsByDate[dKey] = [];
    workoutsByDate[dKey].push(w);
  });

  // Selected date workouts
  const selectedDateWorkouts = workoutsByDate[selectedDateKey] || [];

  // Search filtered history
  const filteredHistory = workouts.filter(w => {
    if (!w.completed) return false;
    const matchName = w.name.toLowerCase().includes(historySearch.toLowerCase());
    const matchEx = w.exercises?.some(ex => {
      const exDetail = exercisesLibrary.find(e => e.id === ex.exerciseId);
      return exDetail?.name.toLowerCase().includes(historySearch.toLowerCase());
    });
    return matchName || matchEx;
  });

  const handleDeleteWorkout = (workoutId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this workout from your log?')) {
      playTapSound(settings.soundEnabled);
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">
            Calendar & History
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            View completed training days, personal bests, and past workout logs
          </p>
        </div>

        <button
          onClick={jumpToToday}
          className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 self-start sm:self-auto transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid Card */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-lg">
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base sm:text-lg text-white dark:text-white light:text-gray-900">
            {monthNames[month]} {year}
          </h3>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Empty prefix slots */}
          {Array.from({ length: mondayBasedFirstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayWorkouts = workoutsByDate[dateStr] || [];
            const hasWorkout = dayWorkouts.length > 0;
            const hasPR = dayWorkouts.some(w => w.exercises?.some(ex => ex.sets?.some(s => s.isPR)));
            const isSelected = selectedDateKey === dateStr;

            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => {
                  playTapSound(settings.soundEnabled);
                  setSelectedDateKey(dateStr);
                }}
                className={`h-11 sm:h-14 rounded-2xl flex flex-col items-center justify-between p-1.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-[#D4FF00] bg-white/10 shadow-glow-lime'
                    : isToday
                    ? 'border border-white/30 bg-white/5'
                    : 'border border-white/5 hover:bg-white/5 bg-white/[0.02]'
                }`}
              >
                <span className={`text-xs font-mono font-bold ${
                  isSelected ? 'text-[#D4FF00]' : isToday ? 'text-white' : 'text-gray-400'
                }`}>
                  {dayNum}
                </span>

                {/* Status Dot / PR Star */}
                <div className="flex items-center gap-0.5 h-3">
                  {hasPR ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" title="Personal Record hit!" />
                  ) : hasWorkout ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981]" title="Workout completed" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-white/5 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981]" />
            <span>Completed Workout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>PR Day</span>
          </div>
        </div>

      </div>

      {/* Selected Day Workouts Panel */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
            <h3 className="font-extrabold text-base text-white dark:text-white light:text-gray-900">
              Workouts on {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {selectedDateWorkouts.length} logged
          </span>
        </div>

        {selectedDateWorkouts.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            Rest day — No workout recorded on this date.
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDateWorkouts.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl border border-white/5 dark:border-white/5 light:border-black/5 bg-white/[0.02]"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-white dark:text-white light:text-gray-900">
                    {w.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                    <span>{Math.round(w.durationSeconds / 60)} min</span>
                    <span>•</span>
                    <span className="text-[#D4FF00] font-bold">
                      {formatVolume(calculateWorkoutVolume(w), settings.unit)}
                    </span>
                  </div>
                </div>

                {w.notes && (
                  <p className="text-xs text-gray-400 mt-1 italic">
                    "{w.notes}"
                  </p>
                )}

                {/* Exercises summary table */}
                <div className="mt-3 space-y-2 border-t border-white/5 pt-2">
                  {w.exercises?.map((ex, exIdx) => {
                    const exDetail = exercisesLibrary.find(e => e.id === ex.exerciseId) || { name: ex.exerciseId };

                    return (
                      <div key={exIdx} className="text-xs">
                        <div className="font-bold text-gray-300 dark:text-gray-300 light:text-gray-700">
                          {exDetail.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {ex.sets?.filter(s => s.completed).map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded font-mono text-[11px] bg-white/5 text-gray-300 border border-white/5"
                            >
                              {s.weight} {settings.unit} × {s.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Searchable History List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-white dark:text-white light:text-gray-900">
              Full Workout History
            </h3>
            <p className="text-xs text-gray-400">Search all past training sessions</p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search past workouts..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              No past workouts found.
            </div>
          ) : (
            filteredHistory.map((workout) => {
              const isExpanded = expandedWorkoutId === workout.id;
              const vol = calculateWorkoutVolume(workout);
              const setsCount = calculateTotalSets(workout);

              return (
                <div
                  key={workout.id}
                  className="rounded-2xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-sm overflow-hidden transition-all"
                >
                  <div
                    onClick={() => {
                      playTapSound(settings.soundEnabled);
                      setExpandedWorkoutId(isExpanded ? null : workout.id);
                    }}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-gray-400">
                          {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        {workout.rpe && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-amber-400">
                            RPE {workout.rpe}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white dark:text-white light:text-gray-900">
                        {workout.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono text-xs hidden sm:block">
                        <div className="font-bold text-white dark:text-white light:text-gray-900">
                          {formatVolume(vol, settings.unit)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {setsCount} sets • {Math.round(workout.durationSeconds / 60)} min
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteWorkout(workout.id, e)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete Workout"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Workout Breakdown */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-white/5 bg-black/20 dark:bg-black/20 light:bg-gray-50">
                      {workout.notes && (
                        <p className="text-xs text-gray-300 italic mb-3 pt-3">
                          "{workout.notes}"
                        </p>
                      )}

                      <div className="space-y-3 pt-2">
                        {workout.exercises?.map((ex, eIdx) => {
                          const exDetail = exercisesLibrary.find(e => e.id === ex.exerciseId) || { name: ex.exerciseId };

                          return (
                            <div key={eIdx} className="text-xs">
                              <div className="font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 mb-1">
                                {exDetail.name}
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {ex.sets?.map((s, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className={`p-1.5 rounded-lg font-mono text-[11px] flex justify-between ${
                                      s.completed 
                                        ? 'bg-white/5 border border-white/10 text-gray-300' 
                                        : 'bg-transparent text-gray-600 line-through'
                                    }`}
                                  >
                                    <span>Set {s.setNumber}:</span>
                                    <span className="font-bold text-white dark:text-white light:text-gray-900">
                                      {s.weight} {settings.unit} × {s.reps}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
