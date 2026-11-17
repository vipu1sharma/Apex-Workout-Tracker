// Analytics, Streak Calculation, PR Detection, and Brzycki 1RM formula

// Brzycki formula for estimated 1-Rep Max
export function calculate1RM(weight, reps) {
  if (!weight || !reps || reps <= 0) return 0;
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // Boundary condition
  return Math.round(weight * (36 / (37 - reps)) * 10) / 10;
}

// Calculate total volume for a single workout (kg)
export function calculateWorkoutVolume(workout) {
  if (!workout || !workout.exercises) return 0;
  let total = 0;
  workout.exercises.forEach(ex => {
    if (ex.sets) {
      ex.sets.forEach(set => {
        if (set.completed && !set.isWarmup && set.weight && set.reps) {
          total += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
        }
      });
    }
  });
  return Math.round(total * 10) / 10;
}

// Calculate total sets completed in a workout
export function calculateTotalSets(workout) {
  if (!workout || !workout.exercises) return 0;
  return workout.exercises.reduce((acc, ex) => {
    return acc + (ex.sets ? ex.sets.filter(s => s.completed).length : 0);
  }, 0);
}

// Calculate total repetitions in a workout
export function calculateTotalReps(workout) {
  if (!workout || !workout.exercises) return 0;
  return workout.exercises.reduce((acc, ex) => {
    if (!ex.sets) return acc;
    return acc + ex.sets.reduce((sAcc, s) => s.completed ? sAcc + (parseInt(s.reps) || 0) : sAcc, 0);
  }, 0);
}

// Get the most recent previous sets logged for an exercise
export function getPreviousExerciseData(exerciseId, pastWorkouts) {
  if (!pastWorkouts || pastWorkouts.length === 0) return null;

  // Sort newest first
  const sorted = [...pastWorkouts].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const w of sorted) {
    if (!w.completed || !w.exercises) continue;
    const found = w.exercises.find(e => e.exerciseId === exerciseId);
    if (found && found.sets && found.sets.some(s => s.completed)) {
      const completedSets = found.sets.filter(s => s.completed);
      return {
        date: w.date,
        workoutName: w.name,
        sets: completedSets.map((s, idx) => ({
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
          isWarmup: s.isWarmup
        }))
      };
    }
  }

  return null;
}

// Scan all workouts to calculate all-time Personal Records per exercise
export function calculateAllPRs(workouts) {
  const prMap = {};

  const sorted = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(w => {
    if (!w.completed || !w.exercises) return;
    w.exercises.forEach(ex => {
      if (!ex.sets) return;
      ex.sets.forEach(s => {
        if (!s.completed || s.isWarmup) return;
        const weight = parseFloat(s.weight) || 0;
        const reps = parseInt(s.reps) || 0;
        const est1RM = calculate1RM(weight, reps);

        if (!prMap[ex.exerciseId]) {
          prMap[ex.exerciseId] = {
            exerciseId: ex.exerciseId,
            maxWeight: weight,
            maxWeightReps: reps,
            best1RM: est1RM,
            bestVolumeSet: weight * reps,
            achievedDate: w.date,
            workoutName: w.name
          };
        } else {
          const current = prMap[ex.exerciseId];
          if (weight > current.maxWeight) {
            current.maxWeight = weight;
            current.maxWeightReps = reps;
            current.achievedDate = w.date;
          }
          if (est1RM > current.best1RM) {
            current.best1RM = est1RM;
          }
          if (weight * reps > current.bestVolumeSet) {
            current.bestVolumeSet = weight * reps;
          }
        }
      });
    });
  });

  return prMap;
}

