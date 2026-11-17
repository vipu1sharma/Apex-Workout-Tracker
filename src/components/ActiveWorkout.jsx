import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Check, 
  Plus, 
  Trash2, 
  MoreVertical, 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  Search, 
  X, 
  Dumbbell, 
  Flame, 
  Timer, 
  ArrowRight,
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';
import { playSetCompleteSound, playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { getPreviousExerciseData } from '../utils/analytics';
import { formatWeight } from '../utils/units';

export default function ActiveWorkout({ 
  activeWorkout, 
  setActiveWorkout, 
  workoutHistory, 
  exercisesLibrary, 
  onFinishWorkout, 
  onCancelWorkout,
  settings, 
  setTimerState,
  onOpenRoutinePicker
}) {
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('All');
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Sync elapsed timer
  useEffect(() => {
    if (!activeWorkout) return;
    
    // Calculate initial elapsed if startTime exists
    if (activeWorkout.startTime) {
      const elapsed = Math.floor((Date.now() - new Date(activeWorkout.startTime).getTime()) / 1000);
      setElapsedSeconds(Math.max(0, elapsed));
    }

    let interval = null;
    if (!isTimerPaused) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout?.startTime, isTimerPaused]);

  if (!activeWorkout) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-center text-gray-400 mb-5">
          <Dumbbell className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-white dark:text-white light:text-gray-900 mb-2">
          No Workout in Progress
        </h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
          Start a structured routine or launch a quick session to begin logging sets in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <button
            onClick={onOpenRoutinePicker}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black shadow-glow-lime hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            Choose Routine
          </button>
          <button
            onClick={() => {
              const newSession = {
                id: `workout-${Date.now()}`,
                name: 'Quick Workout',
                startTime: new Date().toISOString(),
                exercises: []
              };
              setActiveWorkout(newSession);
              setExercisePickerOpen(true);
            }}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white dark:text-white light:text-gray-900 border border-white/10 dark:border-white/10 light:border-black/10 transition-transform active:scale-95"
          >
            Empty Workout
          </button>
        </div>
      </div>
    );
  }

  const formatTimer = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Add set to an exercise
  const handleAddSet = (exerciseIndex) => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('light');

    const updated = { ...activeWorkout };
    const ex = updated.exercises[exerciseIndex];
    if (!ex.sets) ex.sets = [];

    const prevSet = ex.sets[ex.sets.length - 1];
    
    // Auto-prefill from either previous set in current session, or previous workout history!
    let defaultWeight = 0;
    let defaultReps = 10;

    if (prevSet) {
      defaultWeight = prevSet.weight;
      defaultReps = prevSet.reps;
    } else {
      const prevData = getPreviousExerciseData(ex.exerciseId, workoutHistory);
      if (prevData && prevData.sets && prevData.sets.length > 0) {
        defaultWeight = prevData.sets[0].weight;
        defaultReps = prevData.sets[0].reps;
      }
    }

    ex.sets.push({
      id: `s-${Date.now()}-${ex.sets.length + 1}`,
      setNumber: ex.sets.length + 1,
      weight: defaultWeight,
      reps: defaultReps,
      completed: false,
      isWarmup: false
    });

    setActiveWorkout(updated);
  };

  // Toggle set completion (The 1-tap core action!)
  const handleToggleComplete = (exerciseIndex, setIndex) => {
    const updated = { ...activeWorkout };
    const set = updated.exercises[exerciseIndex].sets[setIndex];
    const willBeCompleted = !set.completed;
    set.completed = willBeCompleted;

    if (willBeCompleted) {
      playSetCompleteSound(settings.soundEnabled);
      triggerHaptic('success');

      // Auto start rest timer if enabled
      if (settings.autoStartTimer) {
        const exerciseDetail = exercisesLibrary.find(e => e.id === updated.exercises[exerciseIndex].exerciseId);
        const restDuration = exerciseDetail?.defaultRest || settings.timerDefault || 90;

        setTimerState({
          duration: restDuration,
          remaining: restDuration,
          isRunning: true,
          isVisible: true
        });
      }
    } else {
      playTapSound(settings.soundEnabled);
      triggerHaptic('light');
    }

    setActiveWorkout(updated);
  };

  // Quick weight stepper (-2.5 / +2.5 kg or -5 / +5 lbs)
  const handleStepWeight = (exerciseIndex, setIndex, delta) => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('light');
    const updated = { ...activeWorkout };
    const set = updated.exercises[exerciseIndex].sets[setIndex];
    const current = parseFloat(set.weight) || 0;
    set.weight = Math.max(0, Math.round((current + delta) * 10) / 10);
    setActiveWorkout(updated);
  };

  // Quick reps stepper (-1 / +1)
  const handleStepReps = (exerciseIndex, setIndex, delta) => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('light');
    const updated = { ...activeWorkout };
    const set = updated.exercises[exerciseIndex].sets[setIndex];
    const current = parseInt(set.reps) || 0;
    set.reps = Math.max(0, current + delta);
    setActiveWorkout(updated);
  };

  // Update input directly
  const handleUpdateInput = (exerciseIndex, setIndex, field, value) => {
    const updated = { ...activeWorkout };
    updated.exercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveWorkout(updated);
  };

  // Copy previous set values with 1 tap on Previous column
  const handleCopyPrevious = (exerciseIndex, setIndex, prevSet) => {
    if (!prevSet) return;
    playTapSound(settings.soundEnabled);
    triggerHaptic('light');
    const updated = { ...activeWorkout };
    const set = updated.exercises[exerciseIndex].sets[setIndex];
    set.weight = prevSet.weight;
    set.reps = prevSet.reps;
    setActiveWorkout(updated);
  };

  // Delete a set
  const handleDeleteSet = (exerciseIndex, setIndex) => {
    playTapSound(settings.soundEnabled);
    const updated = { ...activeWorkout };
    updated.exercises[exerciseIndex].sets.splice(setIndex, 1);
    // Renumber sets
    updated.exercises[exerciseIndex].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    setActiveWorkout(updated);
  };

  // Delete exercise
  const handleDeleteExercise = (exerciseIndex) => {
    if (window.confirm('Remove this exercise from your workout?')) {
      const updated = { ...activeWorkout };
      updated.exercises.splice(exerciseIndex, 1);
      setActiveWorkout(updated);
    }
  };

  // Move exercise up/down
  const handleMoveExercise = (exerciseIndex, direction) => {
    const updated = { ...activeWorkout };
    const targetIdx = exerciseIndex + direction;
    if (targetIdx < 0 || targetIdx >= updated.exercises.length) return;
    const item = updated.exercises.splice(exerciseIndex, 1)[0];
    updated.exercises.splice(targetIdx, 0, item);
    setActiveWorkout(updated);
  };

  // Add exercise from library picker
  const handleSelectExercise = (exercise) => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('medium');

    const updated = { ...activeWorkout };
    
    // Look up previous history for this exercise
    const prevHistory = getPreviousExerciseData(exercise.id, workoutHistory);
    const initialSets = [];

    const numSets = exercise.defaultSets || 3;
    for (let i = 1; i <= numSets; i++) {
      let weight = 0;
      let reps = exercise.defaultReps || 10;

      if (prevHistory && prevHistory.sets && prevHistory.sets[i - 1]) {
        weight = prevHistory.sets[i - 1].weight;
        reps = prevHistory.sets[i - 1].reps;
      }

      initialSets.push({
        id: `s-${Date.now()}-${i}`,
        setNumber: i,
        weight,
        reps,
        completed: false,
        isWarmup: false
      });
    }

    updated.exercises.push({
      exerciseId: exercise.id,
      notes: '',
      sets: initialSets
    });

    setActiveWorkout(updated);
    setExercisePickerOpen(false);
  };

  // Filtered exercises for drawer
  const filteredExercises = exercisesLibrary.filter(ex => {
    const matchCategory = exerciseCategory === 'All' || ex.category === exerciseCategory;
    const matchSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                        ex.target.toLowerCase().includes(exerciseSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalSetsCompleted = activeWorkout.exercises.reduce((acc, ex) => {
    return acc + (ex.sets ? ex.sets.filter(s => s.completed).length : 0);
  }, 0);

  const totalSetsPlanned = activeWorkout.exercises.reduce((acc, ex) => {
    return acc + (ex.sets ? ex.sets.length : 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28">
      
      {/* Active Workout Header HUD */}
      <div className="p-4 sm:p-5 rounded-2xl border mb-6 glass-panel border-white/10 dark:border-white/10 dark:bg-[#15181E]/95 light:bg-white light:border-black/10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Workout Title & Time */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <input
                type="text"
                value={activeWorkout.name}
                onChange={(e) => setActiveWorkout({ ...activeWorkout, name: e.target.value })}
                className="font-extrabold text-xl sm:text-2xl tracking-tight bg-transparent text-white dark:text-white light:text-gray-900 border-none outline-none focus:ring-1 focus:ring-[#D4FF00] rounded px-1 -ml-1 w-full"
                placeholder="Workout Title"
              />
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 font-mono">
                <Timer className="w-3.5 h-3.5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
                <span className="text-white dark:text-white light:text-gray-900 font-bold text-sm">
                  {formatTimer(elapsedSeconds)}
                </span>
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="ml-1 p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                  title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
                >
                  {isTimerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
              </div>

              <div>
                Progress: <span className="font-bold text-white dark:text-white light:text-gray-900">{totalSetsCompleted}</span> / {totalSetsPlanned} sets
              </div>
            </div>
          </div>

          {/* Action Buttons: Finish & Discard */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 dark:border-white/10 light:border-black/10">
            <button
              onClick={() => onFinishWorkout(elapsedSeconds)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-extrabold text-sm bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Finish Workout
            </button>
            <button
              onClick={onCancelWorkout}
              className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 dark:border-white/10 light:border-black/10 transition-colors"
              title="Cancel & Discard Workout"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimal Progress bar across top */}
        <div className="w-full bg-white/5 dark:bg-white/5 light:bg-black/5 h-1.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] transition-all duration-300"
            style={{ width: `${totalSetsPlanned > 0 ? (totalSetsCompleted / totalSetsPlanned) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-5">
        {activeWorkout.exercises.map((workoutExercise, exIndex) => {
          const exerciseDetail = exercisesLibrary.find(e => e.id === workoutExercise.exerciseId) || {
            name: workoutExercise.exerciseId,
            category: 'Exercise',
            target: 'Muscles'
          };

          // Get previous workout history for this exercise
          const prevHistory = getPreviousExerciseData(workoutExercise.exerciseId, workoutHistory);

          return (
            <div 
              key={`ex-${exIndex}-${workoutExercise.exerciseId}`}
              className="rounded-2xl border p-4 sm:p-5 transition-colors border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-md"
            >
              {/* Exercise Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-lg text-white dark:text-white light:text-gray-900">
                      {exerciseDetail.name}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 dark:bg-white/10 light:bg-black/5 text-gray-300 dark:text-gray-300 light:text-gray-700">
                      {exerciseDetail.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 mt-0.5">
                    {exerciseDetail.target}
                  </p>
                </div>

                {/* Exercise Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveExercise(exIndex, -1)}
                    disabled={exIndex === 0}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-25"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveExercise(exIndex, 1)}
                    disabled={exIndex === activeWorkout.exercises.length - 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-25"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveNoteIndex(activeNoteIndex === exIndex ? null : exIndex)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      workoutExercise.notes ? 'text-[#D4FF00] bg-white/10' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Exercise Notes"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(exIndex)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                    title="Remove Exercise"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Collapsible Exercise Notes */}
              {activeNoteIndex === exIndex && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={workoutExercise.notes || ''}
                    onChange={(e) => {
                      const updated = { ...activeWorkout };
                      updated.exercises[exIndex].notes = e.target.value;
                      setActiveWorkout(updated);
                    }}
                    placeholder="Add notes for this exercise (e.g. seat setting 4, slight elbow flare)..."
                    className="w-full text-xs p-2.5 rounded-xl bg-black/20 dark:bg-black/20 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                  />
                </div>
              )}

              {/* Set Table */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 dark:text-gray-400 light:text-gray-500 font-semibold uppercase tracking-wider border-b border-white/5 dark:border-white/5 light:border-black/5 pb-2">
                      <th className="py-2 px-2 w-12 text-center">Set</th>
                      <th className="py-2 px-2 min-w-[100px]">Previous</th>
                      <th className="py-2 px-2 min-w-[130px]">Weight ({settings.unit})</th>
                      <th className="py-2 px-2 min-w-[110px]">Reps</th>
                      <th className="py-2 px-2 w-16 text-center">Done</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 dark:divide-white/5 light:divide-black/5">
                    {workoutExercise.sets?.map((set, setIndex) => {
                      const prevSet = prevHistory?.sets?.[setIndex];
                      const prevFormatted = prevSet 
                        ? `${prevSet.weight} ${settings.unit} × ${prevSet.reps}`
                        : '—';

                      const isDone = set.completed;

                      return (
                        <tr 
                          key={set.id || `s-${setIndex}`}
                          className={`transition-colors duration-150 ${
                            isDone 
                              ? 'bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50' 
                              : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          {/* Set Number */}
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-gray-300 dark:text-gray-300 light:text-gray-700">
                            {set.setNumber}
                          </td>

                          {/* Previous workout reference - tap to auto-fill! */}
                          <td className="py-2.5 px-2 font-mono">
                            {prevSet ? (
                              <button
                                onClick={() => handleCopyPrevious(exIndex, setIndex, prevSet)}
                                title="Tap to copy previous workout's weight and reps"
                                className="text-gray-400 hover:text-[#D4FF00] dark:hover:text-[#D4FF00] light:hover:text-[#10B981] transition-colors underline decoration-dotted decoration-white/20 underline-offset-2 flex items-center gap-1 text-[11px]"
                              >
                                {prevFormatted}
                              </button>
                            ) : (
                              <span className="text-gray-600 dark:text-gray-600 light:text-gray-400 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Weight with +/- Steppers */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStepWeight(exIndex, setIndex, settings.unit === 'lbs' ? -5 : -2.5)}
                                className="w-6 h-7 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-mono font-bold text-xs"
                                title={settings.unit === 'lbs' ? "-5 lbs" : "-2.5 kg"}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                step="any"
                                value={set.weight === 0 && !isDone ? '' : set.weight}
                                onChange={(e) => handleUpdateInput(exIndex, setIndex, 'weight', e.target.value)}
                                placeholder="0"
                                className="w-14 sm:w-16 py-1 px-1.5 rounded-lg bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-center font-mono font-bold text-sm text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                              />
                              <button
                                onClick={() => handleStepWeight(exIndex, setIndex, settings.unit === 'lbs' ? 5 : 2.5)}
                                className="w-6 h-7 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-mono font-bold text-xs"
                                title={settings.unit === 'lbs' ? "+5 lbs" : "+2.5 kg"}
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Reps with +/- Steppers */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStepReps(exIndex, setIndex, -1)}
                                className="w-6 h-7 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-mono font-bold text-xs"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={set.reps === 0 && !isDone ? '' : set.reps}
                                onChange={(e) => handleUpdateInput(exIndex, setIndex, 'reps', e.target.value)}
                                placeholder="0"
                                className="w-12 sm:w-14 py-1 px-1.5 rounded-lg bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-center font-mono font-bold text-sm text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                              />
                              <button
                                onClick={() => handleStepReps(exIndex, setIndex, 1)}
                                className="w-6 h-7 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-mono font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Complete 1-Tap Button */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => handleToggleComplete(exIndex, setIndex)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
                                isDone 
                                  ? 'bg-[#D4FF00] text-black shadow-glow-lime' 
                                  : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white'
                              }`}
                              title={isDone ? "Set completed (Tap to uncheck)" : "Tap to complete set"}
                            >
                              <Check className={`w-5 h-5 ${isDone ? 'stroke-[3]' : 'stroke-[2]'}`} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Set Actions: Add Set & Delete Set */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 dark:border-white/5 light:border-black/5">
                <button
                  onClick={() => handleAddSet(exIndex)}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] border border-white/10 dark:border-white/10 light:border-black/10 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Set
                </button>

                {workoutExercise.sets?.length > 1 && (
                  <button
                    onClick={() => handleDeleteSet(exIndex, workoutExercise.sets.length - 1)}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Delete Last Set
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Button to Add Exercise */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => setExercisePickerOpen(true)}
          className="w-full py-4 rounded-2xl font-extrabold text-sm border-2 border-dashed border-white/20 hover:border-[#D4FF00] hover:bg-[#D4FF00]/5 text-gray-300 hover:text-white dark:hover:text-white light:text-gray-700 light:hover:text-black flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
          Add Exercise to Workout
        </button>

        {activeWorkout.exercises.length > 0 && (
          <button
            onClick={() => onFinishWorkout(elapsedSeconds)}
            className="w-full py-4 rounded-2xl font-extrabold text-base bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            Complete & Finish Workout
          </button>
        )}
      </div>

      {/* Exercise Picker Modal / Drawer */}
      {exercisePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-white dark:text-white light:text-gray-900">
                  Select Exercise
                </h3>
                <p className="text-xs text-gray-400">
                  Choose an exercise to add to your workout session
                </p>
              </div>
              <button
                onClick={() => setExercisePickerOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-white/5 dark:border-white/5 light:border-black/5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  placeholder="Search exercise or muscle..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-sm text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
                {['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Cardio'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setExerciseCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      exerciseCategory === cat 
                        ? 'bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black font-bold' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercises List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-96">
              {filteredExercises.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  No exercises found matching "{exerciseSearch}"
                </div>
              ) : (
                filteredExercises.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectExercise(ex)}
                    className="p-3.5 rounded-xl border border-white/5 dark:border-white/5 light:border-black/5 bg-white/[0.02] hover:bg-white/5 light:bg-gray-50 light:hover:bg-gray-100 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-sm text-white dark:text-white light:text-gray-900 group-hover:text-[#D4FF00] dark:group-hover:text-[#D4FF00] light:group-hover:text-[#10B981] transition-colors">
                        {ex.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 dark:bg-white/10 light:bg-black/5 text-[10px] font-semibold">
                          {ex.category}
                        </span>
                        <span>{ex.equipment}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#D4FF00] group-hover:text-black flex items-center justify-center transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
