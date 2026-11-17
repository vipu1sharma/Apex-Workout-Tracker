export const STARTER_ROUTINES = [
  {
    id: 'routine-push-day',
    name: 'Push Day: Chest, Shoulders & Triceps',
    category: 'Hypertrophy',
    description: 'High-intensity upper body pressing prioritizing chest thickness and shoulder capped delts.',
    estimatedMinutes: 50,
    exercises: [
      {
        exerciseId: 'barbell-bench-press',
        targetSets: 4,
        targetReps: 8,
        defaultWeight: 80,
        restSeconds: 120,
        notes: '2 warm-up sets, then 4 heavy working sets'
      },
      {
        exerciseId: 'incline-dumbbell-press',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 30,
        restSeconds: 90,
        notes: 'Focus on deep clavicular stretch at bottom'
      },
      {
        exerciseId: 'seated-dumbbell-shoulder-press',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 24,
        restSeconds: 90,
        notes: 'Vertical press path, avoid arching lower back'
      },
      {
        exerciseId: 'dumbbell-lateral-raise',
        targetSets: 4,
        targetReps: 12,
        defaultWeight: 12,
        restSeconds: 60,
        notes: 'Slow 2-second eccentric drop'
      },
      {
        exerciseId: 'tricep-rope-pushdown',
        targetSets: 3,
        targetReps: 12,
        defaultWeight: 25,
        restSeconds: 60,
        notes: 'Spread ends of rope at peak contraction'
      }
    ]
  },
  {
    id: 'routine-pull-day',
    name: 'Pull Day: Back, Rear Delts & Biceps',
    category: 'Hypertrophy',
    description: 'Complete posterior chain development focusing on lat width, mid-back density, and arm flexion.',
    estimatedMinutes: 52,
    exercises: [
      {
        exerciseId: 'barbell-deadlift',
        targetSets: 3,
        targetReps: 5,
        defaultWeight: 120,
        restSeconds: 180,
        notes: 'Reset after each rep, keep bar glued to shins'
      },
      {
        exerciseId: 'lat-pulldown',
        targetSets: 4,
        targetReps: 10,
        defaultWeight: 65,
        restSeconds: 75,
        notes: 'Drive elbows down into your back pockets'
      },
      {
        exerciseId: 'barbell-bent-over-row',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 70,
        restSeconds: 90,
        notes: 'Torso locked at 45 degrees'
      },
      {
        exerciseId: 'face-pulls',
        targetSets: 3,
        targetReps: 15,
        defaultWeight: 20,
        restSeconds: 60,
        notes: 'Pinch rear delts and external rotator cuff'
      },
      {
        exerciseId: 'barbell-bicep-curl',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 35,
        restSeconds: 60,
        notes: 'No swinging, strict arm isolation'
      }
    ]
  },
  {
    id: 'routine-leg-day',
    name: 'Leg Day: Quads, Hamstrings & Calves',
    category: 'Strength',
    description: 'Relentless lower body hypertrophy focusing on deep squat power and posterior knee flexion.',
    estimatedMinutes: 55,
    exercises: [
      {
        exerciseId: 'barbell-back-squat',
        targetSets: 4,
        targetReps: 6,
        defaultWeight: 100,
        restSeconds: 150,
        notes: 'Deep depth, knees tracking over toes'
      },
      {
        exerciseId: 'romanian-deadlift',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 90,
        restSeconds: 90,
        notes: 'Push hips backward until deep hamstring stretch'
      },
      {
        exerciseId: 'leg-press',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 180,
        restSeconds: 90,
        notes: 'Full range, controlled descent'
      },
      {
        exerciseId: 'leg-curl-lying',
        targetSets: 3,
        targetReps: 12,
        defaultWeight: 45,
        restSeconds: 60,
        notes: 'Squeeze hamstrings at top for 1 full second'
      },
      {
        exerciseId: 'standing-calf-raise',
        targetSets: 4,
        targetReps: 15,
        defaultWeight: 60,
        restSeconds: 45,
        notes: '2 second pause at bottom stretch'
      }
    ]
  },
  {
    id: 'routine-upper-body',
    name: 'Upper Body Power & Hypertrophy',
    category: 'Athletic',
    description: 'Balanced upper body compound blitz hitting horizontal and vertical push/pull mechanics.',
    estimatedMinutes: 48,
    exercises: [
      {
        exerciseId: 'barbell-bench-press',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 82.5,
        restSeconds: 90,
        notes: 'Explosive drive off chest'
      },
      {
        exerciseId: 'seated-cable-row',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 60,
        restSeconds: 75,
        notes: 'Chest up, squeeze rhomboids'
      },
      {
        exerciseId: 'overhead-barbell-press',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 50,
        restSeconds: 90,
        notes: 'Brace core throughout'
      },
      {
        exerciseId: 'pull-ups',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 0,
        restSeconds: 90,
        notes: 'Bodyweight or add weight belt if possible'
      },
      {
        exerciseId: 'skull-crushers',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 30,
        restSeconds: 60,
        notes: 'Keep elbows still'
      },
      {
        exerciseId: 'dumbbell-hammer-curl',
        targetSets: 3,
        targetReps: 12,
        defaultWeight: 16,
        restSeconds: 60,
        notes: 'Slow descent, feel forearm engagement'
      }
    ]
  },
  {
    id: 'routine-lower-body',
    name: 'Lower Body & Core Stability',
    category: 'Strength',
    description: 'Unilateral quad drive paired with glute thrusts and deep core bracing.',
    estimatedMinutes: 45,
    exercises: [
      {
        exerciseId: 'barbell-hip-thrust',
        targetSets: 4,
        targetReps: 10,
        defaultWeight: 110,
        restSeconds: 90,
        notes: 'Pause at top horizontal lockout'
      },
      {
        exerciseId: 'bulgarian-split-squat',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 20,
        restSeconds: 75,
        notes: '8 reps per leg, keep balance steady'
      },
      {
        exerciseId: 'leg-extension',
        targetSets: 3,
        targetReps: 12,
        defaultWeight: 55,
        restSeconds: 60,
        notes: 'Peak quad squeeze at lockout'
      },
      {
        exerciseId: 'hanging-leg-raise',
        targetSets: 3,
        targetReps: 12,
        defaultWeight: 0,
        restSeconds: 60,
        notes: 'Tuck pelvis up toward ribs'
      },
      {
        exerciseId: 'plank',
        targetSets: 3,
        targetReps: 60,
        defaultWeight: 0,
        restSeconds: 60,
        notes: 'Hold maximum full body tension'
      }
    ]
  },
  {
    id: 'routine-full-body',
    name: 'Full Body Blitz',
    category: 'Conditioning',
    description: 'Time-efficient full-body workout for maximum metabolic output and functional strength.',
    estimatedMinutes: 42,
    exercises: [
      {
        exerciseId: 'barbell-back-squat',
        targetSets: 3,
        targetReps: 8,
        defaultWeight: 90,
        restSeconds: 120,
        notes: 'Controlled tempo'
      },
      {
        exerciseId: 'incline-dumbbell-press',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 28,
        restSeconds: 90,
        notes: 'Upper chest focus'
      },
      {
        exerciseId: 'lat-pulldown',
        targetSets: 3,
        targetReps: 10,
        defaultWeight: 65,
        restSeconds: 75,
        notes: 'Wide pronated grip'
      },
      {
        exerciseId: 'dumbbell-lateral-raise',
        targetSets: 3,
        targetReps: 12,
        defaultWeight: 12,
        restSeconds: 60,
        notes: 'Clean strict reps'
      },
      {
        exerciseId: 'kettlebell-swing',
        targetSets: 3,
        targetReps: 15,
        defaultWeight: 24,
        restSeconds: 60,
        notes: 'Explosive hip hinge snap'
      }
    ]
  }
];
