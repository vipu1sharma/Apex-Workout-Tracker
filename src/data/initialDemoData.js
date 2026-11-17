// Generates a realistic set of past workouts for the last 3 weeks
// All dates are calculated relative to today so the streak and calendar are always active and dynamic!

export function generateInitialWorkouts() {
  const now = new Date();
  
  const getPastDate = (daysAgo, hour = 17, minute = 30) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const getLocalDateString = (daysAgo) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    // 1 day ago - Push Day (Recent)
    {
      id: 'workout-hist-1',
      routineId: 'routine-push-day',
      name: 'Push Day: Chest, Shoulders & Triceps',
      date: getPastDate(1, 18, 15),
      dateKey: getLocalDateString(1),
      durationSeconds: 3120, // 52 mins
      rpe: 8,
      notes: 'Hit a PR on bench press! Felt energetic throughout.',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-bench-press',
          notes: 'Felt very explosive on first 3 sets',
          sets: [
            { id: 's1', setNumber: 1, weight: 80, reps: 8, completed: true, isWarmup: false },
            { id: 's2', setNumber: 2, weight: 82.5, reps: 8, completed: true, isWarmup: false },
            { id: 's3', setNumber: 3, weight: 85, reps: 7, completed: true, isWarmup: false },
            { id: 's4', setNumber: 4, weight: 87.5, reps: 6, completed: true, isWarmup: false, isPR: true }
          ]
        },
        {
          exerciseId: 'incline-dumbbell-press',
          notes: '',
          sets: [
            { id: 's5', setNumber: 1, weight: 30, reps: 10, completed: true, isWarmup: false },
            { id: 's6', setNumber: 2, weight: 32, reps: 10, completed: true, isWarmup: false },
            { id: 's7', setNumber: 3, weight: 32, reps: 9, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'dumbbell-lateral-raise',
          notes: 'Strict form, no swinging',
          sets: [
            { id: 's8', setNumber: 1, weight: 12, reps: 14, completed: true, isWarmup: false },
            { id: 's9', setNumber: 2, weight: 12, reps: 12, completed: true, isWarmup: false },
            { id: 's10', setNumber: 3, weight: 12, reps: 12, completed: true, isWarmup: false },
            { id: 's11', setNumber: 4, weight: 14, reps: 10, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'tricep-rope-pushdown',
          notes: '',
          sets: [
            { id: 's12', setNumber: 1, weight: 25, reps: 12, completed: true, isWarmup: false },
            { id: 's13', setNumber: 2, weight: 27.5, reps: 12, completed: true, isWarmup: false },
            { id: 's14', setNumber: 3, weight: 30, reps: 10, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 2 days ago - Pull Day
    {
      id: 'workout-hist-2',
      routineId: 'routine-pull-day',
      name: 'Pull Day: Back, Rear Delts & Biceps',
      date: getPastDate(2, 17, 45),
      dateKey: getLocalDateString(2),
      durationSeconds: 3240, // 54 mins
      rpe: 9,
      notes: 'Deadlifts were heavy but smooth lockout.',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-deadlift',
          notes: 'Belted on top set',
          sets: [
            { id: 's15', setNumber: 1, weight: 100, reps: 5, completed: true, isWarmup: true },
            { id: 's16', setNumber: 2, weight: 120, reps: 5, completed: true, isWarmup: false },
            { id: 's17', setNumber: 3, weight: 130, reps: 5, completed: true, isWarmup: false },
            { id: 's18', setNumber: 4, weight: 140, reps: 5, completed: true, isWarmup: false, isPR: true }
          ]
        },
        {
          exerciseId: 'lat-pulldown',
          notes: '',
          sets: [
            { id: 's19', setNumber: 1, weight: 65, reps: 10, completed: true, isWarmup: false },
            { id: 's20', setNumber: 2, weight: 70, reps: 10, completed: true, isWarmup: false },
            { id: 's21', setNumber: 3, weight: 75, reps: 8, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'face-pulls',
          notes: '',
          sets: [
            { id: 's22', setNumber: 1, weight: 20, reps: 15, completed: true, isWarmup: false },
            { id: 's23', setNumber: 2, weight: 22.5, reps: 15, completed: true, isWarmup: false },
            { id: 's24', setNumber: 3, weight: 22.5, reps: 15, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'barbell-bicep-curl',
          notes: 'Great arm pump',
          sets: [
            { id: 's25', setNumber: 1, weight: 35, reps: 10, completed: true, isWarmup: false },
            { id: 's26', setNumber: 2, weight: 35, reps: 9, completed: true, isWarmup: false },
            { id: 's27', setNumber: 3, weight: 35, reps: 8, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 4 days ago - Leg Day
    {
      id: 'workout-hist-3',
      routineId: 'routine-leg-day',
      name: 'Leg Day: Quads, Hamstrings & Calves',
      date: getPastDate(4, 18, 0),
      dateKey: getLocalDateString(4),
      durationSeconds: 3480, // 58 mins
      rpe: 9,
      notes: 'Squats felt deep and solid.',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-back-squat',
          notes: '',
          sets: [
            { id: 's28', setNumber: 1, weight: 90, reps: 8, completed: true, isWarmup: false },
            { id: 's29', setNumber: 2, weight: 100, reps: 6, completed: true, isWarmup: false },
            { id: 's30', setNumber: 3, weight: 105, reps: 6, completed: true, isWarmup: false },
            { id: 's31', setNumber: 4, weight: 110, reps: 5, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'romanian-deadlift',
          notes: '',
          sets: [
            { id: 's32', setNumber: 1, weight: 85, reps: 8, completed: true, isWarmup: false },
            { id: 's33', setNumber: 2, weight: 90, reps: 8, completed: true, isWarmup: false },
            { id: 's34', setNumber: 3, weight: 90, reps: 8, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'leg-press',
          notes: '',
          sets: [
            { id: 's35', setNumber: 1, weight: 160, reps: 10, completed: true, isWarmup: false },
            { id: 's36', setNumber: 2, weight: 180, reps: 10, completed: true, isWarmup: false },
            { id: 's37', setNumber: 3, weight: 200, reps: 8, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'standing-calf-raise',
          notes: '',
          sets: [
            { id: 's38', setNumber: 1, weight: 60, reps: 15, completed: true, isWarmup: false },
            { id: 's39', setNumber: 2, weight: 65, reps: 14, completed: true, isWarmup: false },
            { id: 's40', setNumber: 3, weight: 70, reps: 12, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 6 days ago - Upper Body
    {
      id: 'workout-hist-4',
      routineId: 'routine-upper-body',
      name: 'Upper Body Power & Hypertrophy',
      date: getPastDate(6, 17, 30),
      dateKey: getLocalDateString(6),
      durationSeconds: 2940, // 49 mins
      rpe: 8,
      notes: 'Quick efficient session before work.',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-bench-press',
          notes: '',
          sets: [
            { id: 's41', setNumber: 1, weight: 80, reps: 8, completed: true, isWarmup: false },
            { id: 's42', setNumber: 2, weight: 80, reps: 8, completed: true, isWarmup: false },
            { id: 's43', setNumber: 3, weight: 82.5, reps: 7, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'seated-cable-row',
          notes: '',
          sets: [
            { id: 's44', setNumber: 1, weight: 60, reps: 10, completed: true, isWarmup: false },
            { id: 's45', setNumber: 2, weight: 65, reps: 10, completed: true, isWarmup: false },
            { id: 's46', setNumber: 3, weight: 65, reps: 9, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'overhead-barbell-press',
          notes: '',
          sets: [
            { id: 's47', setNumber: 1, weight: 45, reps: 8, completed: true, isWarmup: false },
            { id: 's48', setNumber: 2, weight: 50, reps: 7, completed: true, isWarmup: false },
            { id: 's49', setNumber: 3, weight: 50, reps: 6, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 8 days ago - Push Day
    {
      id: 'workout-hist-5',
      routineId: 'routine-push-day',
      name: 'Push Day: Chest, Shoulders & Triceps',
      date: getPastDate(8, 18, 30),
      dateKey: getLocalDateString(8),
      durationSeconds: 3000,
      rpe: 7,
      notes: '',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-bench-press',
          notes: '',
          sets: [
            { id: 's50', setNumber: 1, weight: 77.5, reps: 8, completed: true, isWarmup: false },
            { id: 's51', setNumber: 2, weight: 80, reps: 8, completed: true, isWarmup: false },
            { id: 's52', setNumber: 3, weight: 80, reps: 8, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'incline-dumbbell-press',
          notes: '',
          sets: [
            { id: 's53', setNumber: 1, weight: 28, reps: 10, completed: true, isWarmup: false },
            { id: 's54', setNumber: 2, weight: 30, reps: 10, completed: true, isWarmup: false },
            { id: 's55', setNumber: 3, weight: 30, reps: 8, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 10 days ago - Pull Day
    {
      id: 'workout-hist-6',
      routineId: 'routine-pull-day',
      name: 'Pull Day: Back, Rear Delts & Biceps',
      date: getPastDate(10, 18, 0),
      dateKey: getLocalDateString(10),
      durationSeconds: 3180,
      rpe: 8,
      notes: '',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-deadlift',
          notes: '',
          sets: [
            { id: 's56', setNumber: 1, weight: 110, reps: 5, completed: true, isWarmup: false },
            { id: 's57', setNumber: 2, weight: 120, reps: 5, completed: true, isWarmup: false },
            { id: 's58', setNumber: 3, weight: 130, reps: 5, completed: true, isWarmup: false }
          ]
        },
        {
          exerciseId: 'lat-pulldown',
          notes: '',
          sets: [
            { id: 's59', setNumber: 1, weight: 65, reps: 10, completed: true, isWarmup: false },
            { id: 's60', setNumber: 2, weight: 65, reps: 10, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 12 days ago - Leg Day
    {
      id: 'workout-hist-7',
      routineId: 'routine-leg-day',
      name: 'Leg Day: Quads, Hamstrings & Calves',
      date: getPastDate(12, 17, 30),
      dateKey: getLocalDateString(12),
      durationSeconds: 3300,
      rpe: 8,
      notes: 'Strong quad focus',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-back-squat',
          notes: '',
          sets: [
            { id: 's61', setNumber: 1, weight: 85, reps: 8, completed: true, isWarmup: false },
            { id: 's62', setNumber: 2, weight: 95, reps: 6, completed: true, isWarmup: false },
            { id: 's63', setNumber: 3, weight: 105, reps: 6, completed: true, isWarmup: false }
          ]
        }
      ]
    },

    // 14 days ago - Upper Body
    {
      id: 'workout-hist-8',
      routineId: 'routine-upper-body',
      name: 'Upper Body Power & Hypertrophy',
      date: getPastDate(14, 18, 15),
      dateKey: getLocalDateString(14),
      durationSeconds: 2880,
      rpe: 7,
      notes: '',
      completed: true,
      exercises: [
        {
          exerciseId: 'barbell-bench-press',
          notes: '',
          sets: [
            { id: 's64', setNumber: 1, weight: 75, reps: 8, completed: true, isWarmup: false },
            { id: 's65', setNumber: 2, weight: 77.5, reps: 8, completed: true, isWarmup: false },
            { id: 's66', setNumber: 3, weight: 80, reps: 7, completed: true, isWarmup: false }
          ]
        }
      ]
    }
  ];
}
