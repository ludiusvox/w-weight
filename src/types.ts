export type ActiveTab = 'tracker' | 'builder' | 'analytics' | 'science' | 'periodization';

export interface Exercise {
  id: string;
  name: string;
  category: 'Upper Body' | 'Lower Body' | 'Trunk or Core' | 'Total Body';
  description?: string;
}

export interface SetLog {
  id: string;
  timestamp: string;
  exerciseId: string;
  weight: number;
  reps: number;
  goalReps?: number;
  intensityPercent?: number; // % of 1RM
  rungIndex?: number;
  stopwatchTimeStr?: string;
}

export interface ExercisePB {
  exerciseId: string;
  name: string;
  category: string;
  weight: number;
  variation: string;
  date: string;
}

export interface PlanPhase {
  name: string;
  weeks: string;
  focus: string;
  color: string;
  activeWeeks: [number, number]; // e.g. [1, 12]
}

export type GoalPresetId = 'endurance' | 'hypertrophy' | 'strength' | 'power' | 'double_ladder';

export interface GoalPreset {
  id: GoalPresetId;
  name: string;
  transliteration: string; // e.g. ВЫНОСЛИВОСТЬ
  repsScheme: { reps: number; intensity: number }[];
  focus: string;
  bgStyle: string;
  accentColor: string;
  textColor: string;
}
