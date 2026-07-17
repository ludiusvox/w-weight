# W-Weight (Pyramid Lift) v2.0

A comprehensive tracking tool for scientific lifting schemes, featuring science-backed analytics and periodization tools.

## Features

### 🚀 Soviet-Style Pyramid Training
- Interactive **Double-Ladder** tracking system.
- Automated rep and intensity management based on elite training protocols.
- Integrated rest chronometer and session chronometer.

### 📈 Advanced Analytics
- **Estimated 1RM Progress:** Dynamic charts that convert submaximal working sets into estimated 1-Rep Max data using the **Epley Formula**.
- **Personal Best Tracking:** Verifiable lift logs and personal record management across multiple muscle regions.
- **Total Gain Analysis:** Real-time calculation of strength progress within selected timeframes.

### 🔬 Scientific Periodization Hub
- **Yearly Periodization Timeline:** Visual management of training phases:
  - **BASE:** Structural balance and endurance (Weeks 1-12).
  - **BUILD:** Hypertrophic density overload (Weeks 13-24).
  - **PEAK:** Maximum motor unit recruitment (Weeks 25-36).
  - **TAPER:** Fatigue management and recovery (Weeks 37-52).
- **Training Load Rules:** Built-in guidelines for goal-specific intensity (% of 1RM), reps, sets, and rest intervals.
- **Fiber Type Training Zones:** Visual mapping for Type I (Endurance), Type IIa (Hypertrophy), and Type IIx (Strength) recruitment.

### 📖 Exercise Library
- Categorized dictionary (Upper Body, Lower Body, Trunk/Core, Total Body).
- Seamless integration with the session tracker.

## Technical Setup

**Prerequisites:** Node.js, Android SDK

1. **Install dependencies:**
   `npm install`
2. **Sync with Android:**
   `npx cap sync android`
3. **Run Locally:**
   `npm run dev`

## Deployment
This repository includes:
- **`w-weight-debug.apk`**: Latest Android debug build.
- **`w-weight-release.aab`**: Android App Bundle for store deployment.

---
*Created by Ludiusvox*
