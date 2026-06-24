import { Exercise, ExercisePB, GoalPreset, PlanPhase } from './types';

export const EXERCISE_DICTIONARY: { category: string; exercises: string[] }[] = [
  {
    category: 'Upper Body',
    exercises: [
      'Bench and chest press + variations',
      'Incline/decline press + variations',
      'Flys + variations',
      'Bent-over row + variations',
      'Lat pulldown + variations',
      'Shoulder press + variations',
      'Pull-up/chin-up',
      'Dip',
      'Push-up'
    ]
  },
  {
    category: 'Lower Body',
    exercises: [
      'Back squat / Front squat',
      'Romanian deadlift / Conventional deadlift',
      'Leg press / Hack squat',
      'Seated leg curl / Lying leg curl',
      'Leg extensions',
      'Calf raises (seated/standing)',
      'Glute bridges / Hip thrusts',
      'Lunges / Split squats'
    ]
  },
  {
    category: 'Trunk or Core',
    exercises: [
      'Plank variations (forearm, side)',
      'Hanging leg raises / Knee raises',
      'Cable woodchoppers',
      'Ab wheel rollouts',
      'Russian twists with weight',
      'Decline sit-ups'
    ]
  },
  {
    category: 'Total Body',
    exercises: [
      'Clean and jerk',
      'Barbell snatch',
      'Kettlebell swings',
      'Dumbbell thrusters',
      'Power cleans'
    ]
  }
];

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: 'endurance',
    name: 'ENDURANCE',
    transliteration: 'ВЫНОСЛИВОСТЬ',
    repsScheme: [
      { reps: 20, intensity: 50 },
      { reps: 15, intensity: 55 },
      { reps: 12, intensity: 60 },
      { reps: 10, intensity: 65 },
      { reps: 8, intensity: 70 }
    ],
    focus: 'Focus: High Volume, Low Intensity',
    bgStyle: 'bg-gradient-to-br from-red-950 to-red-900 border-red-700 hover:border-red-500 shadow-red-950/50',
    accentColor: '#DC2626',
    textColor: 'text-red-100'
  },
  {
    id: 'hypertrophy',
    name: 'HYPERTROPHY',
    transliteration: 'ГИПЕРТРОФИЯ',
    repsScheme: [
      { reps: 12, intensity: 65 },
      { reps: 10, intensity: 70 },
      { reps: 8, intensity: 75 },
      { reps: 6, intensity: 80 }
    ],
    focus: 'Focus: Moderate Volume, Hypertrophic Tension',
    bgStyle: 'bg-gradient-to-br from-stone-900 to-amber-950/40 border-amber-800/40 hover:border-amber-600/60 shadow-amber-950/20',
    accentColor: '#B45309',
    textColor: 'text-amber-100'
  },
  {
    id: 'strength',
    name: 'STRENGTH',
    transliteration: 'СИЛА',
    repsScheme: [
      { reps: 5, intensity: 85 },
      { reps: 3, intensity: 90 },
      { reps: 2, intensity: 92 },
      { reps: 1, intensity: 95 }
    ],
    focus: 'Focus: Neuromuscular Recruitment & Max Load',
    bgStyle: 'bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 border-zinc-700/80 hover:border-zinc-500 shadow-zinc-950/40',
    accentColor: '#A1A1AA',
    textColor: 'text-zinc-100'
  },
  {
    id: 'power',
    name: 'POWER',
    transliteration: 'МОЩНОСТЬ',
    repsScheme: [
      { reps: 3, intensity: 80 },
      { reps: 2, intensity: 85 },
      { reps: 1, intensity: 90 },
      { reps: 1, intensity: 95 }
    ],
    focus: 'Focus: Velocity Focus & Peak Power Output',
    bgStyle: 'bg-gradient-to-br from-sky-950/80 to-zinc-900 border-sky-800/80 hover:border-sky-500 shadow-sky-950/50',
    accentColor: '#0EA5E9',
    textColor: 'text-sky-100'
  },
  {
    id: 'double_ladder',
    name: 'DOUBLE LADDER',
    transliteration: 'ДВОЙНАЯ ЛЕСТНИЦА',
    repsScheme: [
      { reps: 5, intensity: 75 },
      { reps: 4, intensity: 75 },
      { reps: 3, intensity: 75 },
      { reps: 2, intensity: 75 },
      { reps: 1, intensity: 75 },
      { reps: 2, intensity: 75 },
      { reps: 3, intensity: 75 },
      { reps: 4, intensity: 75 },
      { reps: 5, intensity: 75 },
      { reps: 4, intensity: 75 },
      { reps: 3, intensity: 75 },
      { reps: 2, intensity: 75 },
      { reps: 1, intensity: 75 },
      { reps: 2, intensity: 75 },
      { reps: 3, intensity: 75 },
      { reps: 4, intensity: 75 },
      { reps: 5, intensity: 75 }
    ],
    focus: 'Focus: Density Training / Double-Ladder W-Sequence (57 Reps)',
    bgStyle: 'bg-gradient-to-br from-red-950 via-slate-900 to-red-950 border-red-750 hover:border-red-500 shadow-red-950/50',
    accentColor: '#EF4444',
    textColor: 'text-red-100'
  }
];

