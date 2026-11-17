# APEX // Minimalist Daily Workout OS

> **Core Philosophy**: *Track your workout in seconds, not minutes. Focus on training, not your phone.*

APEX is a digital workout tracker engineered for lifters, athletes, and fitness enthusiasts who demand speed, tactile precision, and zero friction in the gym. Built as a high-end commercial digital product combining the best UX patterns from **Apple Fitness**, **Strong**, and **Notion Fitness OS**.

---

## ✨ Key Features & Architecture

### 1. ⚡ Quick Workout Tracker (Core Engine)
- **1–3 Taps Per Action**: Designed for sweaty hands and heavy sets between rests.
- **Smart Previous Set Memory**: Automatically inspects past training history to pre-fill weights and repetitions as suggestions.
- **1-Tap Direct Copy**: Tap any previous set cell (`80 kg × 8`) to instantly mirror it into your current set.
- **Tactile Stepper Controls**: Quick `-2.5` / `+2.5` kg (or `-5` / `+5` lbs) and `-1` / `+1` rep steppers eliminate tedious numeric keyboard typing.
- **1-Tap Set Completion**: Satisfying electric lime check animation with synthesized Web Audio chimes and haptic feedback.
- **Instant Set Duplication**: Tap `+ Add Set` to append the next set with weight and reps ready to go.
- **Exercise Notes & Reordering**: Move exercises up/down and attach quick setup notes (e.g., seat pin settings, elbow angle).
- **Auto-Saving Session State**: In-progress workouts are continuously mirrored to persistent storage—never lose workout data if you refresh or switch apps.

### 2. ⏱️ Intelligent Rest Timer
- **Auto-Start on Set Complete**: Automatically triggers the countdown when you check off a set.
- **Quick Presets**: 30s, 60s, 90s, 120s with fast `+15s` / `-15s` micro-adjustments.
- **Floating Minimized Pill & Expanded View**: Stays anchored at the bottom right so you can browse upcoming movements while resting.
- **Synthesized Audio Bell & Haptics**: Double-chime alert when rest expires using Web Audio API—requires zero external sound files.

### 3. 📊 Main Dashboard & Motivation HUD
- **Greeting & Live Date**: Context-aware greeting and formatted date.
- **Today's Scheduled Routine Card**: 1-click **"Start Workout"** or **"Resume Workout"** if already in progress.
- **5 Core Metrics**:
  1. **Weekly Streak**: Consecutive active workout streak.
  2. **This Month**: Workouts logged in the current calendar month.
  3. **Weekly Goal**: Target completion rate (e.g. 4/4 days • 100%).
  4. **Total Volume**: Cumulative tonnage lifted (kg or lbs).
  5. **Personal Records**: Hall of fame count of all-time bests.
- **Quick-Start Routines Carousel**: Instant launch for Push, Pull, Legs, Upper, Lower, and Full Body.
- **Previous Workout Card**: 1-tap **"Repeat Workout"** button.

### 4. 📚 Comprehensive Exercise Library
- **Categorized Movements**: Chest, Back, Shoulders, Biceps, Triceps, Legs, Glutes, Abs, Cardio, and Full Body.
- **Filter by Equipment**: Barbell, Dumbbell, Cable, Machine, Bodyweight, and Other.
- **Real-Time Instant Search**: Search by exercise name, target muscle, or category.
- **Exercise Detail Drawer**: Execution form tips, default sets/reps, recommended rest times, and personal history logs.
- **Custom Exercise Creator**: Add your own custom movements with custom categories and instructions.

### 5. 📋 Workout Routines Manager
- **Pre-Configured Starter Routines**:
  - *Push Day: Chest, Shoulders & Triceps*
  - *Pull Day: Back, Rear Delts & Biceps*
  - *Leg Day: Quads, Hamstrings & Calves*
  - *Upper Body Power & Hypertrophy*
  - *Lower Body & Core Stability*
  - *Full Body Blitz*
- **Routine Builder**: Create custom routines, reorder movements, customize target sets and rep targets.
- **1-Tap Duplicate & Edit**: Clone routines to experiment with split variations.

### 6. 📈 Visual Progress & Strength Analytics
- **Interactive SVG Strength Curve**: Select any exercise to see max weight and Brzycki estimated 1-Rep Max (`1RM = Weight × (36 / (37 - Reps))`) over time.
- **Weekly Volume Load Bar Chart**: Visualizes weekly training tonnage progression.
- **Personal Records Hall of Fame**: Displays all-time PRs for each exercise with date achieved and max weight reps.
- **Timeframe Filters**: 1 Month, 3 Months, and All-Time views.

### 7. 📅 Calendar & Workout History
- **Interactive Month Calendar**: Visual status indicators for completed training days and gold badges for PR days.
- **Day Inspector**: Tap any date to view sets, exercises, and volume from that session.
- **Searchable Log History**: Search all past workouts with expandable set-by-set breakdowns.

### 8. ⚙️ Personalization & Data Sovereignty
- **Units**: Instant toggle between `kg` and `lbs` with automatic conversion throughout the entire app.
- **Goals & Frequency**: Hypertrophy, Strength, Fat Loss, Endurance, Longevity.
- **Dark & Light Mode**: Obsidian Charcoal (`#0D0F12`) with Electric Lime (`#D4FF00`) or Warm Ivory Light Mode with Forest Emerald.
- **Export & Import JSON Backup**: Download your entire training history or restore from backup anytime.
- **Sample Data Loader**: Pre-loads 3 weeks of realistic training sessions for immediate exploration.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS with custom design tokens, dark mode class switching, and backdrop glassmorphism
- **Icons**: Lucide React
- **Audio**: Offline Synthesized Web Audio API (`AudioContext`, sine/triangle frequency ramps)
- **Haptics**: Navigator Vibration API
- **State & Storage**: Reactive LocalStorage state with export/import architecture

---

## 🚀 Getting Started

```bash
# Navigate to project directory
cd apex-workout-tracker

# Install dependencies (already installed)
npm install

# Start local development server
npm run dev

# Build for production distribution
npm run build
```

---

*Designed and engineered with pride by the Google DeepMind team.*
