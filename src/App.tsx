import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Dumbbell, 
  TrendingUp, 
  Sliders, 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Plus, 
  Minus, 
  RotateCcw, 
  Award, 
  CheckCircle, 
  Sparkles,
  Info,
  CalendarDays,
  Target,
  ChevronRight,
  Settings,
  X,
  Timer,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, ExercisePB, GoalPreset, GoalPresetId, SetLog } from './types';
import { 
  EXERCISE_DICTIONARY, 
  GOAL_PRESETS, 
  INITIAL_PBS, 
  MUSCLE_REGIONS_HISTORY, 
  TRAINING_RULES, 
  ANNUAl_PHASES 
} from './exercisesData';

const REGION_EXERCISES: Record<string, string[]> = {
  Hamstrings: [
    'Romanian deadlift / Conventional deadlift',
    'Seated leg curl / Lying leg curl',
    'Kettlebell swings'
  ],
  Gluteus: [
    'Glute bridges / Hip thrusts',
    'Lunges / Split squats'
  ],
  Quads: [
    'Back squat / Front squat',
    'Leg press / Hack squat',
    'Leg extensions',
    'Lunges / Split squats'
  ],
  Calf: [
    'Calf raises (seated/standing)'
  ],
  Hip: [
    'Glute bridges / Hip thrusts',
    'Lunges / Split squats'
  ],
  Groin: [
    'Lunges / Split squats'
  ],
  Chest: [
    'Bench and chest press + variations',
    'Incline/decline press + variations',
    'Flys + variations',
    'Dip',
    'Push-up'
  ],
  Shoulder: [
    'Shoulder press + variations',
    'Dumbbell thrusters'
  ],
  Back: [
    'Bent-over row + variations',
    'Lat pulldown + variations',
    'Pull-up/chin-up',
    'Clean and jerk',
    'Barbell snatch',
    'Power cleans'
  ]
};

const mapExerciseToRegion = (exerciseId: string): string => {
  const lower = exerciseId.toLowerCase();
  
  if (lower.includes('deadlift') || lower.includes('curl') || lower.includes('hamstrings')) {
    return 'Hamstrings';
  }
  if (lower.includes('bridge') || lower.includes('thrust') || lower.includes('gluteus') || lower.includes('glute')) {
    return 'Gluteus';
  }
  if (lower.includes('squat') || lower.includes('extensions') || lower.includes('leg press') || lower.includes('hack squat') || lower.includes('quads')) {
    return 'Quads';
  }
  if (lower.includes('calf') || lower.includes('calves')) {
    return 'Calf';
  }
  if (lower.includes('hip') || lower.includes('abductor') || lower.includes('kettlebell swings')) {
    return 'Hip';
  }
  if (lower.includes('groin') || lower.includes('adductor')) {
    return 'Groin';
  }
  if (lower.includes('bench') || lower.includes('chest') || lower.includes('fly') || lower.includes('pec') || lower.includes('push-up') || lower.includes('dip')) {
    return 'Chest';
  }
  if (lower.includes('shoulder') || lower.includes('overhead') || lower.includes('deltoid') || lower.includes('press')) {
    return 'Shoulder';
  }
  
  return 'Back'; // default back row / pulldown
};

