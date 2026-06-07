import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppData, PersonalBest, Session, Settings } from './types';
import { loadData, saveData } from './storage';
import { createDefaultData } from './defaults';

interface StoreValue {
  data: AppData;
  ready: boolean;
  // sessions
  addSession: (s: Omit<Session, 'id'>) => void;
  updateSession: (id: string, patch: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  // personal bests
  addPB: (pb: Omit<PersonalBest, 'id'>) => void;
  updatePB: (id: string, patch: Partial<PersonalBest>) => void;
  deletePB: (id: string) => void;
  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(createDefaultData);
  const [ready, setReady] = useState(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setReady(true);
    });
  }, []);

  // Persist on every change once the initial load has completed.
  useEffect(() => {
    if (!ready) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    saveData(data);
  }, [data, ready]);

  const addSession = useCallback((s: Omit<Session, 'id'>) => {
    setData((d) => ({ ...d, sessions: [{ ...s, id: uid('s') }, ...d.sessions] }));
  }, []);

  const updateSession = useCallback((id: string, patch: Partial<Session>) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setData((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) }));
  }, []);

  const addPB = useCallback((pb: Omit<PersonalBest, 'id'>) => {
    setData((d) => ({ ...d, personalBests: [...d.personalBests, { ...pb, id: uid('pb') }] }));
  }, []);

  const updatePB = useCallback((id: string, patch: Partial<PersonalBest>) => {
    setData((d) => ({
      ...d,
      personalBests: d.personalBests.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deletePB = useCallback((id: string) => {
    setData((d) => ({ ...d, personalBests: d.personalBests.filter((p) => p.id !== id) }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const resetAll = useCallback(() => {
    setData(createDefaultData());
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      ready,
      addSession,
      updateSession,
      deleteSession,
      addPB,
      updatePB,
      deletePB,
      updateSettings,
      resetAll,
    }),
    [
      data,
      ready,
      addSession,
      updateSession,
      deleteSession,
      addPB,
      updatePB,
      deletePB,
      updateSettings,
      resetAll,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
