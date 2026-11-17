import React from 'react';
import { 
  Play, 
  Flame, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Dumbbell, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  Activity
} from 'lucide-react';
import { 
  calculateStreak, 
  getWorkoutsThisMonth, 
  getWorkoutsThisWeek, 
  calculateAllPRs,
  calculateWorkoutVolume 
} from '../utils/analytics';
import { formatVolume, formatWeight } from '../utils/units';

export default function Dashboard({ 
  workouts, 
  routines, 
  activeWorkout, 
  onStartRoutine, 
  onStartBlank, 
  setActiveTab, 
  settings 
}) {
  const streak = calculateStreak(workouts);
  const workoutsThisMonth = getWorkoutsThisMonth(workouts);
  const workoutsThisWeek = getWorkoutsThisWeek(workouts);
  const allPRs = calculateAllPRs(workouts);
  const prCount = Object.keys(allPRs).length;

  // Calculate total all-time or monthly volume
  const totalVolumeKg = workouts.reduce((acc, w) => acc + calculateWorkoutVolume(w), 0);

  // Today's greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Suggest today's workout based on starter routines rotation
  const suggestedRoutine = routines[0] || {
    id: 'routine-push-day',
    name: 'Push Day: Chest, Shoulders & Triceps',
    estimatedMinutes: 50,
    exercises: []
  };

  // Recent completed workout
  const latestWorkout = workouts.find(w => w.completed);

  const weeklyTarget = settings.daysPerWeek || 4;
  const weeklyCompleted = workoutsThisWeek.length;
  const weeklyPercent = Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Top Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-mono font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-400 light:text-gray-500">
            {todayFormatted}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-gray-900 tracking-tight mt-0.5">
            {getGreeting()}, {settings.name || 'Athlete'}
          </h1>
        </div>

        {/* Quick Goal Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
          <span>Goal: <strong className="text-white dark:text-white light:text-gray-900">{settings.goal}</strong></span>
        </div>
      </div>

      {/* Hero Card: Today's Workout / Active Workout */}
      {activeWorkout ? (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-[#D4FF00]/40 bg-gradient-to-br from-[#1C2028] via-[#15181E] to-[#0D0F12] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4FF00]/20 text-[#D4FF00] text-xs font-bold font-mono tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                WORKOUT IN PROGRESS
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeWorkout.name}
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                {activeWorkout.exercises?.length || 0} exercises added • Ready to log your next set
              </p>
            </div>

            <button
              onClick={() => setActiveTab('workout')}
              className="py-3.5 px-7 rounded-2xl font-black text-sm bg-[#D4FF00] text-black shadow-glow-lime hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Activity className="w-4 h-4 stroke-[2.5]" />
              Resume Workout
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
                TODAY'S SCHEDULED WORKOUT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight mt-1">
                {suggestedRoutine.name}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  ~{suggestedRoutine.estimatedMinutes} mins
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  {suggestedRoutine.exercises?.length || 5} exercises
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onStartRoutine(suggestedRoutine)}
                className="py-3.5 px-6 rounded-2xl font-black text-sm bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                Start Workout
              </button>
              <button
                onClick={onStartBlank}
                className="py-3.5 px-4 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-gray-300 dark:text-gray-300 light:text-gray-700 border border-white/10 dark:border-white/10 light:border-black/10 transition-colors"
                title="Start an empty session"
              >
                Empty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row (Streak, This Month, Weekly Completion, Volume, PRs) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Streak */}
        <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-white dark:text-white light:text-gray-900">
            {streak.streakDays} <span className="text-xs font-sans font-normal text-gray-400">days</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            {streak.streakWeeks > 1 ? `${streak.streakWeeks} weeks active` : 'Active momentum'}
          </div>
        </div>

        {/* This Month */}
        <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">This Month</span>
            <Calendar className="w-4 h-4 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
          </div>
          <div className="font-mono text-2xl font-black text-white dark:text-white light:text-gray-900">
            {workoutsThisMonth.length}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            Workouts logged
          </div>
        </div>

        {/* Weekly Completion Rate */}
        <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Weekly Goal</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-black text-white dark:text-white light:text-gray-900">
            {weeklyCompleted}/{weeklyTarget}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">
            {weeklyPercent}% achieved
          </div>
        </div>

        {/* Total Training Volume */}
        <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Total Volume</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-mono text-xl font-black text-white dark:text-white light:text-gray-900 truncate">
            {formatVolume(totalVolumeKg, settings.unit)}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            Cumulative lifted
          </div>
        </div>

        {/* Personal Records */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Records</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-white dark:text-white light:text-gray-900">
            {prCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            PRs achieved
          </div>
        </div>

      </div>

      {/* Quick Launch Routine Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700">
            Quick Start Routines
          </h3>
          <button
            onClick={() => setActiveTab('routines')}
            className="text-xs font-semibold text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] hover:underline flex items-center gap-1"
          >
            All Routines <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {routines.slice(0, 3).map((rt) => (
            <div
              key={rt.id}
              onClick={() => onStartRoutine(rt)}
              className="p-4 rounded-2xl border border-white/5 dark:border-white/5 light:border-black/5 bg-white/[0.02] hover:bg-white/5 light:bg-gray-50 light:hover:bg-gray-100 cursor-pointer transition-all duration-200 group flex flex-col justify-between hover:border-white/20"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-white/10 dark:bg-white/10 light:bg-black/5 text-gray-300 dark:text-gray-300 light:text-gray-700">
                    {rt.category || 'Routine'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#D4FF00] group-hover:text-black flex items-center justify-center transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-white dark:text-white light:text-gray-900 group-hover:text-[#D4FF00] dark:group-hover:text-[#D4FF00] light:group-hover:text-[#10B981] transition-colors">
                  {rt.name}
                </h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {rt.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 dark:border-white/5 light:border-black/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>{rt.exercises?.length || 0} exercises</span>
                <span>~{rt.estimatedMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Workout Quick Access */}
      {latestWorkout && (
        <div className="rounded-2xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              Previous Workout
            </span>
            <span className="text-xs text-gray-400">
              {new Date(latestWorkout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-base text-white dark:text-white light:text-gray-900">
                {latestWorkout.name}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span>{latestWorkout.exercises?.length || 0} exercises completed</span>
                <span>•</span>
                <span>{formatVolume(calculateWorkoutVolume(latestWorkout), settings.unit)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                // Repeat workout with identical exercises
                const newSession = {
                  id: `workout-${Date.now()}`,
                  name: latestWorkout.name,
                  startTime: new Date().toISOString(),
                  exercises: latestWorkout.exercises.map(ex => ({
                    exerciseId: ex.exerciseId,
                    notes: ex.notes || '',
                    sets: ex.sets.map((s, idx) => ({
                      id: `s-${Date.now()}-${idx + 1}`,
                      setNumber: idx + 1,
                      weight: s.weight,
                      reps: s.reps,
                      completed: false,
                      isWarmup: s.isWarmup
                    }))
                  }))
                };
                onStartRoutine(newSession);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white dark:text-white light:text-gray-900 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center gap-1.5 self-start sm:self-auto transition-transform active:scale-95"
            >
              <Dumbbell className="w-3.5 h-3.5" /> Repeat Workout
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
