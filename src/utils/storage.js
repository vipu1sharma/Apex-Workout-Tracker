import { DEFAULT_EXERCISES } from '../data/exerciseLibrary';
import { STARTER_ROUTINES } from '../data/starterRoutines';
import { generateInitialWorkouts } from '../data/initialDemoData';

const KEYS = {
  WORKOUTS: 'apex_workout_history_v1',
  ROUTINES: 'apex_routines_v1',
  EXERCISES: 'apex_exercises_v1',
  ACTIVE_WORKOUT: 'apex_active_session_v1',
  SETTINGS: 'apex_user_settings_v1',
  ONBOARDED: 'apex_has_onboarded_v1'
};

export const DEFAULT_SETTINGS = {
  name: 'Alex',
  goal: 'Hypertrophy & Strength',
  experience: 'Intermediate',
  unit: 'kg', // 'kg' or 'lbs'
  daysPerWeek: 4,
  timerDefault: 90, // seconds
  autoStartTimer: true,
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'dark' // 'dark' or 'light'
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

export function loadWorkouts() {
  try {
    const raw = localStorage.getItem(KEYS.WORKOUTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load workouts from localStorage', e);
  }
  // Initialize with realistic demo workouts if empty
  const initial = generateInitialWorkouts();
  saveWorkouts(initial);
  return initial;
}

export function saveWorkouts(workouts) {
  try {
    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (e) {
    console.warn('Failed to save workouts', e);
  }
}

export function loadRoutines() {
  try {
    const raw = localStorage.getItem(KEYS.ROUTINES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load routines from localStorage', e);
  }
  // Initialize with starter routines
  saveRoutines(STARTER_ROUTINES);
  return STARTER_ROUTINES;
}

export function saveRoutines(routines) {
  try {
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  } catch (e) {
    console.warn('Failed to save routines', e);
  }
}

export function loadExercises() {
  try {
    const raw = localStorage.getItem(KEYS.EXERCISES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load exercises from localStorage', e);
  }
  // Initialize with default library
  saveExercises(DEFAULT_EXERCISES);
  return DEFAULT_EXERCISES;
}

export function saveExercises(exercises) {
  try {
    localStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
  } catch (e) {
    console.warn('Failed to save exercises', e);
  }
}

export function loadActiveWorkout() {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_WORKOUT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load active workout', e);
  }
  return null;
}

export function saveActiveWorkout(active) {
  try {
    if (!active) {
      localStorage.removeItem(KEYS.ACTIVE_WORKOUT);
    } else {
      localStorage.setItem(KEYS.ACTIVE_WORKOUT, JSON.stringify(active));
    }
  } catch (e) {
    console.warn('Failed to save active workout', e);
  }
}

export function hasUserOnboarded() {
  try {
    return localStorage.getItem(KEYS.ONBOARDED) === 'true';
  } catch (e) {
    return false;
  }
}

export function setOnboarded(val = true) {
  try {
    localStorage.setItem(KEYS.ONBOARDED, val ? 'true' : 'false');
  } catch (e) {
    // Ignore
  }
}

export function exportAllData() {
  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    settings: loadSettings(),
    workouts: loadWorkouts(),
    routines: loadRoutines(),
    exercises: loadExercises()
  };
}

export function importAllData(importedData) {
  if (!importedData || typeof importedData !== 'object') {
    throw new Error('Invalid JSON backup file');
  }
  if (importedData.settings) saveSettings(importedData.settings);
  if (Array.isArray(importedData.workouts)) saveWorkouts(importedData.workouts);
  if (Array.isArray(importedData.routines)) saveRoutines(importedData.routines);
  if (Array.isArray(importedData.exercises)) saveExercises(importedData.exercises);
  return true;
}

export function resetAllDataToDefault() {
  try {
    localStorage.removeItem(KEYS.ACTIVE_WORKOUT);
    const demo = generateInitialWorkouts();
    saveWorkouts(demo);
    saveRoutines(STARTER_ROUTINES);
    saveExercises(DEFAULT_EXERCISES);
    saveSettings(DEFAULT_SETTINGS);
    return true;
  } catch (e) {
    console.error('Reset failed', e);
    return false;
  }
}
