# Gym & Workout Tracker 📱

A mobile app for tracking gym sessions, personal bests and progress. Built with
[Expo](https://expo.dev) (SDK 56) and React Native. The data model and features
are modeled directly on the reference `Gym Workout Tracker.xlsx` spreadsheet
(Settings, Session Log, Dashboard and PB Tracker tabs).

## Features

- **Dashboard** — total sessions, sessions this month, day streak, weekly
  average, weekly goal progress, an 8-week training-volume chart, sessions
  broken down by muscle group, and your top personal bests.
- **Session Log** — log each workout (date, muscle group, name, sets,
  reps/time, weight, notes, completed?). Grouped by day, tap any entry to edit
  or delete.
- **PB Tracker** — track lifts with starting weight, current PB, target and
  progress bars. Supports `kg`, `reps` and time-based goals (e.g. 5K run, where
  lower is better). Seeded with the lifts from the spreadsheet.
- **Settings** — name, weekly gym goal, body weight, and the full Gym Levels
  ladder (Beginner → Regular → Dedicated → Beast → Elite) with your current
  level highlighted. Includes a full data reset.

All data is stored locally on the device via `AsyncStorage` — no account or
network connection required.

## Getting started

```bash
npm install
npm start
```

Then scan the QR code with the **Expo Go** app on your phone, or press `i` /
`a` to open an iOS simulator / Android emulator.

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` | Open in the iOS simulator |
| `npm run android` | Open in the Android emulator |
| `npx tsc --noEmit` | Type-check the project |

## Project structure

```
App.tsx                  # Root: providers + tab navigation
src/
  types.ts               # Data models, muscle groups, gym levels
  defaults.ts            # Seed data (default settings + PB lifts)
  theme.ts               # Design tokens (colors, spacing, fonts)
  storage.ts             # AsyncStorage load/save
  store.tsx              # React context state store + actions
  stats.ts               # Stat calculations (streaks, levels, trends...)
  components/            # Reusable UI (cards, buttons, chips, tab bar)
  screens/               # Dashboard, Session Log, PB Tracker, Settings
```

## Tech

- Expo SDK 56 / React Native 0.85 / React 19
- TypeScript
- `@react-native-async-storage/async-storage` for persistence
- `react-native-safe-area-context` for safe-area handling
