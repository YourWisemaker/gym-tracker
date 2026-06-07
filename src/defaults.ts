import { AppData, PersonalBest } from './types';

// Seed personal-best lifts pulled from the spreadsheet's PB Tracker tab.
const seedPBs: Omit<PersonalBest, 'id'>[] = [
  { exercise: 'Bench Press', startingWeight: 40, currentPB: 40, target: 80, dateSet: '', unit: 'kg' },
  { exercise: 'Squat', startingWeight: 50, currentPB: 50, target: 100, dateSet: '', unit: 'kg' },
  { exercise: 'Deadlift', startingWeight: 60, currentPB: 60, target: 140, dateSet: '', unit: 'kg' },
  { exercise: 'Overhead Press', startingWeight: 25, currentPB: 25, target: 50, dateSet: '', unit: 'kg' },
  { exercise: 'Barbell Row', startingWeight: 30, currentPB: 30, target: 70, dateSet: '', unit: 'kg' },
  { exercise: 'Pull-Ups', startingWeight: 0, currentPB: 0, target: 15, dateSet: '', unit: 'reps' },
  { exercise: 'Dumbbell Curl', startingWeight: 8, currentPB: 8, target: 20, dateSet: '', unit: 'kg' },
  { exercise: 'Tricep Dips', startingWeight: 0, currentPB: 0, target: 20, dateSet: '', unit: 'reps' },
  { exercise: 'Leg Press', startingWeight: 80, currentPB: 80, target: 200, dateSet: '', unit: 'kg' },
  { exercise: 'Romanian Deadlift', startingWeight: 40, currentPB: 40, target: 100, dateSet: '', unit: 'kg' },
  { exercise: 'Lat Pulldown', startingWeight: 35, currentPB: 35, target: 75, dateSet: '', unit: 'kg' },
  { exercise: 'Cable Row', startingWeight: 35, currentPB: 35, target: 75, dateSet: '', unit: 'kg' },
  { exercise: 'Running 5K', startingWeight: 35, currentPB: 35, target: 22, dateSet: '', unit: 'mins' },
];

export function createDefaultData(): AppData {
  return {
    settings: {
      name: 'Athlete',
      weeklyGoal: 4,
      bodyWeight: 80,
    },
    sessions: [],
    personalBests: seedPBs.map((pb, i) => ({ ...pb, id: `seed-pb-${i}` })),
  };
}
