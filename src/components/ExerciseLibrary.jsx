import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Dumbbell, 
  Flame, 
  Info, 
  Clock, 
  TrendingUp, 
  X,
  Check,
  ChevronRight
} from 'lucide-react';
import { EXERCISE_CATEGORIES, EQUIPMENT_TYPES } from '../data/exerciseLibrary';
import { getPreviousExerciseData, getExerciseHistoryProgression } from '../utils/analytics';
import { formatWeight } from '../utils/units';
import { playTapSound } from '../utils/sound';

export default function ExerciseLibrary({ 
  exercises, 
  setExercises, 
  workoutHistory, 
  settings, 
  onStartExercise 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // New Custom Exercise Form
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState('Chest');
  const [newExEquipment, setNewExEquipment] = useState('Dumbbell');
  const [newExTarget, setNewExTarget] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(10);
  const [newExRest, setNewExRest] = useState(60);
  const [newExInstructions, setNewExInstructions] = useState('');

  // Filtering
  const filtered = exercises.filter(ex => {
    const matchCat = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchEq = selectedEquipment === 'All' || ex.equipment === selectedEquipment;
    const matchQuery = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ex.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchEq && matchQuery;
  });

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    playTapSound(settings.soundEnabled);

    const newExercise = {
      id: `custom-${Date.now()}`,
      name: newExName.trim(),
      category: newExCategory,
      equipment: newExEquipment,
      target: newExTarget.trim() || 'General Hypertrophy',
      defaultSets: parseInt(newExSets) || 3,
      defaultReps: parseInt(newExReps) || 10,
      defaultRest: parseInt(newExRest) || 60,
      instructions: newExInstructions.trim() || 'Focus on controlled tempo and full range of motion.',
      isCustom: true
    };

    const updated = [newExercise, ...exercises];
    setExercises(updated);
    setCustomModalOpen(false);

    // Reset form
    setNewExName('');
    setNewExTarget('');
    setNewExInstructions('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">
            Exercise Library
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Browse {exercises.length} exercises with instructions, progression history, and targets
          </p>
        </div>

        <button
          onClick={() => setCustomModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] hover:brightness-110 text-black shadow-glow-lime transition-all active:scale-95 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Custom Exercise
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, muscle, or equipment..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-sm text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00] transition-colors"
          />
        </div>

        {/* Category Pills Carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {EXERCISE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black font-bold shadow-glow-lime' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-black border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-gray-400 no-scrollbar">
          <span className="text-[11px] font-mono uppercase tracking-wider pl-1">Equipment:</span>
          {EQUIPMENT_TYPES.map((eq) => (
            <button
              key={eq}
              onClick={() => setSelectedEquipment(eq)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedEquipment === eq 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {eq}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-gray-500 text-sm">
            No exercises found matching your filters.
          </div>
        ) : (
          filtered.map((ex) => {
            const prev = getPreviousExerciseData(ex.id, workoutHistory);

            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="p-4 rounded-2xl border border-white/5 dark:border-white/5 light:border-black/5 bg-white/[0.02] hover:bg-white/5 light:bg-gray-50 light:hover:bg-gray-100 cursor-pointer transition-all duration-200 group flex flex-col justify-between hover:border-white/15"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 dark:bg-white/10 light:bg-black/5 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
                      {ex.category}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {ex.equipment}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white dark:text-white light:text-gray-900 group-hover:text-[#D4FF00] dark:group-hover:text-[#D4FF00] light:group-hover:text-[#10B981] transition-colors">
                    {ex.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {ex.target}
                  </p>
                </div>

                {/* History Glance */}
                <div className="mt-3 pt-3 border-t border-white/5 dark:border-white/5 light:border-black/5 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span>Rest: {ex.defaultRest}s</span>
                  </div>

                  {prev ? (
                    <span className="font-mono text-[11px] text-gray-300">
                      Last: {prev.sets[0]?.weight} {settings.unit} × {prev.sets[0]?.reps}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-500">No logs yet</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl p-6 relative">
            
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#D4FF00]/10 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
                {selectedExercise.category}
              </span>
              <span className="text-xs text-gray-400">
                {selectedExercise.equipment}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-gray-900">
              {selectedExercise.name}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Target: <strong className="text-gray-200">{selectedExercise.target}</strong>
            </p>

            {/* Instructions */}
            <div className="mt-4 p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700 mb-1.5">
                <Info className="w-4 h-4 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
                Form & Execution Tips
              </div>
              <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                {selectedExercise.instructions}
              </p>
            </div>

            {/* Target & Defaults */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-gray-100">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Default Sets</div>
                <div className="font-mono font-bold text-sm text-white dark:text-white light:text-gray-900 mt-0.5">
                  {selectedExercise.defaultSets}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-gray-100">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Target Reps</div>
                <div className="font-mono font-bold text-sm text-white dark:text-white light:text-gray-900 mt-0.5">
                  {selectedExercise.defaultReps}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-gray-100">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Rest Time</div>
                <div className="font-mono font-bold text-sm text-white dark:text-white light:text-gray-900 mt-0.5">
                  {selectedExercise.defaultRest}s
                </div>
              </div>
            </div>

            {/* History Section */}
            {(() => {
              const progression = getExerciseHistoryProgression(selectedExercise.id, workoutHistory);
              if (progression.length === 0) return null;

              return (
                <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700 mb-2">
                    Recent History Log
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {progression.slice(-3).reverse().map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.02]">
                        <span className="text-gray-400">{p.dateKey}</span>
                        <span className="font-mono font-bold text-white dark:text-white light:text-gray-900">
                          {p.maxWeight} {settings.unit} max • 1RM ~{p.estimated1RM} {settings.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Close button */}
            <button
              onClick={() => setSelectedExercise(null)}
              className="w-full mt-5 py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white dark:text-white light:text-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-2xl p-6 relative">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white dark:text-white light:text-gray-900">
                New Custom Exercise
              </h3>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  required
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="e.g. Pendlay Row, Safety Bar Squat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-sm text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Muscle Group
                  </label>
                  <select
                    value={newExCategory}
                    onChange={(e) => setNewExCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-xs text-white dark:text-white light:text-gray-900 outline-none"
                  >
                    {EXERCISE_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                    Equipment
                  </label>
                  <select
                    value={newExEquipment}
                    onChange={(e) => setNewExEquipment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-xs text-white dark:text-white light:text-gray-900 outline-none"
                  >
                    {EQUIPMENT_TYPES.filter(e => e !== 'All').map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Target Specifics
                </label>
                <input
                  type="text"
                  value={newExTarget}
                  onChange={(e) => setNewExTarget(e.target.value)}
                  placeholder="e.g. Upper chest, Lower lats"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-xs text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Sets</label>
                  <input
                    type="number"
                    value={newExSets}
                    onChange={(e) => setNewExSets(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-xs text-center font-mono font-bold text-white dark:text-white light:text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Reps</label>
                  <input
                    type="number"
                    value={newExReps}
                    onChange={(e) => setNewExReps(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-xs text-center font-mono font-bold text-white dark:text-white light:text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Rest (s)</label>
                  <input
                    type="number"
                    value={newExRest}
                    onChange={(e) => setNewExRest(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 text-xs text-center font-mono font-bold text-white dark:text-white light:text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Optional Form Notes
                </label>
                <textarea
                  value={newExInstructions}
                  onChange={(e) => setNewExInstructions(e.target.value)}
                  rows={2}
                  placeholder="Tips on grip, stance, tempo..."
                  className="w-full px-3 py-2 rounded-xl bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-xs text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00] resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black shadow-glow-lime hover:brightness-110 transition-transform active:scale-95"
                >
                  Create Exercise
                </button>
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