// Detect if any set in current workout beat previous records
export function detectNewPRsInWorkout(currentWorkout, pastWorkouts) {
  if (!currentWorkout || !currentWorkout.exercises) return [];

  // PR map prior to current workout
  const priorPRs = calculateAllPRs(pastWorkouts);
  const newPRs = [];

  currentWorkout.exercises.forEach(ex => {
    if (!ex.sets) return;
    const prior = priorPRs[ex.exerciseId];

    ex.sets.forEach(s => {
      if (!s.completed || s.isWarmup) return;
      const weight = parseFloat(s.weight) || 0;
      const reps = parseInt(s.reps) || 0;
      const est1RM = calculate1RM(weight, reps);

      if (!prior) {
        // First time recording
        newPRs.push({
          exerciseId: ex.exerciseId,
          type: 'First Record',
          weight,
          reps,
          est1RM
        });
      } else if (weight > prior.maxWeight) {
        newPRs.push({
          exerciseId: ex.exerciseId,
          type: 'Max Weight PR',
          weight,
          reps,
          prevWeight: prior.maxWeight,
          est1RM
        });
      } else if (est1RM > prior.best1RM && weight >= prior.maxWeight * 0.9) {
        newPRs.push({
          exerciseId: ex.exerciseId,
          type: 'Estimated 1RM PR',
          weight,
          reps,
          est1RM,
          prev1RM: prior.best1RM
        });
      }
    });
  });

  // Deduplicate by exerciseId
  const unique = [];
  const seen = new Set();
  newPRs.forEach(p => {
    if (!seen.has(p.exerciseId)) {
      seen.add(p.exerciseId);
      unique.push(p);
    }
  });

  return unique;
}

// Calculate weekly workout streak (consecutive weeks or active days)
export function calculateStreak(workouts) {
  if (!workouts || workouts.length === 0) return { streakDays: 0, streakWeeks: 0 };

  const completed = workouts
    .filter(w => w.completed)
    .map(w => w.dateKey || (w.date ? w.date.split('T')[0] : ''))
    .filter(Boolean);

  const uniqueDays = Array.from(new Set(completed)).sort().reverse();
  if (uniqueDays.length === 0) return { streakDays: 0, streakWeeks: 0 };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If latest workout is neither today nor yesterday, streak is currently 0
  const latest = uniqueDays[0];
  if (latest !== today && latest !== yesterday) {
    return { streakDays: 0, streakWeeks: 1 };
  }

  // Count consecutive active days
  let streak = 0;
  let checkDate = new Date(latest);

  for (let i = 0; i < uniqueDays.length; i++) {
    const dayStr = uniqueDays[i];
    const expected = checkDate.toISOString().split('T')[0];
    if (dayStr === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate weekly consistency
  return {
    streakDays: Math.max(streak, 1),
    streakWeeks: Math.min(Math.ceil(uniqueDays.length / 3), 6)
  };
}

// Get workouts completed in current month
export function getWorkoutsThisMonth(workouts) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return workouts.filter(w => {
    if (!w.completed || !w.date) return false;
    const d = new Date(w.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
}

// Get workouts completed in current week (Monday - Sunday)
export function getWorkoutsThisWeek(workouts) {
  const now = new Date();
  const day = now.getDay();
  // Monday of this week
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  return workouts.filter(w => {
    if (!w.completed || !w.date) return false;
    const d = new Date(w.date);
    return d >= monday;
  });
}

// Extract progression points for a specific exercise over time
export function getExerciseHistoryProgression(exerciseId, workouts) {
  const points = [];
  const sorted = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(w => {
    if (!w.completed || !w.exercises) return;
    const found = w.exercises.find(e => e.exerciseId === exerciseId);
    if (found && found.sets) {
      const validSets = found.sets.filter(s => s.completed && !s.isWarmup && s.weight && s.reps);
      if (validSets.length > 0) {
        let maxWeight = 0;
        let best1RM = 0;
        let totalVol = 0;

        validSets.forEach(s => {
          const wgt = parseFloat(s.weight) || 0;
          const rps = parseInt(s.reps) || 0;
          if (wgt > maxWeight) maxWeight = wgt;
          const est = calculate1RM(wgt, rps);
          if (est > best1RM) best1RM = est;
          totalVol += wgt * rps;
        });

        points.push({
          date: w.date,
          dateKey: w.dateKey || w.date.split('T')[0],
          workoutName: w.name,
          maxWeight,
          estimated1RM: best1RM,
          volume: totalVol,
          setsCount: validSets.length
        });
      }
    }
  });

  return points;
}
