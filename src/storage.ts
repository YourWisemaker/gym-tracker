import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from './types';
import { createDefaultData } from './defaults';

const STORAGE_KEY = 'gym-tracker:data:v1';

export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    const fallback = createDefaultData();
    // Merge defensively so missing fields from older saves don't crash the UI.
    return {
      settings: { ...fallback.settings, ...(parsed.settings ?? {}) },
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : fallback.sessions,
      personalBests: Array.isArray(parsed.personalBests)
        ? parsed.personalBests
        : fallback.personalBests,
    };
  } catch (e) {
    return createDefaultData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Persistence is best-effort; the in-memory state remains the source of truth.
  }
}
