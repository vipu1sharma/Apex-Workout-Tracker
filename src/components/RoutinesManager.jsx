import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Copy, 
  Edit3, 
  Trash2, 
  Layers, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Check, 
  Search,
  Dumbbell
} from 'lucide-react';
import { playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function RoutinesManager({ 
  routines, 
  setRoutines, 
  exercisesLibrary, 
  onStartRoutine, 
  settings 
}) {
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [exerciseSelectorOpen, setExerciseSelectorOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');

  // 1-Tap start routine
  const handleStart = (routine) => {
    playTapSound(settings.soundEnabled);
    triggerHaptic('medium');
    onStartRoutine(routine);
  };

  // Duplicate routine
  const handleDuplicate = (routine, e) => {
    e.stopPropagation();
    playTapSound(settings.soundEnabled);
    triggerHaptic('light');

    const cloned = {
      ...routine,
      id: `routine-copy-${Date.now()}`,
      name: `${routine.name} (Copy)`,
      exercises: routine.exercises.map(ex => ({ ...ex }))
    };

    setRoutines([cloned, ...routines]);
  };

  // Delete routine
  const handleDelete = (routineId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this routine?')) {
      playTapSound(settings.soundEnabled);
      setRoutines(routines.filter(r => r.id !== routineId));
    }
  };

  // Open builder for new routine
  const handleOpenNew = () => {
    playTapSound(settings.soundEnabled);
    setEditingRoutine({
      id: `routine-${Date.now()}`,
      name: 'Custom Workout Plan',
      category: 'Hypertrophy',
      description: 'Custom training routine',
      estimatedMinutes: 45,
      exercises: []
    });
  };

  // Open editor for existing routine
  const handleOpenEdit = (routine, e) => {
    e.stopPropagation();
    playTapSound(settings.soundEnabled);
    setEditingRoutine(JSON.parse(JSON.stringify(routine)));
  };

  // Save routine changes
  const handleSaveRoutine = (e) => {
    e.preventDefault();
    if (!editingRoutine.name.trim()) return;

    playTapSound(settings.soundEnabled);
    triggerHaptic('success');

    const exists = routines.some(r => r.id === editingRoutine.id);
    let updated;
    if (exists) {
      updated = routines.map(r => r.id === editingRoutine.id ? editingRoutine : r);
    } else {
      updated = [editingRoutine, ...routines];
    }
    setRoutines(updated);
    setEditingRoutine(null);
  };

  // Builder: Reorder exercise
  const handleMoveBuilderExercise = (index, delta) => {
    const updated = { ...editingRoutine };
    const target = index + delta;
    if (target < 0 || target >= updated.exercises.length) return;
    const item = updated.exercises.splice(index, 1)[0];
    updated.exercises.splice(target, 0, item);
    setEditingRoutine(updated);
  };

  // Builder: Remove exercise
  const handleRemoveBuilderExercise = (index) => {
    const updated = { ...editingRoutine };
    updated.exercises.splice(index, 1);
    setEditingRoutine(updated);
  };

  // Builder: Add exercise
  const handleAddExerciseToRoutine = (exercise) => {
    const updated = { ...editingRoutine };
    updated.exercises.push({
      exerciseId: exercise.id,
      targetSets: exercise.defaultSets || 3,
      targetReps: exercise.defaultReps || 10,
      defaultWeight: 0,
      restSeconds: exercise.defaultRest || 60,
      notes: ''
    });
    setEditingRoutine(updated);
    setExerciseSelectorOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">
            Workout Routines
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Structured workout splits you can start in 1 tap or customize
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Routine
        </button>
      </div>

      {/* Routine Cards Grid */}
      <div className="space-y-4">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="p-5 rounded-2xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-md transition-all hover:border-white/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Routine Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 dark:bg-white/10 light:bg-black/5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
                    {routine.category || 'Routine'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    ~{routine.estimatedMinutes || 45} mins
                  </span>
                  <span className="text-xs text-gray-400">
                    • {routine.exercises?.length || 0} exercises
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-white dark:text-white light:text-gray-900">
                  {routine.name}
                </h3>

                <p className="text-xs text-gray-400 mt-1 max-w-xl">
                  {routine.description}
                </p>

                {/* Exercise Pills preview */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {routine.exercises?.slice(0, 5).map((exItem, idx) => {
                    const exName = exercisesLibrary.find(e => e.id === exItem.exerciseId)?.name || exItem.exerciseId;
                    return (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 dark:bg-white/5 light:bg-gray-100 text-gray-300 dark:text-gray-300 light:text-gray-700 border border-white/5"
                      >
                        {exName} ({exItem.targetSets}×{exItem.targetReps})
                      </span>
                    );
                  })}
                  {routine.exercises?.length > 5 && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      +{routine.exercises.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 dark:border-white/5 light:border-black/5 self-end sm:self-center">
                <button
                  onClick={() => handleStart(routine)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Start
                </button>

                <button
                  onClick={(e) => handleOpenEdit(routine, e)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                  title="Edit Routine"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleDuplicate(routine, e)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                  title="Duplicate Routine"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleDelete(routine.id, e)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors"
                  title="Delete Routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Routine Builder / Editor Modal */}
      {editingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl p-6 relative my-auto max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10 light:border-black/10 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white dark:text-white light:text-gray-900">
                  {editingRoutine.id.includes('copy') || !routines.some(r => r.id === editingRoutine.id) ? 'Create Workout Routine' : 'Edit Routine'}
                </h3>
                <p className="text-xs text-gray-400">Configure routine name, target sets, reps, and exercise sequence</p>
              </div>
              <button
                onClick={() => setEditingRoutine(null)}
                className="p-2 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoutine} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Routine metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Routine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRoutine.name}
                    onChange={(e) => setEditingRoutine({ ...editingRoutine, name: e.target.value })}
                    placeholder="e.g. Upper Body Hypertrophy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-sm text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Estimated Time (mins)
                  </label>
                  <input
                    type="number"
                    value={editingRoutine.estimatedMinutes}
                    onChange={(e) => setEditingRoutine({ ...editingRoutine, estimatedMinutes: parseInt(e.target.value) || 45 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-sm font-mono text-center text-white dark:text-white light:text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Description / Focus
                </label>
                <input
                  type="text"
                  value={editingRoutine.description}
                  onChange={(e) => setEditingRoutine({ ...editingRoutine, description: e.target.value })}
                  placeholder="e.g. Heavy compound lifts with auxiliary shoulder isolation"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-xs text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                />
              </div>

              {/* Exercises in routine */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700">
                    Exercises ({editingRoutine.exercises?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => setExerciseSelectorOpen(true)}
                    className="text-xs font-bold text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Exercise
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editingRoutine.exercises?.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-xs border border-dashed border-white/10 rounded-2xl">
                      No exercises added yet. Tap "Add Exercise" to select movements.
                    </div>
                  ) : (
                    editingRoutine.exercises?.map((exItem, idx) => {
                      const exDetail = exercisesLibrary.find(e => e.id === exItem.exerciseId) || { name: exItem.exerciseId };

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-white/5 dark:border-white/5 light:border-black/5 bg-white/[0.02] flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-500 w-4 text-center">{idx + 1}</span>
                            <div>
                              <div className="font-bold text-white dark:text-white light:text-gray-900">{exDetail.name}</div>
                              <div className="text-[10px] text-gray-400">Rest: {exItem.restSeconds || 60}s</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 font-mono">
                              <input
                                type="number"
                                value={exItem.targetSets}
                                onChange={(e) => {
                                  const updated = { ...editingRoutine };
                                  updated.exercises[idx].targetSets = parseInt(e.target.value) || 1;
                                  setEditingRoutine(updated);
                                }}
                                className="w-9 py-1 text-center rounded bg-black/40 border border-white/10 font-bold"
                              />
                              <span className="text-gray-500">sets ×</span>
                              <input
                                type="number"
                                value={exItem.targetReps}
                                onChange={(e) => {
                                  const updated = { ...editingRoutine };
                                  updated.exercises[idx].targetReps = parseInt(e.target.value) || 1;
                                  setEditingRoutine(updated);
                                }}
                                className="w-9 py-1 text-center rounded bg-black/40 border border-white/10 font-bold"
                              />
                              <span className="text-gray-500">reps</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleMoveBuilderExercise(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-20"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveBuilderExercise(idx, 1)}
                              disabled={idx === editingRoutine.exercises.length - 1}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-20"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBuilderExercise(idx)}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl font-bold text-xs bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black shadow-glow-lime hover:brightness-110 transition-transform active:scale-95"
                >
                  Save Workout Routine
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoutine(null)}
                  className="px-5 py-3.5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Exercise Selector inside builder */}
            {exerciseSelectorOpen && (
              <div className="absolute inset-0 z-10 p-6 rounded-3xl bg-[#15181E] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h4 className="font-extrabold text-sm text-white">Choose Exercise to Add</h4>
                  <button onClick={() => setExerciseSelectorOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    placeholder="Search exercise..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-[#D4FF00]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {exercisesLibrary
                    .filter(e => e.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
                    .map(e => (
                      <div
                        key={e.id}
                        onClick={() => handleAddExerciseToRoutine(e)}
                        className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{e.name}</div>
                          <div className="text-[10px] text-gray-400">{e.category} • {e.target}</div>
                        </div>
                        <Plus className="w-4 h-4 text-[#D4FF00]" />
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
