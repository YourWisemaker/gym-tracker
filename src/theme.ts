// Centralized design tokens for a focused, high-contrast gym aesthetic.
export const theme = {
  colors: {
    bg: '#101112',
    surface: '#181A1E',
    surfaceAlt: '#22252B',
    elevated: '#24272E',
    border: '#343A43',
    text: '#F7F3EA',
    textMuted: '#B7BEC8',
    textFaint: '#7E8794',
    primary: '#B8F24B',
    primaryDark: '#8DCC32',
    accent: '#4CC9F0',
    warn: '#FFD166',
    danger: '#FF6B6B',
    track: '#2B3038',
    // Per-muscle-group accent colors used across charts and tags.
    groupColors: {
      Chest: '#FF6B6B',
      Back: '#4CC9F0',
      Shoulders: '#FFD166',
      Arms: '#B794F4',
      Legs: '#B8F24B',
      Core: '#FF9F1C',
      Cardio: '#FF7AC8',
      'Full Body': '#2EC4B6',
    } as Record<string, string>,
  },
  radius: {
    sm: 8,
    md: 8,
    lg: 20,
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