export default function App() {
  // --- Responsive Setup & UI states ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracker');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // --- Persistent Storage/State ---
  // Workout tracker state
  const [weightValue, setWeightValue] = useState<number>(16);
  const [repsValue, setRepsValue] = useState<number>(1);
  const [selectedExerciseTracker, setSelectedExerciseTracker] = useState<string>('Bench and chest press + variations');
  const [completedReps, setCompletedReps] = useState<number>(5);
  const [totalRepsTarget, setTotalRepsTarget] = useState<number>(57);
  const [activePreset, setActivePreset] = useState<GoalPreset>(GOAL_PRESETS[1]); // Preset default (Hypertrophy)
  const [trackerHistory, setTrackerHistory] = useState<SetLog[]>([]);

  // Weekly progression state for trackers
  const [workoutWeightHistory, setWorkoutWeightHistory] = useState<number[]>([68, 92, 110, 130, 155]);

  // 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState<string>('250');
  const [calcReps, setCalcReps] = useState<string>('8');
  const [estimated1RM, setEstimated1RM] = useState<number>(316);

  // Custom Pyramid Session scheme state
  const [stepUpIncrement, setStepUpIncrement] = useState<number>(5);
  const [stepDownIncrement, setStepDownIncrement] = useState<number>(10);
  const [stepUpByPercent, setStepUpByPercent] = useState<boolean>(false);
  const [stepDownByPercent, setStepDownByPercent] = useState<boolean>(false);
  const [restTimerSec, setRestTimerSec] = useState<number>(60);
  const [repIncrementToggle1, setRepIncrementToggle1] = useState<boolean>(true);
  const [repIncrementToggle2, setRepIncrementToggle2] = useState<boolean>(true);

  // Analytics states
  const [activeMuscleRegion, setActiveMuscleRegion] = useState<string>('Hamstrings');
  const [personalBests, setPersonalBests] = useState<ExercisePB[]>(INITIAL_PBS);
  const [analyticsHistoryFilter, setAnalyticsHistoryFilter] = useState<string>('1 Month');

  // Day 1 Startup and 1RM Calibration states
  const [calibratorExercise, setCalibratorExercise] = useState<string>('');
  const [calibratorMethod, setCalibratorMethod] = useState<'direct' | 'estimated'>('estimated');
  const [calibratorWeight, setCalibratorWeight] = useState<number>(135);
  const [calibratorReps, setCalibratorReps] = useState<number>(5);
  const [calibratorWeek, setCalibratorWeek] = useState<number>(1);
  const [calibratorDate, setCalibratorDate] = useState<string>(
    new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [calibratorUserCollapsed, setCalibratorUserCollapsed] = useState<boolean | null>(null);

  // Quick Log form states for Stats tab
  const [statsLogWeight, setStatsLogWeight] = useState<number>(135);
  const [statsLogReps, setStatsLogReps] = useState<number>(8);
  const [statsLogExercise, setStatsLogExercise] = useState<string>('');

  // Update statsLogExercise whenever activeMuscleRegion changes
  useEffect(() => {
    const exercisesForRegion = REGION_EXERCISES[activeMuscleRegion] || [];
    if (exercisesForRegion.length > 0) {
      setStatsLogExercise(exercisesForRegion[0]);
      setCalibratorExercise(exercisesForRegion[0]);
    }
  }, [activeMuscleRegion]);

  const computedStartup1RM = calibratorMethod === 'direct'
    ? calibratorWeight
    : Math.round(calibratorWeight * (1 + 0.0333 * calibratorReps));

  // Regional calibration progress helpers
  const activeRegionExercises = REGION_EXERCISES[activeMuscleRegion] || [];
  const completedRegionPbs = activeRegionExercises.filter(ex =>
    personalBests.some(pb => pb.variation.toLowerCase() === ex.toLowerCase() || pb.name.toLowerCase() === ex.toLowerCase())
  );
  const isRegionFullyCalibrated = activeRegionExercises.length > 0 && completedRegionPbs.length === activeRegionExercises.length;
  // If user hasn't toggled manually, auto-collapse if all exercises in the active region are calibrated
  const isCalibratorCollapsed = calibratorUserCollapsed !== null ? calibratorUserCollapsed : isRegionFullyCalibrated;

  // Find matching calibrated 1RM from stats page baseline for the currently selected target exercise
  const currentTrackerCalibratedPB = personalBests.find(pb => 
    pb.variation.toLowerCase() === selectedExerciseTracker.toLowerCase() ||
    pb.name.toLowerCase() === selectedExerciseTracker.toLowerCase() ||
    selectedExerciseTracker.toLowerCase().includes(pb.name.toLowerCase())
  );
  const currentCalibrated1RM = currentTrackerCalibratedPB ? currentTrackerCalibratedPB.weight : null;

  // Robust parser function for log dates
  const parseLogDate = (timestampStr: string): Date => {
    if (!timestampStr) return new Date();

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    // Try to match Month and Day first (e.g., "Jun 10", "June 10")
    const monthMatch = timestampStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d+)/i);
    
    if (monthMatch) {
      const monthStr = monthMatch[1].toLowerCase();
      const monthIdx = months.indexOf(monthStr);
      const day = parseInt(monthMatch[2], 10);
      
      // Look for a 4-digit year in the string, like "2026"
      const yearMatch = timestampStr.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

      // Look for hours and minutes: e.g. "09:05 PM" or "12:00 PM"
      let hours = 12;
      let minutes = 0;
      const timeMatch = timestampStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hours < 12) {
            hours += 12;
          } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
          }
        }
      }

      const parsedDate = new Date(year, monthIdx, day, hours, minutes, 0, 0);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // Fallback to native parsing
    const d = new Date(timestampStr);
    if (!isNaN(d.getTime())) return d;

    return new Date();
  };

  const filterLogsByTimeframe = (logs: SetLog[], filter: string): SetLog[] => {
    const now = new Date();
    return logs.filter(log => {
      const logDate = parseLogDate(log.timestamp || '');
      const diffMs = now.getTime() - logDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (filter === '1 Week') {
        return diffDays <= 7;
      } else if (filter === '1 Month') {
        return diffDays <= 30;
      }
      return true;
    });
  };

  // Dynamic graph data resolver using real trackerHistory
  const getGraphDataForRegion = (region: string): number[] => {
    let relevantLogs = trackerHistory.filter(log => {
      const logRegion = mapExerciseToRegion(log.exerciseId);
      return logRegion.toLowerCase() === region.toLowerCase();
    });

    relevantLogs = filterLogsByTimeframe(relevantLogs, analyticsHistoryFilter);

    // Capture weights from relevant logs (chronologically, oldest to newest)
    return relevantLogs.slice().reverse().map(l => l.weight);
  };

  const getGraphLabelsForRegion = (region: string): string[] => {
    let relevantLogs = trackerHistory.filter(log => {
      const logRegion = mapExerciseToRegion(log.exerciseId);
      return logRegion.toLowerCase() === region.toLowerCase();
    });

    relevantLogs = filterLogsByTimeframe(relevantLogs, analyticsHistoryFilter);

    const userLogs = relevantLogs.slice().reverse();
    return userLogs.map(l => {
      const rawTimestamp = l.timestamp || '';
      const parts = rawTimestamp.split(' ');
      const dateStr = parts.length > 3 ? `${parts[2]} ${parts[3]}` : rawTimestamp;
      return dateStr.trim();
    });
  };

  const handleStatsQuickLog = (e: FormEvent) => {
    e.preventDefault();
    if (!statsLogExercise) {
      triggerToast("Please select an exercise to log!");
      return;
    }
    
    // Log the set!
    const newLog: SetLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      exerciseId: statsLogExercise,
      weight: statsLogWeight,
      reps: statsLogReps,
      intensityPercent: Math.round((statsLogWeight / estimated1RM) * 100) || 75
    };

    const updatedLogs = [newLog, ...trackerHistory];
    setTrackerHistory(updatedLogs);
    localStorage.setItem('pyramid_logs', JSON.stringify(updatedLogs));

    // Also update personal best if applicable
    const exerciseNameShort = statsLogExercise.split(' + ')[0];
    const matchingPb = personalBests.find(pb => pb.name.toLowerCase() === statsLogExercise.toLowerCase() || statsLogExercise.includes(pb.name));
    if (!matchingPb || statsLogWeight > matchingPb.weight) {
      const newPb: ExercisePB = {
        exerciseId: matchingPb?.exerciseId || `pb_${Math.random().toString(36).substring(2, 7)}`,
        name: exerciseNameShort,
        category: 'Muscle Class',
        weight: statsLogWeight,
        variation: statsLogExercise,
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      };
      const updatedPbs = personalBests.map(pb => pb.exerciseId === newPb.exerciseId ? newPb : pb);
      if (!personalBests.some(pb => pb.exerciseId === newPb.exerciseId)) {
        updatedPbs.push(newPb);
      }
      setPersonalBests(updatedPbs);
      localStorage.setItem('pyramid_pbs', JSON.stringify(updatedPbs));
      triggerToast(`🏆 New Personal Best logged in ${activeMuscleRegion}: ${statsLogWeight} lbs!`);
    } else {
      triggerToast(`Logged set to ${activeMuscleRegion}: ${statsLogWeight} lbs × ${statsLogReps} reps!`);
    }
  };

  const handleSaveStartupBaseline = (e: FormEvent) => {
    e.preventDefault();
    if (!calibratorExercise) {
      triggerToast("Please select an exercise to calibrate!");
      return;
    }

    const calculated1RM = calibratorMethod === 'direct'
      ? calibratorWeight
      : Math.round(calibratorWeight * (1 + 0.0333 * calibratorReps));

    if (calculated1RM <= 0) {
      triggerToast("Please enter a valid weight!");
      return;
    }

    // Create a new Personal Best item
    const exerciseNameShort = calibratorExercise.split(' + ')[0];
    const newPb: ExercisePB = {
      exerciseId: `pb_${Math.random().toString(36).substring(2, 9)}`,
      name: exerciseNameShort,
      category: activeMuscleRegion,
      weight: calculated1RM,
      variation: calibratorExercise,
      date: calibratorDate || new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Update personal bests array. Overwrite if there's already an exact match in variation
    const filteredPbs = personalBests.filter(pb => pb.variation.toLowerCase() !== calibratorExercise.toLowerCase());
    const updatedPbs = [newPb, ...filteredPbs];
    setPersonalBests(updatedPbs);
    localStorage.setItem('pyramid_pbs', JSON.stringify(updatedPbs));

    // Also populate a historical starting log entry so the dynamic progress graphs/charts show it!
    const newLog: SetLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: '12:00 PM ' + (calibratorDate ? (calibratorDate.includes(',') ? calibratorDate.split(',')[0] : calibratorDate) : new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })),
      exerciseId: calibratorExercise,
      weight: calculated1RM,
      reps: calibratorMethod === 'direct' ? 1 : calibratorReps,
      intensityPercent: 100,
      rungIndex: 0,
      stopwatchTimeStr: "00:00.00"
    };

    const updatedLogs = [newLog, ...trackerHistory];
    setTrackerHistory(updatedLogs);
    localStorage.setItem('pyramid_logs', JSON.stringify(updatedLogs));

    // Update 1RM state to align the session calculators instantly!
    setEstimated1RM(calculated1RM);
    setCalcWeight(calculated1RM.toString());
    setCalcReps("1");

    triggerToast(`🚀 Week ${calibratorWeek} Baseline of ${calculated1RM} lbs registered as Personal Best!`);
  };

  // Exercise Dictionary search
  const [dictionarySearch, setDictionarySearch] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Upper Body': true,
    'Lower Body': false,
    'Trunk or Core': false,
    'Total Body': false,
  });

  // Yearly Periodization State
  const [periodizationWeek, setPeriodizationWeek] = useState<number>(14);

  // --- Stopwatch & Rest Countdown States ---
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [activeRungIndex, setActiveRungIndex] = useState<number>(0);

  const [restCountdown, setRestCountdown] = useState<number>(0);
  const [isRestActive, setIsRestActive] = useState<boolean>(false);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [exerciseProgressMap, setExerciseProgressMap] = useState<Record<string, { completedReps: number, activeRungIndex: number }>>({});

  const updateExerciseProgress = (exName: string, newReps: number, newRung: number) => {
    setCompletedReps(newReps);
    setActiveRungIndex(newRung);
    setExerciseProgressMap(prev => {
      const updated = {
        ...prev,
        [exName]: { completedReps: newReps, activeRungIndex: newRung }
      };
      localStorage.setItem('pyramid_exercise_progress', JSON.stringify(updated));
      return updated;
    });
  };

  // Load specialized tracking progress for the selected exercise whenever it changes
  useEffect(() => {
    const savedMapStr = localStorage.getItem('pyramid_exercise_progress');
    if (savedMapStr) {
      try {
        const parsed = JSON.parse(savedMapStr);
        setExerciseProgressMap(parsed);
        if (parsed[selectedExerciseTracker] !== undefined) {
          setCompletedReps(parsed[selectedExerciseTracker].completedReps);
          setActiveRungIndex(parsed[selectedExerciseTracker].activeRungIndex);
          return;
        }
      } catch (e) {
        console.error("Error parsing exercise map on select", e);
      }
    }
    // Default to 0 reps and first rung if not calibrated/logged yet
    setCompletedReps(0);
    setActiveRungIndex(0);
  }, [selectedExerciseTracker]);

  // --- Stopwatch functions ---
  const startStopwatch = () => {
    if (!isStopwatchRunning) {
      setIsStopwatchRunning(true);
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
  };

  const pauseStopwatch = () => {
    if (isStopwatchRunning) {
      setIsStopwatchRunning(false);
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
    }
  };

  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
    setStopwatchTime(0);
  };

  const formatStopwatchTime = (timeMs: number) => {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    const centis = Math.floor((timeMs % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  // --- Rest countdown functions ---
  const startRestCountdown = (sec: number) => {
    setIsRestActive(true);
    setRestCountdown(sec);
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
    }
    restIntervalRef.current = setInterval(() => {
      setRestCountdown(prev => {
        if (prev <= 1) {
          setIsRestActive(false);
          if (restIntervalRef.current) {
            clearInterval(restIntervalRef.current);
          }
          triggerToast("🔔 Rest interval complete! Lift next rung!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelRestCountdown = () => {
    setIsRestActive(false);
    setRestCountdown(0);
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
    }
  };

  // Cleanups on unmount
  useEffect(() => {
    return () => {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, []);

  // Sync active rung info with inputs automatically
  useEffect(() => {
    if (activePreset && activePreset.repsScheme && activePreset.repsScheme[activeRungIndex]) {
      setRepsValue(activePreset.repsScheme[activeRungIndex].reps);
      const intensity = activePreset.repsScheme[activeRungIndex].intensity;
      const refRM = currentCalibrated1RM || estimated1RM;
      const suggestW = Math.round((refRM * intensity) / 100);
      if (suggestW > 0) {
        setWeightValue(suggestW);
      }
    }
  }, [activeRungIndex, activePreset, estimated1RM, currentCalibrated1RM]);

  // --- Load localStorage on Init ---
  useEffect(() => {
    const savedLogs = localStorage.getItem('pyramid_logs');
    if (savedLogs) {
      try {
        setTrackerHistory(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs from local storage", e);
      }
    }

    const savedPbs = localStorage.getItem('pyramid_pbs');
    if (savedPbs) {
      try {
        setPersonalBests(JSON.parse(savedPbs));
      } catch (e) {
        console.error("Failed to parse pbs from local storage", e);
      }
    }
  }, []);

  // --- Helper: toast trigger ---
  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  // --- 1RM Calculator logic ---
  const handleCalculate1RM = () => {
    const w = parseFloat(calcWeight);
    const r = parseInt(calcReps);
    if (!isNaN(w) && !isNaN(r) && r > 0) {
      // Epley Formula: 1RM = w * (1 + 0.0333 * r)
      const calculated = Math.round(w * (1 + 0.0333 * r));
      setEstimated1RM(calculated);
      triggerToast(`Calculated Estimated 1RM: ${calculated} lbs`);
    } else {
      triggerToast("Please enter valid positive weight and reps numbers.");
    }
  };

  // --- Setup Quick Presets and Goal Configuration ---
  const handleApplyPreset = (preset: GoalPreset) => {
    setActivePreset(preset);
    // Auto populate total reps target based on sum of the scheme
    const sumReps = preset.repsScheme.reduce((total, s) => total + s.reps, 0);
    setTotalRepsTarget(sumReps);
    updateExerciseProgress(selectedExerciseTracker, 0, 0);
    resetStopwatch();
    cancelRestCountdown();
    
    // Recalculate target loads in progressive history using preset intensity %
    // Let's assume a baseline 1RM of 220 lbs for tracker's dynamic progression values
    const generatedWeights = preset.repsScheme.map(item => 
      Math.round((220 * item.intensity) / 100)
    );
    setWorkoutWeightHistory(generatedWeights);
    
    triggerToast(`Applied ${preset.name} (${preset.transliteration}) pattern to session!`);
    setIsGoalModalOpen(false);
  };

  // --- Active Tracker: Increment/Decrement Controls ---
  const modifyWeight = (amount: number) => {
    setWeightValue(prev => Math.max(0, prev + amount));
  };

  const modifyReps = (amount: number) => {
    setRepsValue(prev => Math.max(1, prev + amount));
  };

  // --- Logging Active Set ---
  const handleLogActiveSet = () => {
    const newLog: SetLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      exerciseId: selectedExerciseTracker,
      weight: weightValue,
      reps: repsValue,
      intensityPercent: Math.round((weightValue / estimated1RM) * 100) || 75,
      rungIndex: activeRungIndex,
      stopwatchTimeStr: formatStopwatchTime(stopwatchTime)
    };

    const updatedLogs = [newLog, ...trackerHistory];
    setTrackerHistory(updatedLogs);
    localStorage.setItem('pyramid_logs', JSON.stringify(updatedLogs));

    // Dynamic progression tracking
    const nextReps = Math.min(totalRepsTarget, completedReps + repsValue);

    // Advance to next rung
    const nextRung = activeRungIndex + 1;
    let isFinishedPreset = false;
    let finalRung = activeRungIndex;
    if (activePreset && activePreset.repsScheme && nextRung < activePreset.repsScheme.length) {
      finalRung = nextRung;
      // Auto trigger minimal/recommended rest (e.g. 30-60 sec)
      startRestCountdown(restTimerSec);
    } else if (activePreset && activePreset.repsScheme && nextRung >= activePreset.repsScheme.length) {
      isFinishedPreset = true;
      pauseStopwatch();
      finalRung = activeRungIndex;
    }

    updateExerciseProgress(selectedExerciseTracker, nextReps, finalRung);

    // Update PB if logged set is higher than any stored PB for this exercise type
    const matchingPb = personalBests.find(pb => pb.name.toLowerCase() === selectedExerciseTracker.toLowerCase() || selectedExerciseTracker.includes(pb.name));
    if (!matchingPb || weightValue > matchingPb.weight) {
      const newPb: ExercisePB = {
        exerciseId: matchingPb?.exerciseId || 'custom_lift',
        name: selectedExerciseTracker.split(' + ')[0],
        category: 'Muscle Class',
        weight: weightValue,
        variation: selectedExerciseTracker,
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      };
      const updatedPbs = personalBests.map(pb => pb.exerciseId === newPb.exerciseId ? newPb : pb);
      if (!personalBests.some(pb => pb.exerciseId === newPb.exerciseId)) {
        updatedPbs.push(newPb);
      }
      setPersonalBests(updatedPbs);
      localStorage.setItem('pyramid_pbs', JSON.stringify(updatedPbs));
      
      if (isFinishedPreset) {
        triggerToast(`🏆 SUCCESS! Completed the elite "${activePreset.name}" Double-Ladder sequence! Also a new Personal Best: ${weightValue} lbs!`);
      } else {
        triggerToast(`🏆 New Personal Best! Logged ${weightValue} lbs for ${newPb.name}!`);
      }
    } else {
      if (isFinishedPreset) {
        triggerToast(`🏆 SUCCESS! Completed the elite "${activePreset.name}" Double-Ladder sequence in ${formatStopwatchTime(stopwatchTime)}!`);
      } else {
        triggerToast(`Set logged successfully: ${weightValue} lbs × ${repsValue} reps!`);
      }
    }
  };

  // --- Dictionary category expansion ---
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Filter exercises
  const filteredDictionary = EXERCISE_DICTIONARY.map(cat => {
    const filtered = cat.exercises.filter(ex => 
      ex.toLowerCase().includes(dictionarySearch.toLowerCase())
    );
    return { ...cat, exercises: filtered };
  }).filter(cat => cat.exercises.length > 0);

  // --- Dynamic Yearly Periodization Data generator ---
  const getPeriodizationPhase = (weekNum: number) => {
    if (weekNum <= 12) return { name: 'BASE', duration: 'Weeks 1-12', detail: '🌱 BASE TRAINING (ВЫНОСЛИВОСТЬ)', focus: 'High volume, low intensity, general structural balance strength build', color: '#EF4444' };
    if (weekNum <= 24) return { name: 'BUILD', duration: 'Weeks 13-24', detail: '🦾 BUILD & GROWTH (ГИПЕРТРОФИЯ)', focus: 'Moderate-high volume, high intensity, specialized hypertrophic density stimulus', color: '#D97706' };
    if (weekNum <= 36) return { name: 'PEAK', duration: 'Weeks 25-36', detail: '⚡ PEAK FORCE (СИЛА)', focus: 'Low volume, high intensity loading, max absolute motor unit recruitment', color: '#F59E0B' };
    return { name: 'TAPER', duration: 'Weeks 37-52', detail: '🪁 RECOVERY & TAPER', focus: 'Reduced fatigue volume, localized high skill frequency operations, and rehabilitation', color: '#E4E4E7' };
  };

  const activePhaseInfo = getPeriodizationPhase(periodizationWeek);

  // --- Custom SVGs Path Computation ---
  const calculateSvgPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  const getWeightProgressionSvgPoints = (data: number[], width: number, height: number) => {
    const minVal = Math.min(...data, 50) - 10;
    const maxVal = Math.max(...data, 160) + 10;
    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 60) + 40;
      const range = maxVal - minVal || 1;
      const y = height - 40 - ((val - minVal) / range) * (height - 80);
      return { x, y, value: val };
    });
  };

  const getAnalyticsSvgPoints = (data: number[], width: number, height: number) => {
    if (!data || data.length === 0) return [];
    if (data.length === 1) {
      return [{ x: width / 2, y: height / 2, value: data[0] }];
    }
    const minVal = Math.min(...data) - 20;
    const maxVal = Math.max(...data) + 20;
    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 80) + 50;
      const range = maxVal - minVal || 1;
      const y = height - 40 - ((val - minVal) / range) * (height - 80);
      return { x, y, value: val };
    });
  };

  return (
    <div className="min-h-screen bg-[#0D1321] text-gray-100 font-sans tracking-tight pb-24 relative overflow-x-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white font-medium px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400 flex items-center space-x-2 text-sm md:text-base max-w-sm"
          >
            <Sparkles className="w-5 h-5 flex-shrink-0 text-yellow-300" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Top Title Bar --- */}
      <header className="border-b border-[#1E293B] bg-[#0E1726]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 md:py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-white bg-clip-text text-transparent font-mono tracking-wider uppercase">
              Pyramid Lift
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block font-mono">SCIENTIFIC PERIODIZATION HUB</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Quick Config / Soviet preset model button */}
          <button 
            id="open-session-config-btn"
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-950 to-amber-950 border border-red-700/80 hover:border-red-500 rounded-xl text-xs md:text-sm font-mono text-red-200 shadow-md hover:shadow-red-950/40 transition duration-150 flex items-center space-x-2"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>⚙️ SESSION GOAL</span>
          </button>
        </div>
      </header>

      {/* --- Main Contents Container --- */}
      <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">

        {/* --- SCREEN 1: PYRAMID TRACKER --- */}
        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Pyramid Progress Header Card */}
            <div id="progress-header-card" className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 py-1 px-3 bg-blue-600/30 rounded-bl-xl border-l border-b border-[#243254] text-[10px] font-mono text-blue-300 tracking-wider">
                ACTIVE SEQUENCE: "{activePreset.name.substring(0, 1)}"
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs md:text-sm font-mono text-slate-300 pr-24">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-semibold text-blue-400">Sequence Tracker:</span>
                    <button
                      type="button"
                      onClick={() => {
                        updateExerciseProgress(selectedExerciseTracker, 0, 0);
                        triggerToast(`Reset "${selectedExerciseTracker.split(' + ')[0]}" sequence progress!`);
                      }}
                      className="text-[10px] bg-[#1a2336] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#2e3f66] hover:border-red-500/30 px-2 py-0.5 rounded-lg transition duration-150 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Reset Lift Progress
                    </button>
                  </div>
                  <span className="text-white">"{activePreset.name}" {completedReps}/{totalRepsTarget} Reps</span>
                </div>
                
                {/* Glowing neon progress bar */}
                <div className="h-6 w-full bg-[#0A0E1A] rounded-full p-1 border border-[#1E2E4E] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(2, (completedReps / totalRepsTarget) * 100))}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)] flex items-center justify-end px-3"
                  />
                </div>
                
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-400">
                    {Math.round((completedReps / totalRepsTarget) * 100)}% Complete
                  </span>
                  <span className="text-slate-400">
                    {Math.round((completedReps / totalRepsTarget) * 100)}% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* --- STOPWATCH & DOUBLE-LADDER INTERACTIVE ROW --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Left: Stopwatch & Rest Indicator */}
              <div className="md:col-span-4 bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-1.5 animate-fadeIn">
                    <Timer className="w-4 h-4 text-blue-400" />
                    <span>Chronometer</span>
                  </h3>
                  {isStopwatchRunning && (
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                {/* Big Digital Monospaced Display */}
                <div className="text-center py-3.5 bg-[#0A0E1A] rounded-xl border border-[#1E2E4E] relative overflow-hidden flex flex-col justify-center items-center h-20">
                  {isRestActive ? (
                    <div className="space-y-0.5 z-10 text-center">
                      <p className="text-[8px] font-mono text-amber-400 uppercase tracking-widest font-extrabold animate-pulse">REST INTERVAL</p>
                      <p className="text-2xl font-black font-mono text-amber-300 tracking-wider">
                        {restCountdown}s
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5 z-10 text-center font-mono">
                      <p className="text-[8px] font-mono text-blue-400 uppercase tracking-widest font-extrabold pb-0.5">ELAPSED WORKOUT</p>
                      <p className="text-xl md:text-2xl font-black text-white leading-none">
                        {formatStopwatchTime(stopwatchTime)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons Row */}
                <div className="grid grid-cols-3 gap-1.5">
                  {!isStopwatchRunning ? (
                    <button
                      onClick={startStopwatch}
                      className="py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center space-x-1 text-white transition active:scale-95"
                    >
                      <Play className="w-2.5 h-2.5" />
                      <span>Start</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseStopwatch}
                      className="py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center space-x-1 text-white transition active:scale-95"
                    >
                      <Pause className="w-2.5 h-2.5" />
                      <span>Pause</span>
                    </button>
                  )}
                  <button
                    onClick={resetStopwatch}
                    className="py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center space-x-1 text-slate-300 transition active:scale-95"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                  
                  {isRestActive ? (
                    <button
                      onClick={cancelRestCountdown}
                      className="py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-900 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center text-red-350 transition active:scale-95"
                    >
                      <span>Skip</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => startRestCountdown(restTimerSec)}
                      className="py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-705/30 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center text-blue-300 transition active:scale-95"
                    >
                      <span>Rest</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Double-Ladder / Rep-Rung Grid View */}
              <div className="md:col-span-8 bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-1.5 animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Rep Counter & Ladder Steps</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Rung {activeRungIndex + 1} of {activePreset.repsScheme.length}
                  </span>
                </div>

                {/* Interactive Rung Sequence Visualizer */}
                <div className="bg-[#0A0E1A] p-3 rounded-xl border border-[#1E2E4E] relative">
                  <div className="text-[10px] text-slate-400 font-mono mb-2 flex justify-between items-center">
                    <span>Click node to select target element:</span>
                    <span className="text-[10px] font-bold text-amber-500">{activePreset.name} Pattern</span>
                  </div>

                  {/* Rungs Horizontal List / Track */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 scrollbar-thin custom-scrollbar relative z-10">
                    {activePreset.repsScheme.map((scheme, idx) => {
                      const isCompleted = idx < activeRungIndex;
                      const isActive = idx === activeRungIndex;
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveRungIndex(idx);
                            triggerToast(`Rung preset loaded: Set ${idx+1} [${scheme.reps} Reps at ${scheme.intensity}% intensity]`);
                          }}
                          className={`w-9 h-9 rounded-full flex flex-col items-center justify-center flex-shrink-0 transition-all font-mono border text-center cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 border-blue-400 text-white font-black scale-110 shadow-[0_0_12px_rgba(59,130,246,0.6)] ring-2 ring-blue-500/30'
                              : isCompleted
                              ? 'bg-emerald-950/85 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-[#121824] border-slate-800 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span className="text-xs leading-none font-black">{scheme.reps}</span>
                          <span className="text-[7px] leading-none opacity-80 uppercase font-semibold mt-0.5">r{idx+1}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Target Rung Preview Card */}
                  <div className="mt-3 bg-slate-950/50 p-2 text-[11px] font-mono flex justify-between items-center rounded-lg border border-slate-900/60">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-slate-500 font-mono">CURRENT RUNG CONFIGURATION</p>
                      <p className="text-slate-200">
                        Set {activeRungIndex+1}: <span className="font-bold text-blue-400">{activePreset.repsScheme[activeRungIndex]?.reps} Reps</span> at <span className="font-bold text-teal-400">{activePreset.repsScheme[activeRungIndex]?.intensity}% 1RM</span>
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[8px] text-slate-500 font-mono">RECOMMENDED LOAD</p>
                      <p className={`${currentCalibrated1RM ? 'text-amber-400 font-black' : 'text-slate-300 font-bold'} text-right`}>
                        {(() => {
                          const refRM = currentCalibrated1RM || estimated1RM;
                          return refRM ? `${Math.round((refRM * (activePreset.repsScheme[activeRungIndex]?.intensity || 75)) / 100)} lbs` : '—';
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pyramid Tracker Box Control Panel */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 border-b border-[#243254]/40 pb-5">
                <div className="flex-1 text-left space-y-3">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold font-mono text-white tracking-wide">Pyramid Tracker</h2>
                    {currentCalibrated1RM && (
                      <span className="text-[9px] bg-amber-500/15 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30 tracking-tight animate-pulse">
                        ★ CALIBRATED
                      </span>
                    )}
                  </div>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                  
                  {/* Exercise Selector with high fidelity styling */}
                  <div className="max-w-xs pt-1">
                    <label className="block text-slate-400 text-[10px] uppercase tracking-wider font-mono mb-1">Target Exercise</label>
                    <select 
                      value={selectedExerciseTracker}
                      onChange={(e) => setSelectedExerciseTracker(e.target.value)}
                      className="w-full bg-[#0A0E1A] border border-[#243254] rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500 transition duration-150"
                    >
                      {EXERCISE_DICTIONARY.flatMap(cat => cat.exercises).map(ex => (
                        <option key={ex} value={ex}>{ex}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gold Calibrated 1-RM Value Callout */}
                  <div className="pt-1.5">
                    {currentCalibrated1RM ? (
                      <div className="inline-flex flex-col">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                          Calibrated 1-RM Load
                        </span>
                        <span className="text-2xl font-black text-amber-400 font-mono tracking-wide flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]">
                          <span>🏆</span> {currentCalibrated1RM} lbs
                          <span className="text-[10px] text-slate-400 font-normal font-sans">({currentTrackerCalibratedPB?.date})</span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-[10px] font-mono text-slate-400 leading-relaxed bg-amber-500/5 border border-amber-500/10 rounded-lg p-2 max-w-xs">
                        ⚠️ No calibration baseline found.
                        <button 
                          type="button"
                          onClick={() => {
                            const region = mapExerciseToRegion(selectedExerciseTracker);
                            if (region) {
                              setActiveMuscleRegion(region);
                            }
                            setActiveTab('analytics');
                            triggerToast(`Switched to Stats page and selected ${region} to calibrate target exercise!`);
                          }}
                          className="text-amber-500 hover:text-amber-400 font-bold underline ml-1 cursor-pointer transition"
                        >
                          Calibrate Now →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Training Load Guideline Table (Top-Right of card) */}
                <div className="bg-[#0A0E1A] border border-[#1E2E4E] rounded-xl p-3.5 w-full lg:w-72 font-mono text-xs shadow-inner flex-shrink-0">
                  <div className="flex justify-between items-center mb-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-[#1E2E4E]/80 pb-2">
                    <span>% Training Load</span>
                    <span className="text-right text-amber-400 font-bold">1-RM: {currentCalibrated1RM ? `${currentCalibrated1RM} lbs` : `${estimated1RM} lbs (Est)`}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
                    {[100, 90, 85, 80, 75, 70].map((percent) => {
                      const refLoad = currentCalibrated1RM || estimated1RM;
                      const calculatedLoad = Math.round((refLoad * percent) / 100);
                      const isCurrentIntensity = activePreset.repsScheme[activeRungIndex]?.intensity === percent;
                      return (
                        <div key={percent} className={`flex justify-between items-center py-1 px-2 rounded ${
                          isCurrentIntensity 
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)] scale-102' 
                            : 'hover:bg-slate-800/15'
                        }`}>
                          <span className={isCurrentIntensity ? 'text-amber-400' : 'text-slate-500'}>{percent}%</span>
                          <span className={isCurrentIntensity ? 'text-amber-400 font-bold' : 'font-semibold text-slate-100'}>{calculatedLoad} lbs</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[9px] text-slate-500 leading-normal border-t border-[#1E2E4E]/40 pt-1.5 flex items-start gap-1">
                    <span>💡</span>
                    <span>Highlighted row matches active rung target: <span className="text-amber-400 font-bold">{activePreset.repsScheme[activeRungIndex]?.intensity || 75}%</span>.</span>
                  </div>
                </div>
              </div>

              {/* Weights vs Reps Digital Counter Panel */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Weight Column */}
                <div className="space-y-2 text-center">
                  <span className="text-xs md:text-sm font-mono font-bold text-slate-400 block">Weight (lbs)</span>
                  <div className="flex items-center justify-between bg-[#0A0E1A] border border-[#1E2E4E] rounded-xl p-2 h-16 relative">
                    <button 
                      onClick={() => modifyWeight(5)}
                      className="w-12 h-12 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/80 active:scale-95 rounded-lg flex items-center justify-center text-blue-400 text-xl font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)] transition"
                    >
                      <Plus className="w-5 h-5 text-blue-400" />
                    </button>
                    <span className="text-2xl md:text-3xl font-bold font-mono text-white flex-1 select-none">
                      {weightValue}
                    </span>
                    <button 
                      onClick={() => modifyWeight(-5)}
                      className="w-12 h-12 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/80 active:scale-95 rounded-lg flex items-center justify-center text-blue-400 text-xl font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)] transition"
                    >
                      <Minus className="w-5 h-5 text-blue-400" />
                    </button>
                  </div>
                </div>

                {/* Reps Column */}
                <div className="space-y-2 text-center">
                  <span className="text-xs md:text-sm font-mono font-bold text-slate-400 block">Reps</span>
                  <div className="flex items-center justify-between bg-[#0A0E1A] border border-[#1E2E4E] rounded-xl p-2 h-16 relative">
                    <button 
                      onClick={() => modifyReps(1)}
                      className="w-12 h-12 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/80 active:scale-95 rounded-lg flex items-center justify-center text-emerald-400 text-xl font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)] transition"
                    >
                      <Plus className="w-5 h-5 text-emerald-400" />
                    </button>
                    <span className="text-2xl md:text-3xl font-bold font-mono text-white flex-1 select-none">
                      {repsValue}
                    </span>
                    <button 
                      onClick={() => modifyReps(-1)}
                      className="w-12 h-12 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/80 active:scale-95 rounded-lg flex items-center justify-center text-blue-400 text-xl font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)] transition"
                    >
                      <Minus className="w-5 h-5 text-blue-300" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Log Set Core Action Button */}
              <button 
                id="log-set-btn"
                onClick={handleLogActiveSet}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-[#1D4ED8] to-blue-700 hover:from-blue-500 hover:to-blue-600 font-bold font-mono tracking-wider text-white rounded-xl shadow-[0_4px_20px_rgba(29,78,216,0.4)] active:scale-[0.98] transition flex items-center justify-center space-x-2 text-base"
              >
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Log Set</span>
              </button>
            </div>

            {/* Weight Lift Progression Chart Card */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">Weight Lift Progression</h3>
                  <p className="text-xs text-slate-400">{selectedExerciseTracker.split(' + ')[0]}</p>
                </div>
                <div className="bg-slate-800/80 border border-gray-700 rounded-lg px-2 py-1 text-xs text-blue-400 font-mono">
                  Target sequence intensity
                </div>
              </div>

              {/* Custom High Fidelity Svg Chart */}
              <div className="h-56 w-full bg-[#0A0E1A] rounded-xl relative p-4 border border-[#1E2E4E] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* SVG Graph Canvas */}
                <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 320 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline Grids */}
                  <line x1="20" y1="30" x2="310" y2="30" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3"/>
                  <line x1="20" y1="65" x2="310" y2="65" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3"/>
                  <line x1="20" y1="100" x2="310" y2="100" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3"/>
                  <line x1="20" y1="135" x2="310" y2="135" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3"/>

                  {/* SVg Paths */}
                  {(() => {
                    const points = getWeightProgressionSvgPoints(workoutWeightHistory, 320, 180);
                    const d = calculateSvgPath(points);
                    // Area path
                    const areaD = d ? `${d} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z` : '';

                    return (
                      <>
                        <path d={areaD} fill="url(#chartGrad)" />
                        <path d={d} fill="none" stroke="#2563EB" strokeWidth="3" className="stroke-blue-500 shadow-xl" />
                        {points.map((p, i) => (
                          <g key={i} className="group cursor-pointer">
                            <circle 
                              cx={p.x} 
                              cy={p.y} 
                              r="5" 
                              fill="#60A5FA" 
                              stroke="#0A0E1A" 
                              strokeWidth="2.5"
                              className="hover:r-7 transition-all duration-150"
                            />
                            {/* Interactive Tooltip Labels */}
                            <text 
                              x={p.x} 
                              y={p.y - 12} 
                              fill="#FFF" 
                              fontSize="9" 
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="middle"
                              transform={`rotate(-90, ${p.x}, ${p.y - 12})`}
                              className="bg-slate-900 px-1 py-0.5 rounded opacity-80"
                            >
                              {p.value} lbs
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Axis Labels */}
                <div className="absolute left-2 top-0 bottom-4 flex flex-col justify-between text-[10px] font-mono text-slate-500 z-20 pointer-events-none pr-1">
                  <span>160</span>
                  <span>120</span>
                  <span>80</span>
                  <span>60</span>
                </div>

                <div className="absolute bottom-2 left-10 right-4 flex justify-between text-[10px] font-mono text-slate-500 z-20 pointer-events-none">
                  <span>0 (weeks)</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                </div>
              </div>

              {/* Action Buttons below Graph */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center justify-center space-x-2 py-2 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-xl text-xs font-mono font-bold tracking-wider hover:border-slate-500 transition"
                >
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span>View History</span>
                </button>
                <button 
                  onClick={() => setIsGoalModalOpen(true)}
                  className="flex items-center justify-center space-x-2 py-2 px-4 bg-slate-800 hover:bg-slate-755 border border-slate-700/60 rounded-xl text-xs font-mono font-bold tracking-wider hover:border-slate-500 transition text-blue-300"
                >
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>Adjust Target</span>
                </button>
              </div>

            </div>

            {/* Active session logs list */}
            {trackerHistory.length > 0 && (
              <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#243254] pb-3">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">Logged Sets History</h3>
                  <button 
                    onClick={() => {
                      setTrackerHistory([]);
                      localStorage.removeItem('pyramid_logs');
                      triggerToast("Cleared logged session history.");
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 font-mono transition"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {trackerHistory.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between items-center bg-[#0D1321] border border-slate-800 rounded-xl p-3 text-xs md:text-sm font-mono hover:bg-[#111A2E] transition">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        <div>
                          <p className="font-bold text-slate-200">{item.weight} lbs × {item.reps} reps</p>
                          <p className="text-[10px] text-slate-400 font-normal">{item.exerciseId.split(' + ')[0]}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* --- SCREEN 2: CUSTOM SESSION BUILDER & 1RM --- */}
        {activeTab === 'builder' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold font-mono tracking-wider bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent uppercase">
                Custom Pyramid Session Builder
              </h2>
              <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full" />
            </div>

            {/* Card 1: 1RM Calculator */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-700 pb-2">
                <Award className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm md:text-base font-bold font-mono text-slate-200 uppercase tracking-widest">1RM Calculator</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-mono mb-1.5">Enter Weight (lbs/kg)</label>
                  <input 
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    placeholder="e.g. 225"
                    className="w-full bg-[#0A0E1A] border border-[#243254] rounded-xl px-4 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-mono mb-1.5">Enter Reps</label>
                  <input 
                    type="number"
                    value={calcReps}
                    onChange={(e) => setCalcReps(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-[#0A0E1A] border border-[#243254] rounded-xl px-4 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-3 bg-[#0D1321] p-4 rounded-xl border border-slate-800">
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-slate-400 text-xs font-mono">Calculated Benchmark</p>
                  <h4 className="text-xl md:text-2xl font-black text-white font-mono">
                    Estimated 1RM: <span className="text-blue-400">{estimated1RM} lbs</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono italic">Epley Formula used for precision.</p>
                </div>

                <button 
                  id="calc-1rm-btn"
                  onClick={handleCalculate1RM}
                  className="w-full md:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs md:text-sm font-semibold font-mono tracking-wider active:scale-95 transition text-white shadow-lg"
                >
                  Calculate 1RM
                </button>
              </div>
            </div>

            {/* Card 2: Pyramid Logic & Rep Scheme */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-700 pb-2">
                <Sliders className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm md:text-base font-bold font-mono text-slate-200 uppercase tracking-widest">Pyramid Logic & Rep Scheme</h3>
              </div>

              {/* Graphical representation of selected layout */}
              <div className="bg-[#0A0E1A] border border-[#1E2E4E] rounded-xl p-4 space-y-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-20" />
                
                {/* SVG curve denoting dots "5-4-3-2-1-2-3-4-5" bell curve */}
                <div className="h-28 w-full flex items-center justify-center relative z-10 pt-4">
                  <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <path 
                      d="M 15 65 Q 48 50 82 40 Q 115 30 150 15 Q 185 30 218 40 Q 252 50 285 65" 
                      fill="none" 
                      stroke="#3B82F6" 
                      strokeWidth="2.5" 
                      strokeDasharray="1 1"
                    />
                    
                    {/* Specific curve nodes */}
                    {(() => {
                      const points = [
                        { x: 15, y: 65, rep: 5 },
                        { x: 48, y: 50, rep: 4 },
                        { x: 82, y: 40, rep: 3 },
                        { x: 115, y: 30, rep: 2 },
                        { x: 150, y: 15, rep: 1 },
                        { x: 185, y: 30, rep: 2 },
                        { x: 218, y: 40, rep: 3 },
                        { x: 252, y: 50, rep: 4 },
                        { x: 285, y: 65, rep: 5 },
                      ];
                      
                      return points.map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="6" fill="#FFF" stroke="#2563EB" strokeWidth="2.5" />
                          <text x={pt.x} y={pt.y + 15} textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="bold" fontFamily="monospace">
                            {pt.rep}
                          </text>
                        </g>
                      ));
                    })()}
                  </svg>
                </div>
                
                <div className="flex justify-center space-x-1 font-mono text-sm tracking-widest text-[#60A5FA] font-bold">
                  <span>5 - 4 - 3 - 2 - 1 - 2 - 3 - 4 - 5</span>
                </div>
              </div>

              {/* Toggles and Increment Logic Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Rep Toggle 1 */}
                <div className="flex items-center justify-between p-3 bg-[#0D1321] border border-[#243254] rounded-xl h-14">
                  <span className="text-xs md:text-sm font-semibold font-mono text-slate-300">Rep Increments (Up)</span>
                  <button 
                    onClick={() => setRepIncrementToggle1(prev => !prev)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${repIncrementToggle1 ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transition-transform duration-200 ${repIncrementToggle1 ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Rep Toggle 2 */}
                <div className="flex items-center justify-between p-3 bg-[#0D1321] border border-[#243254] rounded-xl h-14">
                  <span className="text-xs md:text-sm font-semibold font-mono text-slate-300">Rep Increments (Down)</span>
                  <button 
                    onClick={() => setRepIncrementToggle2(prev => !prev)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${repIncrementToggle2 ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                    <div className={`h-4 w-4 rounded-full bg-white transition-transform duration-200 ${repIncrementToggle2 ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Step Up Increments Input Badges */}
                <div className="flex items-center justify-between p-3 bg-[#0D1321] border border-[#243254] rounded-xl">
                  <span className="text-xs md:text-sm font-semibold font-mono text-slate-300">Step Up:</span>
                  <div className="flex items-center space-x-1">
                    <input 
                      type="number"
                      value={stepUpIncrement}
                      onChange={(e) => setStepUpIncrement(Math.max(1, parseInt(e.target.value) || 5))}
                      className="w-12 bg-slate-950 border border-slate-800 text-center text-xs text-white p-1 rounded font-mono"
                    />
                    <span className="text-xs text-slate-400 font-mono">lbs /</span>
                    <button 
                      onClick={() => setStepUpByPercent(prev => !prev)}
                      className={`text-[10px] px-2 py-1 rounded font-mono font-bold ${stepUpByPercent ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      2.5%
                    </button>
                  </div>
                </div>

                {/* Step Down Increments Input Badges */}
                <div className="flex items-center justify-between p-3 bg-[#0D1321] border border-[#243254] rounded-xl">
                  <span className="text-xs md:text-sm font-semibold font-mono text-slate-300">Step Down:</span>
                  <div className="flex items-center space-x-1">
                    <input 
                      type="number"
                      value={stepDownIncrement}
                      onChange={(e) => setStepDownIncrement(Math.max(1, parseInt(e.target.value) || 10))}
                      className="w-12 bg-slate-950 border border-slate-800 text-center text-xs text-white p-1 rounded font-mono"
                    />
                    <span className="text-xs text-slate-400 font-mono">lbs /</span>
                    <button 
                      onClick={() => setStepDownByPercent(prev => !prev)}
                      className={`text-[10px] px-2 py-1 rounded font-mono font-bold ${stepDownByPercent ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      5%
                    </button>
                  </div>
                </div>

              </div>

              {/* Slider: Rest Timer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm font-mono text-slate-300">
                  <span>Rest Timer (sec)</span>
                  <span className="font-bold text-blue-400">{restTimerSec} sec</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={restTimerSec}
                    onChange={(e) => setRestTimerSec(parseInt(e.target.value))}
                    className="flex-1 accent-blue-500 h-1.5 bg-[#0A0E1A] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-500">180</span>
                </div>
              </div>

              {/* Calculated info */}
              <div className="flex justify-between items-center text-xs md:text-sm font-mono border-t border-[#243254] pt-4 text-slate-400">
                <span>Calculated Progression Count:</span>
                <span className="text-white font-bold uppercase text-right">Total Sets: 10</span>
              </div>

              {/* Action Start Session button */}
              <button 
                id="start-session-btn"
                onClick={() => {
                  setCompletedReps(0);
                  const dlPreset = GOAL_PRESETS.find(p => p.id === 'double_ladder');
                  if (dlPreset) {
                    setActivePreset(dlPreset);
                    setTotalRepsTarget(57);
                  }
                  setActiveRungIndex(0);
                  resetStopwatch();
                  cancelRestCountdown();
                  startStopwatch();
                  setActiveTab('tracker');
                  triggerToast("🚀 Soviet Double-Ladder Session configured! Chronometer active. Begin logging!");
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold font-mono tracking-wider text-center rounded-xl shadow-lg hover:shadow-cyan-950/20 active:scale-[0.98] transition"
              >
                Start Double-Ladder Session 🚀
              </button>
            </div>
          </div>
        )}


        {/* --- SCREEN 3: LIFT PROGRESS ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header selection title with filter dropdown */}
            <div className="flex justify-between items-center bg-[#151D30] border border-[#243254] rounded-2xl p-4 shadow-md">
              <h2 className="text-md md:text-lg font-bold font-mono text-[#60A5FA] uppercase tracking-wider flex items-center space-x-2">
                <span>Lift Progress Analytics</span>
              </h2>
              <select 
                value={analyticsHistoryFilter}
                onChange={(e) => setAnalyticsHistoryFilter(e.target.value)}
                className="bg-[#0D1321] border border-[#243254] px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 focus:outline-none"
              >
                <option value="1 Week">1 Week</option>
                <option value="1 Month">1 Month</option>
              </select>
            </div>

            {/* Main Interactive 1RM Progress Chart Card */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-md font-bold font-mono text-slate-200 uppercase tracking-widest">
                  {activeMuscleRegion} 1RM Progress (Dynamic Workout History)
                </h3>
                <div className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                  {/* Denoting peak value */}
                  Peak: {(() => {
                    const data = getGraphDataForRegion(activeMuscleRegion);
                    return data.length > 0 ? `${Math.max(...data)} lbs` : '0 lbs';
                  })()}
                </div>
              </div>

              {/* Dynamic Analytics SVG Line Graph */}
              <div className="h-64 w-full bg-[#0A0E1A] rounded-xl relative p-4 border border-[#1E2E4E] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" opacity="0.3" />
                
                {/* Clean Day 1 Startup Overlay */}
                {getGraphDataForRegion(activeMuscleRegion).length === 0 && (
                  <div className="absolute inset-0 z-20 bg-[#0A0E1A]/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                    <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                      {trackerHistory.some(log => mapExerciseToRegion(log.exerciseId).toLowerCase() === activeMuscleRegion.toLowerCase())
                        ? `No logs in ${analyticsHistoryFilter}`
                        : "Ready for Day 1 Startup & Baseline"}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 max-w-sm">
                      {trackerHistory.some(log => mapExerciseToRegion(log.exerciseId).toLowerCase() === activeMuscleRegion.toLowerCase())
                        ? `You have logged sets for ${activeMuscleRegion}, but none within the selected timeframe (${analyticsHistoryFilter}). Try changing the filter or logging a new set!`
                        : `No logs registered yet for ${activeMuscleRegion}. Use the calibrator tool below to register your Week 1 baseline 1-RM, or start a training session!`}
                    </p>
                  </div>
                )}

                {/* SVG code */}
                <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 320 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
 
                  {/* Horizontal Guideline Grids */}
                  <line x1="30" y1="30" x2="310" y2="30" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4"/>
                  <line x1="30" y1="65" x2="310" y2="65" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4"/>
                  <line x1="30" y1="100" x2="310" y2="100" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4"/>
                  <line x1="30" y1="135" x2="310" y2="135" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4"/>
 
                  {(() => {
                    const activeData = getGraphDataForRegion(activeMuscleRegion);
                    const points = getAnalyticsSvgPoints(activeData, 320, 200);
                    const d = calculateSvgPath(points);
                    // Area path
                    const areaD = (d && points.length > 1) ? `${d} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z` : '';
                    
                    return (
                      <>
                        {areaD && <path d={areaD} fill="url(#anGrad)" />}
                        {d && <path d={d} fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" className="stroke-blue-500" />}
                        
                        {points.map((p, i) => {
                          const isLast = i === points.length - 1;
                          return (
                            <g key={i}>
                              <circle 
                                cx={p.x} 
                                cy={p.y} 
                                r="6" 
                                fill={isLast ? "#60A5FA" : "#1D4ED8"} 
                                stroke="#FFF" 
                                strokeWidth="2" 
                              />
                              {isLast && (
                                <g className="animate-pulse">
                                  <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
                                </g>
                              )}
                              {/* Draw values above circles */}
                              <text x={p.x} y={p.y - 12} fill="#94A3B8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                {p.value}
                              </text>
                            </g>
                          );
                        })}

                        {/* Floating Peak Tag */}
                        {points.length > 0 && (
                          <g transform={`translate(${points[points.length - 1].x - 55}, ${points[points.length - 1].y - 38})`}>
                            <rect width="60" height="18" rx="4" fill="#2563EB" opacity="0.95" />
                            <text x="30" y="12" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              {activeData[activeData.length - 1]} lbs
                            </text>
                          </g>
                        )}
                      </>
                    );
                  })()}
                </svg>

                {/* Y-Axis Indicator Label */}
                <span className="absolute -rotate-90 left-[-24px] top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#475569]">
                  Weight (lbs)
                </span>

                {/* Grid Labels Left Side */}
                <div className="absolute left-2 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-500 z-20 pointer-events-none">
                  <span>350</span>
                  <span>300</span>
                  <span>250</span>
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                </div>

                {/* Dynamic Grid Labels Bottom Side */}
                <div className="absolute bottom-1 left-12 right-6 flex justify-between text-[10px] font-mono text-slate-500 z-20 pointer-events-none">
                  {getGraphLabelsForRegion(activeMuscleRegion).map((lbl, idx) => (
                    <span key={idx}>{lbl}</span>
                  ))}
                </div>
              </div>

              {/* Calculated text bottom annotation using progressive gains formula */}
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 py-1 px-2 bg-[#0D1321] rounded-lg">
                <span>Core Area Benchmark Analyzed</span>
                {(() => {
                  const currentData = getGraphDataForRegion(activeMuscleRegion);
                  const diff = currentData[currentData.length - 1] - currentData[0];
                  const prefix = diff >= 0 ? '+' : '';
                  return (
                    <span className="text-emerald-400 font-bold">
                      Total Gain: {prefix}{diff} lbs
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Muscle region physiologic badges targeting slider filters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#94A3B8]">Target Muscle Filter</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(REGION_EXERCISES).map((mRegion) => (
                  <button 
                    key={mRegion}
                    onClick={() => {
                      setActiveMuscleRegion(mRegion);
                      triggerToast(`Switched analytics path to ${mRegion}`);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono transition font-medium ${
                      activeMuscleRegion === mRegion 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' 
                        : 'bg-[#151D30] border-[#243254] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {mRegion}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Log & Day 1 Startup Baseline Calibrator Form */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h3 className="text-xs md:text-sm font-bold font-mono uppercase tracking-wider text-slate-100">
                    Day 1 / Week 1 Startup: 1-RM Calibrator
                  </h3>
                  {isRegionFullyCalibrated ? (
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1 animate-pulse">
                      <span>✓</span> <span>COMPLETED</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold bg-[#3B82F6]/10 text-blue-400 px-2 py-0.5 rounded-full border border-[#3B82F6]/20">
                      CALIBRATING ({completedRegionPbs.length}/{activeRegionExercises.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setCalibratorUserCollapsed(isCalibratorCollapsed ? false : true)}
                    className="text-xs font-mono font-extrabold px-2.5 py-1 rounded bg-[#0D1321] border border-[#243254] text-blue-400 hover:text-white hover:border-slate-500 hover:bg-[#1E2E4E]/40 transition"
                  >
                    {isCalibratorCollapsed ? '📂 Expand Form' : '📁 Collapse Form'}
                  </button>
                  <div className="text-[10px] hidden sm:block bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20">
                    Baseline Installer
                  </div>
                </div>
              </div>

              {/* Baseline Reference Dashboard - Always visible to ensure immediate reference for the lifter */}
              <div className="bg-[#090F1C]/80 border border-[#243254]/50 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    {activeMuscleRegion} Week 1 Starting Reference Map
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ✓ {completedRegionPbs.length} of {activeRegionExercises.length} Set Baselines Registered
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {activeRegionExercises.map((ex) => {
                    const matchingPb = personalBests.find(pb => pb.variation.toLowerCase() === ex.toLowerCase() || pb.name.toLowerCase() === ex.toLowerCase());
                    return (
                      <div key={ex} className={`p-2 rounded-lg border transition duration-200 flex flex-col justify-between ${
                        matchingPb 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-100 shadow-[inset_0_1px_8px_rgba(16,185,129,0.05)]' 
                          : 'bg-[#0D1321] border-dashed border-[#243254]/60 text-slate-400'
                      }`}>
                        <div className="flex items-start justify-between gap-1.5Packed overflow-hidden">
                          <span className="text-[10px] font-mono leading-tight truncate block max-w-[170px]" title={ex}>
                            {ex.split(' + ')[0].split(' / ')[0]}
                          </span>
                          {matchingPb ? (
                            <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              ✓ Set
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono bg-[#1E293B] text-slate-500 px-1.5 py-0.2 rounded">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex justify-between items-end">
                          <span className="text-[9px] font-mono text-slate-500">Day 1 1-RM:</span>
                          <span className="text-xs font-mono font-bold">
                            {matchingPb ? `${matchingPb.weight} lbs` : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible calibrator form body */}
              {isCalibratorCollapsed ? (
                <div className="bg-blue-950/10 border border-blue-900/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">✓ Reference Map Locked:</span>
                    <span>All {activeMuscleRegion} startup reference points are logged. Card collapsed.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCalibratorUserCollapsed(false)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline text-left transition"
                  >
                    Rerun calibration or adjust baseline lifts →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveStartupBaseline} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Select exercise */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Select Base Exercise</label>
                      <select
                        value={calibratorExercise}
                        onChange={(e) => setCalibratorExercise(e.target.value)}
                        className="w-full bg-[#0D1321] border border-[#243254] px-3 py-2 rounded-xl text-xs font-mono text-slate-200 focus:outline-[#3B82F6] focus:outline focus:outline-1"
                      >
                        {(REGION_EXERCISES[activeMuscleRegion] || []).map((ex) => (
                          <option key={ex} value={ex}>
                            {ex}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Calibration Method */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">1RM Measuring Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCalibratorMethod('estimated')}
                          className={`py-2 px-3 rounded-xl border text-xs font-mono transition font-medium ${
                            calibratorMethod === 'estimated'
                              ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                              : 'bg-[#0D1321] border-[#243254] text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          Submaximal (Estimate)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalibratorMethod('direct')}
                          className={`py-2 px-3 rounded-xl border text-xs font-mono transition font-medium ${
                            calibratorMethod === 'direct'
                              ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                              : 'bg-[#0D1321] border-[#243254] text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          True 1-RM (Direct 1 Rep)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Weight */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Lifted Weight (lbs)</label>
                      <div className="flex items-center bg-[#0D1321] border border-[#243254] rounded-xl overflow-hidden px-1">
                        <button
                          type="button"
                          onClick={() => setCalibratorWeight(prev => Math.max(0, prev - 5))}
                          className="w-10 h-10 font-extrabold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={calibratorWeight || ''}
                          onChange={(e) => setCalibratorWeight(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-transparent text-center text-xs font-mono font-bold text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setCalibratorWeight(prev => prev + 5)}
                          className="w-10 h-10 font-extrabold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Repetitions (disabled if direct 1-RM) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                        Reps completed {calibratorMethod === 'direct' && <span className="text-slate-500">(Fixed 1)</span>}
                      </label>
                      <div className={`flex items-center bg-[#0D1321] border border-[#243254] rounded-xl overflow-hidden px-1 ${calibratorMethod === 'direct' ? 'opacity-40 pointer-events-none' : ''}`}>
                        <button
                          type="button"
                          disabled={calibratorMethod === 'direct'}
                          onClick={() => setCalibratorReps(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 font-extrabold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          disabled={calibratorMethod === 'direct'}
                          value={calibratorMethod === 'direct' ? 1 : (calibratorReps || '')}
                          onChange={(e) => setCalibratorReps(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-transparent text-center text-xs font-mono font-bold text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={calibratorMethod === 'direct'}
                          onClick={() => setCalibratorReps(prev => prev + 1)}
                          className="w-10 h-10 font-extrabold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Startup timeline / backdate info */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Calibration Date / Startup Timeline</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={calibratorWeek}
                          onChange={(e) => setCalibratorWeek(parseInt(e.target.value))}
                          className="bg-[#0D1321] border border-[#243254] px-2 py-2 rounded-xl text-xs font-mono text-slate-200 focus:outline-[#3B82F6] focus:outline focus:outline-1"
                        >
                          <option value="1">Week 1 Startup</option>
                          <option value="2">Week 2 Prep</option>
                          <option value="3">Week 3 Build</option>
                          <option value="4">Week 4 Test</option>
                        </select>
                        <input
                          type="text"
                          value={calibratorDate}
                          onChange={(e) => setCalibratorDate(e.target.value)}
                          placeholder="Jun 10, 2026"
                          className="bg-[#0D1321] border border-[#243254] px-2 py-2 rounded-xl text-xs font-mono text-slate-200 text-center focus:outline-[#3B82F6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Real-time calculated 1-RM profile output strip */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 flex justify-between items-center text-xs font-mono">
                    <div className="text-slate-400">
                      {calibratorMethod === 'estimated' ? (
                        <span>Epley Formula: <span className="text-slate-300">Lift Weight × (1 + 0.0333 × Reps)</span></span>
                      ) : (
                        <span>Direct Input Mode</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Calibrated 1-RM Output:</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20">
                        {computedStartup1RM} lbs
                      </span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold font-mono tracking-wider text-xs uppercase rounded-xl shadow-lg transition active:scale-[0.98] flex justify-center items-center space-x-2"
                  >
                    <span>🚀 Register Startup Week {calibratorWeek} Personal Best</span>
                  </button>
                </form>
              )}
            </div>

            {/* Personal Bests Listing Card */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#243254] pb-2">
                <h3 className="text-xs md:text-sm font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Personal Bests (PB)</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to reset and take out ALL pre-existing entries in your Personal Bests database for a fresh Day 1 Startup?")) {
                        setPersonalBests([]);
                        localStorage.removeItem('pyramid_pbs');
                        triggerToast("Personal Bests table cleared successfully. Start fresh! 🦾");
                      }
                    }}
                    className="text-[10px] font-mono text-red-400 hover:text-red-300 hover:underline transition uppercase tracking-wider font-extrabold"
                  >
                    Wipe Table (Day 1 Clear)
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Verifiable lift log</span>
                </div>
              </div>

              {personalBests.length === 0 ? (
                <div className="border border-dashed border-[#243254] rounded-xl p-8 text-center bg-[#090F1C]/40 space-y-2">
                  <p className="text-sm font-mono text-slate-400 font-medium">
                    No active Personal Bests registered for Day 1.
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">
                    Use the 1-RM Calibrator form above to measure and record your Week 1 baseline lift!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {personalBests.map((pb) => (
                    <div key={pb.exerciseId} className="bg-[#090F1C] border border-[#1E2E4E]/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500/60 transition relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono uppercase bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                            {pb.name} 🦾
                          </span>
                          <h4 className="text-base font-black text-white font-mono mt-1">{pb.weight} lbs (1RM)</h4>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 text-right">{pb.date}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <p className="text-xs text-slate-400 font-mono italic">
                          {pb.variation}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = personalBests.filter(item => item.exerciseId !== pb.exerciseId);
                            setPersonalBests(updated);
                            localStorage.setItem('pyramid_pbs', JSON.stringify(updated));
                            triggerToast(`Deleted ${pb.name} PB.`);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition text-[10px] text-red-500 hover:text-red-400 font-mono font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}


        {/* --- SCREEN 4: DISCOVERY, SCIENTIFIC REFERENCE TABLES & DICTIONARY --- */}
        {activeTab === 'science' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl md:text-2xl font-bold font-mono tracking-widest bg-gradient-to-r from-teal-300 to-white bg-clip-text text-transparent uppercase">
                Trainer's Science Desk
              </h2>
              <div className="w-12 h-1 bg-teal-500 mx-auto rounded-full" />
            </div>

            {/* Science Tables Horizontal scroll or responsive grid */}
            <div className="space-y-6">
              
              {/* Table 1: Training Load of 1RM */}
              <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center space-x-2 text-blue-400 border-b border-slate-700 pb-2">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="text-xs md:text-sm font-bold font-mono uppercase tracking-wider">
                    Training Load as a % of 1RM
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono text-slate-300 text-left">
                    <thead>
                      <tr className="border-b border-[#243254] text-teal-400 uppercase">
                        <th className="pb-2">Goal</th>
                        <th className="pb-2 text-center">% 1RM</th>
                        <th className="pb-2 text-center">Reps</th>
                        <th className="pb-2 text-center">Sets</th>
                        <th className="pb-2 text-center">Rest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-[#0A0E1A]/40 rounded-lg">
                      {Object.values(TRAINING_RULES).map((rule, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50">
                          <td className="py-2.5 px-1 font-bold text-slate-200">{rule.goal}</td>
                          <td className="py-2.5 text-center font-bold text-blue-400">{rule.load}</td>
                          <td className="py-2.5 text-center">{rule.reps}</td>
                          <td className="py-2.5 text-center">{rule.sets}</td>
                          <td className="py-2.5 text-center text-slate-400">{rule.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: Fiber Type interactive map */}
              <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-700 pb-2">
                  <CheckCircle className="w-4 h-4" />
                  <h3 className="text-xs md:text-sm font-bold font-mono uppercase tracking-wider">
                    Fiber Type Training Zones Map
                  </h3>
                </div>

                {/* Coordinate Canvas Grid representing quadrants */}
                <div className="bg-[#0A0E1A] h-52 rounded-xl relative border border-[#1E2E4E] p-4 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-[#0D1321] opacity-50 bg-[radial-gradient(#1e3a8a_0.5px,transparent_0.5px)] [background-size:16px_16px]" />
                  
                  {/* Grid Quadrants */}
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full relative z-10 border border-slate-800 text-[10px] font-mono">
                    
                    {/* Top Left Quadrant (Type I Endurance) */}
                    <div className="border-r border-b border-dashed border-slate-800 p-2 flex flex-col justify-between bg-emerald-950/20 hover:bg-emerald-950/40 transition">
                      <span className="font-bold text-emerald-400">Endurance Type I</span>
                      <span className="text-slate-500 text-[9px]">&gt;15 Reps</span>
                    </div>

                    {/* Top Right Quadrant */}
                    <div className="border-b border-dashed border-slate-800 p-2 text-right flex flex-col justify-between">
                      <span className="text-slate-500">Tension Threshold</span>
                      <span className="text-slate-600">Dynamic Load</span>
                    </div>

                    {/* Bottom Left Quadrant */}
                    <div className="border-r border-dashed border-slate-800 p-2 flex flex-col justify-end">
                      <span className="text-slate-600 block">Aerobic Load</span>
                    </div>

                    {/* Bottom Right Quadrant (Type IIx Strength) */}
                    <div className="p-2 text-right flex flex-col justify-between bg-red-950/20 hover:bg-red-950/40 transition">
                      <span className="font-bold text-red-400 block">Strength Type IIx</span>
                      <span className="text-slate-500 text-[9px]">&lt;6 Repetitions</span>
                    </div>

                    {/* Floating hyper power badge inside */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white font-black font-mono tracking-widest px-4 py-1.5 rounded-lg border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.6)] text-xs">
                      POWER
                    </div>

                    {/* Left Center Highlight */}
                    <div className="absolute top-[40%] right-[32%] bg-amber-500/20 border border-amber-600 rounded p-1 text-center font-bold text-amber-300 pointer-events-none text-[9px]">
                      Hypertrophy Type IIa
                    </div>
                  </div>

                  {/* Range indicators */}
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 z-10 pt-1">
                    <span>Resistance (% 1RM): &lt;65%</span>
                    <span>60-85%</span>
                    <span>&gt;85%</span>
                  </div>
                </div>
              </div>

              {/* Accordion List: Exercise Dictionary Search */}
              <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Search className="w-4 h-4" />
                    <h3 className="text-xs md:text-sm font-bold font-mono uppercase tracking-wider">
                      Exercise Dictionary Accordion
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Biomechanical categories</span>
                </div>

                {/* Instant Search input */}
                <div className="relative">
                  <input 
                    type="text"
                    value={dictionarySearch}
                    onChange={(e) => setDictionarySearch(e.target.value)}
                    placeholder="Search exercises..."
                    className="w-full bg-[#0A0E1A] border border-[#243254] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                </div>

                {/* Category lists */}
                <div className="space-y-2">
                  {filteredDictionary.map((cat) => {
                    const isExpanded = expandedCategories[cat.category];
                    return (
                      <div key={cat.category} className="border border-slate-800 rounded-xl overflow-hidden">
                        
                        {/* Header trigger */}
                        <button 
                          onClick={() => toggleCategory(cat.category)}
                          className="w-full px-4 py-3 bg-[#0D1321]/80 hover:bg-[#111A2E] flex justify-between items-center transition text-xs font-bold font-mono text-slate-200"
                        >
                          <span>{cat.category}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* List items with expansion */}
                        {isExpanded && (
                          <div className="bg-[#0A0E1A] divide-y divide-slate-800/50">
                            {cat.exercises.map((ex) => (
                              <button 
                                key={ex}
                                onClick={() => {
                                  setSelectedExerciseTracker(ex);
                                  setActiveTab('tracker');
                                  triggerToast(`Active Tracker Exercise set to: ${ex.split(' + ')[0]}`);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-mono text-slate-300 hover:bg-blue-900/30 hover:text-white transition flex items-center justify-between group"
                              >
                                <span>{ex}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-[9px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900 font-bold">
                                  Use Lift
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* --- SCREEN 5: YEARLY PERIODIZATION TIMELINE RANGE SLIDER --- */}
        {activeTab === 'periodization' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl md:text-2xl font-bold font-mono tracking-widest bg-gradient-to-r from-red-400 via-amber-300 to-white bg-clip-text text-transparent uppercase text-center">
                Yearly Periodization Overview
              </h2>
              <div className="w-16 h-0.5 bg-red-650 mx-auto" />
            </div>

            {/* Current status display matching Screenshot 6 */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#EF4444]/5" />
              
              <div className="relative text-center space-y-3 z-10 max-w-sm mx-auto">
                <div className="bg-red-950/80 border border-red-700 rounded-xl px-4 py-5 text-center shadow-lg relative glow-border">
                  <p className="text-xs uppercase tracking-widest font-mono text-red-300">Current Week:</p>
                  <h3 className="text-5xl md:text-6xl font-black text-red-400 font-mono py-1 select-none">
                    {periodizationWeek}
                  </h3>
                  <div className="h-px bg-red-800 w-1/2 mx-auto my-2" />
                  <p className="text-xs font-bold uppercase tracking-wider font-mono text-[#FFF] flex items-center justify-center space-x-1">
                    <span>Active Phase:</span>
                    <span className="text-amber-400">{activePhaseInfo.name}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Slider bar progression map */}
            <div className="bg-[#151D30] border border-[#243254] rounded-2xl p-5 shadow-xl space-y-6">
              
              {/* Colored multi-segment headers represent active phase duration windows */}
              <div className="grid grid-cols-4 gap-1 text-center text-[9px] md:text-xs font-bold font-mono">
                <button 
                  onClick={() => setPeriodizationWeek(6)}
                  className={`p-2 rounded-xl transition ${periodizationWeek <= 12 ? 'bg-red-800 border border-red-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-transparent'}`}
                >
                  <p className="font-extrabold">BASE</p>
                  <p className="text-[8px] font-normal opacity-70">(Weeks 1-12)</p>
                </button>
                <button 
                  onClick={() => setPeriodizationWeek(18)}
                  className={`p-2 rounded-xl transition ${periodizationWeek > 12 && periodizationWeek <= 24 ? 'bg-amber-800 border border-amber-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-transparent'}`}
                >
                  <p className="font-extrabold">BUILD</p>
                  <p className="text-[8px] font-normal opacity-70">(Weeks 13-24)</p>
                </button>
                <button 
                  onClick={() => setPeriodizationWeek(30)}
                  className={`p-2 rounded-xl transition ${periodizationWeek > 24 && periodizationWeek <= 36 ? 'bg-yellow-800 border border-yellow-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-transparent'}`}
                >
                  <p className="font-extrabold">PEAK</p>
                  <p className="text-[8px] font-normal opacity-70">(Weeks 25-36)</p>
                </button>
                <button 
                  onClick={() => setPeriodizationWeek(44)}
                  className={`p-2 rounded-xl transition ${periodizationWeek > 36 ? 'bg-stone-300 border border-white text-stone-950 shadow-md' : 'bg-slate-800 text-slate-400 border border-transparent'}`}
                >
                  <p className="font-extrabold">TAPER</p>
                  <p className="text-[8px] font-normal opacity-70">(Weeks 37-52)</p>
                </button>
              </div>

              {/* Range Slider for progression tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Week 1</span>
                  <span>Week 52</span>
                </div>
                
                {/* Custom glowing slider range bar */}
                <div className="relative flex items-center h-4">
                  <input 
                    type="range"
                    min="1"
                    max="52"
                    step="1"
                    value={periodizationWeek}
                    onChange={(e) => setPeriodizationWeek(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-[#0A0E1A] rounded-lg appearance-none cursor-pointer z-20 outline-none"
                  />
                  {/* Visual glow indicator overlay tracking position */}
                  <div 
                    className="absolute h-2.5 bg-yellow-400 rounded-lg pointer-events-none z-10 shadow-[0_0_12px_rgba(245,158,11,0.8)]" 
                    style={{ width: `${((periodizationWeek - 1) / 51) * 100}%` }}
                  />
                </div>
              </div>

              {/* Selected Phase Detail Narrative */}
              <div className="bg-[#0A0E1A] border border-[#1E2E4E] rounded-xl p-4 space-y-2">
                <h4 className="text-xs md:text-sm font-bold font-mono text-amber-400 flex items-center space-x-1.5">
                  <CalendarDays className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Phase Detail: {activePhaseInfo.detail}</span>
                </h4>
                <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  {activePhaseInfo.focus}
                </p>
              </div>

              {/* Phase Legend Card */}
              <div className="border border-[#243254] rounded-2xl p-5 space-y-3.5 bg-[#0D1321]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Phase Legend</h4>
                
                <div className="grid grid-cols-2 gap-3.5 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-650 rounded border border-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-200">BASE (Weeks 1-12)</p>
                      <p className="text-[10px] text-slate-400">Structural general balance</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-amber-650 rounded border border-amber-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-200">BUILD (Weeks 13-24)</p>
                      <p className="text-[10px] text-slate-400">Hypertrophic density overload</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-yellow-600 rounded border border-yellow-500 flex flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-200">PEAK (Weeks 25-36)</p>
                      <p className="text-[10px] text-slate-400">Maximum motor capacity build</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-stone-300 rounded border border-stone-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700">TAPER (Weeks 37-52)</p>
                      <p className="text-[10px] text-slate-400">Residual recovery / unloading</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- OVERLAY SCREEN: SESSION GOAL CONFIGURATION (SOVIET THEME SCREENSHOT 7) --- */}
      <AnimatePresence>
        {isGoalModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#1C222C] border-2 border-red-700/80 rounded-2xl w-full max-w-lg p-5 md:p-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] space-y-6 relative overflow-hidden"
            >
              {/* Industrial style grunge outline background */}
              <div className="absolute inset-0 bg-[#161B23] opacity-30 pointer-events-none" />
              <div className="absolute top-0 right-0 p-3 z-10">
                <button 
                  onClick={() => setIsGoalModalOpen(false)}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title Header with Constructivist Bold Font */}
              <div className="text-center relative z-10 border-b-2 border-red-700/30 pb-4">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-mono">Athletic Selection Panel</p>
                <h3 className="text-xl md:text-2xl font-black font-mono tracking-wider text-red-400 uppercase">
                  ⭐ Session Goal Configuration ⭐
                </h3>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {GOAL_PRESETS.map((pSet) => (
                  <div 
                    key={pSet.id}
                    onClick={() => {
                      setActivePreset(pSet);
                      triggerToast(`Selected ${pSet.name} schema.`);
                    }}
                    className={`p-4 rounded-xl border-2 transition cursor-pointer relative overflow-hidden ${
                      activePreset.id === pSet.id 
                        ? 'border-red-500 bg-red-950/40 shadow-md' 
                        : 'border-slate-800 bg-[#12161E] hover:border-slate-600'
                    }`}
                  >
                    
                    <div className="flex justify-between items-center relative z-10">
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-red-400 uppercase tracking-widest flex items-center space-x-1">
                          <span className="h-1.5 w-1.5 bg-red-500 rounded-full inline-block mr-1" />
                          <span>{pSet.name} ({pSet.transliteration})</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono font-normal">
                          {pSet.focus}
                        </p>
                      </div>

                      {/* Active Radio bubble */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activePreset.id === pSet.id ? 'border-red-500' : 'border-slate-700'}`}>
                        {activePreset.id === pSet.id && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      </div>
                    </div>

                    {/* Simple Custom 'W' / Pyramid Scheme Mini Visualiser */}
                    <div className="mt-3 bg-slate-950/50 p-2 rounded border border-slate-900 flex justify-between items-center text-[9px] font-mono">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[#A1A1AA] uppercase">W-Scheme:</span>
                        <div className="flex space-x-1 items-end h-5">
                          {pSet.repsScheme.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="w-1.5 bg-red-650 rounded-t" 
                              style={{ height: `${(item.reps / 20) * 100}%`, minHeight: '4px' }} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="divide-x divide-slate-800 flex space-x-1.5 text-slate-400">
                        {pSet.repsScheme.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="pl-1">
                            {item.reps}R@{item.intensity}%
                          </span>
                        ))}
                        <span className="pl-1 text-slate-500">...</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Constructivist Soviet Bold Bottom Apply Action */}
              <button 
                onClick={() => handleApplyPreset(activePreset)}
                className="w-full py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-extrabold font-mono tracking-widest text-center rounded-xl border border-red-500 shadow-[0_4px_15px_rgba(220,38,38,0.4)] active:scale-[0.98] transition flex items-center justify-center space-x-2 text-sm md:text-base uppercase"
              >
                <span>APPLY TO SESSION 🛠️</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM MOBILE-STYLE NAV FOOTER BAR --- */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0E1726]/95 border-t border-[#1E293B] z-45">
        <div className="max-w-md mx-auto px-4 py-2.5 flex justify-between items-center">
          
          <button 
            id="nav-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded transition text-center flex-1 ${
              activeTab === 'tracker' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px] font-mono font-semibold tracking-wider">Tracker</span>
          </button>

          <button 
            id="nav-builder"
            onClick={() => setActiveTab('builder')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded transition text-center flex-1 ${
              activeTab === 'builder' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] font-mono font-semibold tracking-wider">Builder</span>
          </button>

          <button 
            id="nav-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded transition text-center flex-1 ${
              activeTab === 'analytics' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-mono font-semibold tracking-wider">Stats</span>
          </button>

          <button 
            id="nav-science"
            onClick={() => setActiveTab('science')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded transition text-center flex-1 ${
              activeTab === 'science' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-mono font-semibold tracking-wider">Science</span>
          </button>

          <button 
            id="nav-periodization"
            onClick={() => setActiveTab('periodization')}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded transition text-center flex-1 ${
              activeTab === 'periodization' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-mono font-semibold tracking-wider">Period</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
