import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import ActiveWorkout from './components/ActiveWorkout';
import ExerciseLibrary from './components/ExerciseLibrary';
import RoutinesManager from './components/RoutinesManager';
import ProgressView from './components/ProgressView';
import CalendarHistory from './components/CalendarHistory';
import RestTimer from './components/RestTimer';
import WorkoutSummaryModal from './components/WorkoutSummaryModal';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';

import { 
  loadWorkouts, 
  saveWorkouts, 
  loadRoutines, 
  saveRoutines, 
  loadExercises, 
  saveExercises, 
  loadActiveWorkout, 
  saveActiveWorkout, 
  loadSettings, 
  saveSettings,
  hasUserOnboarded,
  setOnboarded
} from './utils/storage';
import { 
  calculateStreak, 
  calculateWorkoutVolume, 
  calculateTotalSets, 
  calculateTotalReps,
  detectNewPRsInWorkout, 
  getPreviousExerciseData 
} from './utils/analytics';
import { playPRSound } from './utils/sound';

export default function App() {
  // Core persistent states
  const [workouts, setWorkouts] = useState(() => loadWorkouts());
  const [routines, setRoutines] = useState(() => loadRoutines());
  const [exercises, setExercises] = useState(() => loadExercises());
  const [activeWorkout, setActiveWorkout] = useState(() => loadActiveWorkout());
  const [settings, setSettings] = useState(() => loadSettings());

  // Navigation tab
  const [activeTab, setActiveTab] = useState(activeWorkout ? 'workout' : 'dashboard');

  // Modals & Timers
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => !hasUserOnboarded());
  const [summaryData, setSummaryData] = useState(null);

  // Global Rest Timer state
  const [timerState, setTimerState] = useState({
    duration: settings.timerDefault || 90,
    remaining: settings.timerDefault || 90,
    isRunning: false,
    isVisible: false
  });

  // Sync settings with html theme
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [settings.theme]);

  // Persist workouts
  useEffect(() => {
    saveWorkouts(workouts);
  }, [workouts]);

  // Persist routines
  useEffect(() => {
    saveRoutines(routines);
  }, [routines]);

  // Persist exercises
  useEffect(() => {
    saveExercises(exercises);
  }, [exercises]);

  // Persist active workout
  useEffect(() => {
    saveActiveWorkout(activeWorkout);
  }, [activeWorkout]);

  // Update Settings helper
  const handleUpdateSettings = (updates) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    saveSettings(updated);
  };

  // Reload all data after import or reset
  const handleReloadAllData = () => {
    setWorkouts(loadWorkouts());
    setRoutines(loadRoutines());
    setExercises(loadExercises());
    setActiveWorkout(loadActiveWorkout());
    setSettings(loadSettings());
  };

  // Start a structured routine
  const handleStartRoutine = (routine) => {
    const sessionExercises = routine.exercises.map((rEx) => {
      // Find previous history for suggested weights
      const prevData = getPreviousExerciseData(rEx.exerciseId, workouts);
      const exDetail = exercises.find(e => e.id === rEx.exerciseId);

      const targetSetsCount = rEx.targetSets || 3;
      const sets = [];

      for (let i = 1; i <= targetSetsCount; i++) {
        let weight = rEx.defaultWeight || 0;
        let reps = rEx.targetReps || 10;

        if (prevData && prevData.sets && prevData.sets[i - 1]) {
          weight = prevData.sets[i - 1].weight;
          reps = prevData.sets[i - 1].reps;
        }

        sets.push({
          id: `set-${Date.now()}-${i}`,
          setNumber: i,
          weight,
          reps,
          completed: false,
          isWarmup: false
        });
      }

      return {
        exerciseId: rEx.exerciseId,
        notes: rEx.notes || '',
        sets
      };
    });

    const newActive = {
      id: `workout-${Date.now()}`,
      routineId: routine.id,
      name: routine.name,
      startTime: new Date().toISOString(),
      exercises: sessionExercises
    };

    setActiveWorkout(newActive);
    setActiveTab('workout');
  };

  // Start an empty workout
  const handleStartBlank = () => {
    const newActive = {
      id: `workout-${Date.now()}`,
      name: 'Freestyle Workout',
      startTime: new Date().toISOString(),
      exercises: []
    };
    setActiveWorkout(newActive);
    setActiveTab('workout');
  };

  // Trigger Finish Workout flow
  const handleFinishWorkout = (elapsedSeconds) => {
    if (!activeWorkout) return;

    const completedSetsCount = calculateTotalSets(activeWorkout);
    const totalRepsCount = calculateTotalReps(activeWorkout);
    const volumeKg = calculateWorkoutVolume(activeWorkout);

    // Detect new PRs hit during this session
    const newPRs = detectNewPRsInWorkout(activeWorkout, workouts);

    setSummaryData({
      name: activeWorkout.name,
      durationSeconds: elapsedSeconds || 1800,
      exercisesCompletedCount: activeWorkout.exercises.length,
      totalSets: completedSetsCount,
      totalReps: totalRepsCount,
      totalVolumeKg: volumeKg,
      newPRs,
      activeSession: activeWorkout
    });
  };

  // Commit workout to history
  const handleSaveSummary = ({ rpe, notes }) => {
    if (!summaryData) return;

    const now = new Date();
    const finalWorkout = {
      ...summaryData.activeSession,
      completed: true,
      date: now.toISOString(),
      dateKey: now.toISOString().split('T')[0],
      durationSeconds: summaryData.durationSeconds,
      rpe,
      notes: notes || '',
      volumeKg: summaryData.totalVolumeKg
    };

    const updatedWorkouts = [finalWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    setActiveWorkout(null);
    setSummaryData(null);
    // Switch to history view so user can appreciate their logged session
    setActiveTab('calendar');
  };

  // Cancel in-progress workout
  const handleCancelWorkout = () => {
    if (window.confirm('Discard active workout? Logged sets will not be saved.')) {
      setActiveWorkout(null);
      setActiveTab('dashboard');
    }
  };

  const streak = calculateStreak(workouts);

  return (
    <div className="min-h-screen bg-[#0D0F12] dark:bg-[#0D0F12] light:bg-[#F8F9FA] text-gray-100 dark:text-gray-100 light:text-gray-900 transition-colors flex flex-col font-sans">
      
      {/* Top Brand Navbar */}
      <Navbar
        activeWorkout={activeWorkout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={handleUpdateSettings}
        onOpenSettings={() => setSettingsOpen(true)}
        streak={streak}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            workouts={workouts}
            routines={routines}
            activeWorkout={activeWorkout}
            onStartRoutine={handleStartRoutine}
            onStartBlank={handleStartBlank}
            setActiveTab={setActiveTab}
            settings={settings}
          />
        )}

        {activeTab === 'workout' && (
          <ActiveWorkout
            activeWorkout={activeWorkout}
            setActiveWorkout={setActiveWorkout}
            workoutHistory={workouts}
            exercisesLibrary={exercises}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            settings={settings}
            setTimerState={setTimerState}
            onOpenRoutinePicker={() => setActiveTab('routines')}
          />
        )}

        {activeTab === 'routines' && (
          <RoutinesManager
            routines={routines}
            setRoutines={setRoutines}
            exercisesLibrary={exercises}
            onStartRoutine={handleStartRoutine}
            settings={settings}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibrary
            exercises={exercises}
            setExercises={setExercises}
            workoutHistory={workouts}
            settings={settings}
            onStartExercise={(ex) => {
              // Could start a single exercise or inspect
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            workouts={workouts}
            exercisesLibrary={exercises}
            settings={settings}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarHistory
            workouts={workouts}
            setWorkouts={setWorkouts}
            exercisesLibrary={exercises}
            settings={settings}
          />
        )}
      </main>

      {/* Floating Rest Timer (Persists across all tabs) */}
      <RestTimer
        timerState={timerState}
        setTimerState={setTimerState}
        soundEnabled={settings.soundEnabled}
        hapticsEnabled={settings.hapticsEnabled}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeWorkout={activeWorkout}
      />

      {/* Post-Workout Summary & Celebration Modal */}
      {summaryData && (
        <WorkoutSummaryModal
          summaryData={summaryData}
          onSave={handleSaveSummary}
          onDiscard={() => setSummaryData(null)}
          settings={settings}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        updateSettings={handleUpdateSettings}
        onDataReload={handleReloadAllData}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onComplete={() => {
          setOnboarded(true);
          setOnboardingOpen(false);
        }}
        settings={settings}
        updateSettings={handleUpdateSettings}
        routines={routines}
        onStartRoutine={handleStartRoutine}
      />

    </div>
  );
}
