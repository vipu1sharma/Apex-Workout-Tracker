import React, { useState } from 'react';
import { 
  TrendingUp, 
  Trophy, 
  Calendar, 
  Layers, 
  Flame, 
  Dumbbell, 
  ChevronDown,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  calculateAllPRs, 
  getExerciseHistoryProgression, 
  calculateWorkoutVolume 
} from '../utils/analytics';
import { formatVolume, formatWeight } from '../utils/units';

export default function ProgressView({ 
  workouts, 
  exercisesLibrary, 
  settings 
}) {
  const [selectedPeriod, setSelectedPeriod] = useState('All'); // '1M', '3M', 'All'
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    exercisesLibrary.find(e => e.id === 'barbell-bench-press')?.id || exercisesLibrary[0]?.id || ''
  );
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const allPRs = calculateAllPRs(workouts);
  const prList = Object.values(allPRs);

  // Filter workouts by selected period
  const now = new Date();
  const filteredWorkouts = workouts.filter(w => {
    if (!w.completed || !w.date) return false;
    if (selectedPeriod === 'All') return true;
    const d = new Date(w.date);
    const diffDays = (now - d) / (1000 * 3600 * 24);
    if (selectedPeriod === '1M') return diffDays <= 30;
    if (selectedPeriod === '3M') return diffDays <= 90;
    return true;
  });

  // Strength progression for the selected exercise
  const exerciseProgression = getExerciseHistoryProgression(selectedExerciseId, filteredWorkouts);
  const selectedExerciseDetail = exercisesLibrary.find(e => e.id === selectedExerciseId);

  // Group workouts by week for the Volume Chart
  const getWeeklyVolumeGroups = () => {
    const weeksMap = {};
    const sorted = [...filteredWorkouts].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(w => {
      const d = new Date(w.date);
      // Format week start label: e.g. "Nov 3"
      const weekDate = new Date(d);
      const day = weekDate.getDay();
      const diff = weekDate.getDate() - day + (day === 0 ? -6 : 1);
      weekDate.setDate(diff);
      const label = weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!weeksMap[label]) {
        weeksMap[label] = { label, volume: 0, count: 0 };
      }
      weeksMap[label].volume += calculateWorkoutVolume(w);
      weeksMap[label].count += 1;
    });

    return Object.values(weeksMap);
  };

  const weeklyVolumeData = getWeeklyVolumeGroups();
  const maxWeeklyVol = Math.max(...weeklyVolumeData.map(w => w.volume), 1000);

  // Progression chart bounds
  const maxWeightVal = Math.max(...exerciseProgression.map(p => p.maxWeight), 50);
  const minWeightVal = Math.min(...exerciseProgression.map(p => p.maxWeight), 0);
  const weightRange = Math.max(maxWeightVal - minWeightVal, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      {/* Header & Time Period Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">
            Progress Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time strength curves, volume load, and verified personal bests
          </p>
        </div>

        {/* Time period pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/5 dark:border-white/5 light:border-black/5 self-start sm:self-auto">
          {['1M', '3M', 'All'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                selectedPeriod === period 
                  ? 'bg-[#D4FF00] dark:bg-[#D4FF00] light:bg-[#10B981] text-black shadow-glow-lime' 
                  : 'text-gray-400 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-black'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Strength Progression Chart Card */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-lg">
        
        {/* Chart Header & Exercise Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]" />
              <h3 className="font-extrabold text-base text-white dark:text-white light:text-gray-900">
                Strength Progression
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Tracking top set load and estimated 1-Rep Max over time
            </p>
          </div>

          {/* Exercise Selector */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 dark:bg-black/40 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10 text-xs font-bold text-white dark:text-white light:text-gray-900 outline-none focus:border-[#D4FF00] cursor-pointer"
            >
              {exercisesLibrary.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SVG Interactive Line Chart */}
        {exerciseProgression.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-xs">
            No completed workouts logged yet for {selectedExerciseDetail?.name || 'this exercise'}.
          </div>
        ) : (
          <div className="relative pt-4 pb-2">
            
            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute z-20 -top-2 transform -translate-x-1/2 p-2 rounded-xl bg-[#0D0F12] border border-[#D4FF00]/40 text-center shadow-xl pointer-events-none"
                style={{ left: `${hoveredPoint.pctX}%` }}
              >
                <div className="text-[10px] text-gray-400 font-mono">{hoveredPoint.dateKey}</div>
                <div className="font-mono font-bold text-xs text-[#D4FF00]">
                  {hoveredPoint.maxWeight} {settings.unit} (1RM: ~{hoveredPoint.estimated1RM} {settings.unit})
                </div>
              </div>
            )}

            {/* SVG Drawing */}
            <div className="h-44 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4FF00" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#D4FF00" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                {[0.2, 0.5, 0.8].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={160 * ratio}
                    x2="500"
                    y2={160 * ratio}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Line coordinates */}
                {(() => {
                  const pointsCount = exerciseProgression.length;
                  const pts = exerciseProgression.map((p, idx) => {
                    const x = pointsCount === 1 ? 250 : (idx / (pointsCount - 1)) * 480 + 10;
                    const y = 140 - ((p.maxWeight - (minWeightVal * 0.8)) / (weightRange * 1.3 || 1)) * 120;
                    return { x, y, data: p };
                  });

                  const pathD = pts.reduce((acc, pt, idx) => {
                    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                  }, '');

                  const areaD = `${pathD} L ${pts[pts.length - 1].x} 160 L ${pts[0].x} 160 Z`;

                  return (
                    <>
                      {/* Gradient fill */}
                      <path d={areaD} fill="url(#strengthGradient)" />

                      {/* Smooth stroke line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#D4FF00"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Point Circles */}
                      {pts.map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          className="fill-[#0D0F12] stroke-[#D4FF00] stroke-[3] cursor-pointer hover:r-7 transition-all"
                          onMouseEnter={() => setHoveredPoint({ ...pt.data, pctX: (pt.x / 500) * 100 })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Bottom date milestones */}
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 pt-2 border-t border-white/5">
              <span>{exerciseProgression[0]?.dateKey}</span>
              <span className="font-bold text-gray-300">
                Current Best: {Math.max(...exerciseProgression.map(p => p.maxWeight))} {settings.unit}
              </span>
              <span>{exerciseProgression[exerciseProgression.length - 1]?.dateKey}</span>
            </div>
          </div>
        )}

      </div>

      {/* Weekly Training Volume Bar Chart */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/10 dark:border-white/10 dark:bg-[#15181E] light:bg-white light:border-black/10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <h3 className="font-extrabold text-base text-white dark:text-white light:text-gray-900">
                Weekly Training Volume Load
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Total tonnage lifted per training week ({settings.unit})
            </p>
          </div>
        </div>

        {weeklyVolumeData.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No volume data logged for this period.
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
            {weeklyVolumeData.map((wk, idx) => {
              const heightPct = Math.max(12, Math.round((wk.volume / maxWeeklyVol) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatVolume(wk.volume, settings.unit)}
                  </div>
                  <div className="w-full max-w-[42px] bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-xl overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-blue-500 hover:bg-[#D4FF00] transition-all rounded-xl"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">
                    {wk.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Personal Records (PR) Hall of Fame */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-base text-white dark:text-white light:text-gray-900">
              Personal Records Hall of Fame
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {prList.length} verified records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {prList.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-gray-500 text-xs">
              Complete your first workout to establish personal records!
            </div>
          ) : (
            prList.map((pr) => {
              const exDetail = exercisesLibrary.find(e => e.id === pr.exerciseId) || { name: pr.exerciseId };

              return (
                <div
                  key={pr.exerciseId}
                  className="p-4 rounded-2xl border border-white/5 dark:border-white/5 light:border-black/5 bg-white/[0.02] hover:bg-white/5 light:bg-gray-50 light:hover:bg-gray-100 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> ALL-TIME PR
                      </span>
                      <span className="text-gray-500">
                        {new Date(pr.achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white dark:text-white light:text-gray-900">
                      {exDetail.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 dark:border-white/5 light:border-black/5 flex items-baseline justify-between">
                    <div>
                      <span className="font-mono text-xl font-extrabold text-[#D4FF00] dark:text-[#D4FF00] light:text-[#10B981]">
                        {pr.maxWeight} {settings.unit}
                      </span>
                      <span className="text-xs text-gray-400 ml-1 font-mono">
                        × {pr.maxWeightReps} reps
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-gray-400">
                      1RM: ~{pr.best1RM} {settings.unit}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