export const INITIAL_PBS: ExercisePB[] = [];

// Historical progressive 1RM data mapped for each muscle selector region. 
// Values denote weeks 0, 5, 10, 15, 20 (as shown in Screenshot 1 & 3)
export const MUSCLE_REGIONS_HISTORY: Record<string, { label: string; lineData: number[] }> = {
  Hamstrings: {
    label: 'Hamstrings 1RM Progress',
    lineData: [150, 180, 210, 225, 275, 315] // Nov, Dec, Jan, Feb, Mar, Apr
  },
  Gluteus: {
    label: 'Gluteus Max 1RM Progress',
    lineData: [180, 210, 240, 280, 310, 350]
  },
  Quads: {
    label: 'Quadriceps 1RM Progress',
    lineData: [220, 240, 270, 310, 350, 405]
  },
  Calf: {
    label: 'Gastrocnemius (Calves) Press Progress',
    lineData: [80, 95, 110, 115, 130, 145]
  },
  Hip: {
    label: 'Hip Abductors Progressive Load',
    lineData: [110, 125, 140, 150, 175, 190]
  },
  Groin: {
    label: 'Groin/Adductors Progressive Load',
    lineData: [90, 105, 115, 130, 140, 155]
  },
  Chest: {
    label: 'Pectoralis Major 1RM Progress',
    lineData: [185, 205, 225, 245, 280, 315]
  },
  Shoulder: {
    label: 'Deltoid Press 1RM Progress',
    lineData: [115, 130, 145, 155, 170, 185]
  },
  Back: {
    label: 'Latissimus Dorsi 1RM Progress',
    lineData: [140, 160, 175, 195, 210, 230]
  }
};

export const TRAINING_RULES = {
  me: { goal: 'Muscular Endurance', load: '60%', reps: '12+', sets: '2-3', rest: '<30s' },
  ht: { goal: 'Hypertrophy', load: '70-85%', reps: '6-12', sets: '3-6', rest: '30-90s' },
  ms: { goal: 'Muscular Strength', load: '85-100%', reps: '<6', sets: '2-6', rest: '2-5m' },
  pr: { goal: 'Power (Repeat)', load: '90%', reps: '3-5', sets: '3-5', rest: '2-5m' },
  ps: { goal: 'Power (Single)', load: '80%', reps: '1-2', sets: '3-5', rest: '2-5m' }
};

export const ANNUAl_PHASES: PlanPhase[] = [
  { name: 'BASE', weeks: 'Weeks 1-12', focus: 'High vol, low int, general strength', color: 'bg-red-600 border-red-500 text-red-100', activeWeeks: [1, 12] },
  { name: 'BUILD', weeks: 'Weeks 13-24', focus: 'Mod-high vol, high int, specific strength', color: 'bg-amber-600 border-amber-500 text-amber-100', activeWeeks: [13, 24] },
  { name: 'PEAK', weeks: 'Weeks 25-36', focus: 'Low vol, high int, high skill', color: 'bg-amber-500 border-amber-400 text-amber-100', activeWeeks: [25, 36] },
  { name: 'TAPER', weeks: 'Weeks 37-52', focus: 'Peak skill, low vol, operations / recovery', color: 'bg-stone-200 border-stone-300 text-stone-800', activeWeeks: [37, 52] }
];
