// Core data models for the Gym & Workout Tracker.
// Modeled on the reference "Gym Workout Tracker.xlsx" (Settings, Session Log,
// Dashboard, PB Tracker sheets).

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Cardio',
  'Full Body',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export interface Session {
  id: string;
  date: string; // ISO date string (yyyy-mm-dd)
  muscleGroup: MuscleGroup;
  workoutName: string;
  completed: boolean;
  sets: number;
  repsOrTime: string;
  weight: number; // kg
  notes: string;
}

export type PBUnit = 'kg' | 'reps' | 'mins';

export interface PersonalBest {
  id: string;
  exercise: string;
  startingWeight: number;
  currentPB: number;
  dateSet: string; // ISO date string
  target: number;
  unit: PBUnit;
}

export interface Settings {
  name: string;
  weeklyGoal: number; // days per week
  bodyWeight: number; // kg
}

export interface GymLevel {
  name: string;
  min: number; // inclusive lower bound of total sessions
  max: number | null; // inclusive upper bound, null = open ended
}

// Fixed level ladder taken straight from the spreadsheet's "GYM LEVELS" block.
export const GYM_LEVELS: GymLevel[] = [
  { name: 'Beginner', min: 0, max: 49 },
  { name: 'Regular', min: 50, max: 99 },
  { name: 'Dedicated', min: 100, max: 199 },
  { name: 'Beast', min: 200, max: 299 },
  { name: 'Elite', min: 300, max: null },
];

export interface AppData {
  settings: Settings;
  sessions: Session[];
  personalBests: PersonalBest[];
}
