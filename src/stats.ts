import { GYM_LEVELS, GymLevel, MuscleGroup, PersonalBest, Session } from './types';

// ---- date helpers -------------------------------------------------------

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

function startOfWeek(d: Date): Date {
  // Week starts Monday.
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  date.setDate(date.getDate() - day);
  return date;
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / 86400000);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ---- core stats ---------------------------------------------------------

export function completedSessions(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.completed);
}

export function totalSessions(sessions: Session[]): number {
  return completedSessions(sessions).length;
}

export function sessionsThisMonth(sessions: Session[], now = new Date()): number {
  return completedSessions(sessions).filter((s) => {
    const d = parseDateKey(s.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
}

export function sessionsThisWeek(sessions: Session[], now = new Date()): number {
  const ws = startOfWeek(now);
  return completedSessions(sessions).filter((s) => parseDateKey(s.date) >= ws).length;
}

// Streak = number of consecutive days (ending today or yesterday) that have at
// least one completed session.
export function dayStreak(sessions: Session[], now = new Date()): number {
  const days = new Set(completedSessions(sessions).map((s) => s.date));
  if (days.size === 0) return 0;

  let cursor = startOfDay(now);
  // Allow the streak to count even if today hasn't been logged yet.
  if (!days.has(toDateKey(cursor))) {
    cursor = new Date(cursor.getTime() - 86400000);
    if (!days.has(toDateKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(toDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return streak;
}

export function currentLevel(total: number): GymLevel {
  return (
    GYM_LEVELS.find((l) => total >= l.min && (l.max === null || total <= l.max)) ??
    GYM_LEVELS[GYM_LEVELS.length - 1]
  );
}

export function sessionsToNextLevel(total: number): number | null {
  const idx = GYM_LEVELS.findIndex(
    (l) => total >= l.min && (l.max === null || total <= l.max)
  );
  if (idx < 0 || idx === GYM_LEVELS.length - 1) return null;
  return GYM_LEVELS[idx + 1].min - total;
}

// Average completed sessions per week since the first logged session.
export function weeklyAverage(sessions: Session[], now = new Date()): number {
  const done = completedSessions(sessions);
  if (done.length === 0) return 0;
  const first = done.reduce((min, s) => {
    const d = parseDateKey(s.date);
    return d < min ? d : min;
  }, parseDateKey(done[0].date));
  const weeks = Math.max(1, Math.ceil((daysBetween(first, now) + 1) / 7));
  return done.length / weeks;
}

export function sessionsByMuscleGroup(
  sessions: Session[]
): Record<MuscleGroup, number> {
  const out = {} as Record<MuscleGroup, number>;
  for (const s of completedSessions(sessions)) {
    out[s.muscleGroup] = (out[s.muscleGroup] ?? 0) + 1;
  }
  return out;
}

// Completed sessions per week for the last `weeks` weeks (oldest first).
export function weeklyTrend(
  sessions: Session[],
  weeks = 8,
  now = new Date()
): { label: string; count: number; weekStart: Date }[] {
  const done = completedSessions(sessions);
  const thisWeekStart = startOfWeek(now);
  const result: { label: string; count: number; weekStart: Date }[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const ws = new Date(thisWeekStart.getTime() - i * 7 * 86400000);
    const we = new Date(ws.getTime() + 7 * 86400000);
    const count = done.filter((s) => {
      const d = parseDateKey(s.date);
      return d >= ws && d < we;
    }).length;
    const label = `${ws.getDate()}/${ws.getMonth() + 1}`;
    result.push({ label, count, weekStart: ws });
  }
  return result;
}

export function pbImprovement(pb: PersonalBest): number {
  return pb.currentPB - pb.startingWeight;
}

// "Top" PBs ranked by progress toward target (descending), used on the dashboard.
export function topPersonalBests(pbs: PersonalBest[], n = 4): PersonalBest[] {
  return [...pbs]
    .filter((p) => p.currentPB > 0 || p.startingWeight > 0)
    .sort((a, b) => Math.abs(pbImprovement(b)) - Math.abs(pbImprovement(a)))
    .slice(0, n);
}
