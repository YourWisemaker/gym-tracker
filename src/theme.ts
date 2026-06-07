// Centralized design tokens for a dark, energetic "gym" aesthetic.
export const theme = {
  colors: {
    bg: '#0E0F13',
    surface: '#171922',
    surfaceAlt: '#1F2230',
    border: '#2A2E3D',
    text: '#F4F6FB',
    textMuted: '#9AA3B2',
    textFaint: '#646C7D',
    primary: '#4ADE80', // lime green accent
    primaryDark: '#22C55E',
    accent: '#38BDF8', // sky blue
    warn: '#FBBF24',
    danger: '#F87171',
    track: '#262A38',
    // Per-muscle-group accent colors used across charts and tags.
    groupColors: {
      Chest: '#F87171',
      Back: '#38BDF8',
      Shoulders: '#FBBF24',
      Arms: '#A78BFA',
      Legs: '#4ADE80',
      Core: '#FB923C',
      Cardio: '#F472B6',
      'Full Body': '#2DD4BF',
    } as Record<string, string>,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  spacing: (n: number) => n * 4,
  font: {
    h1: 30,
    h2: 22,
    h3: 18,
    body: 15,
    small: 13,
    tiny: 11,
  },
};

export type Theme = typeof theme;
