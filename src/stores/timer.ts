import { create } from "zustand";
import { syncTabs } from "zustand-sync-tabs";

const INSTANCE_ID =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Math.random()}-${Date.now()}`;

type TimerState = {
  remaining: number;
  initial: number;
  isRunning: boolean;
  lastUpdated: number; // ms epoch
  _from?: string; // para ignorar ecos locales

  start: (seconds?: number) => void;
  stop: () => void;
  reset: () => void;
  tick: () => void;
  setInitial: (seconds: number) => void;
  sync: (state: Partial<TimerState>) => void;
};

export const useTimerStore = create<TimerState>()(
  syncTabs(
    (set, get) => ({
      remaining: 5 * 60,
      initial: 5 * 60,
      isRunning: false,
      lastUpdated: Date.now(),
      _from: INSTANCE_ID,

      start: (seconds) =>
        set((s) => {
          const now = Date.now();
          const initial = typeof seconds === "number" ? seconds : s.initial;
          const remaining = typeof seconds === "number" ? seconds : s.remaining;
          return {
            isRunning: true,
            initial,
            remaining,
            lastUpdated: now,
            _from: INSTANCE_ID,
          };
        }),

      stop: () =>
        set((s) => ({
          ...s,
          isRunning: false,
          lastUpdated: Date.now(),
          _from: INSTANCE_ID,
        })),

      reset: () =>
        set((s) => ({
          ...s,
          isRunning: false,
          remaining: s.initial,
          lastUpdated: Date.now(),
          _from: INSTANCE_ID,
        })),

      // Idempotente y corrige drift entre pestañas/pausas
      tick: () =>
        set((s) => {
          if (!s.isRunning) return s;

          const now = Date.now();
          const elapsedMs = now - s.lastUpdated;

          // Si no alcanzó 1 segundo, no toques lastUpdated.
          if (elapsedMs < 1000) return s;

          const steps = Math.floor(elapsedMs / 1000); // segundos completos
          const nextRemaining = Math.max(0, s.remaining - steps);

          return {
            ...s,
            remaining: nextRemaining,
            isRunning: nextRemaining > 0 && s.isRunning,
            // Avanza lastUpdated por múltiplos exactos de 1s para conservar la "fracción" restante.
            lastUpdated: s.lastUpdated + steps * 1000,
            _from: s._from, // si usas INSTANCE_ID, mantenlo
          };
        }),

      setInitial: (seconds) =>
        set((s) => ({
          ...s,
          initial: seconds,
          remaining: seconds,
          lastUpdated: Date.now(),
          _from: INSTANCE_ID,
        })),

      // Acepta solo estados más nuevos y que vengan de otra pestaña
      sync: (incoming) =>
        set((s) => {
          if (incoming._from === INSTANCE_ID) return s; // eco local
          if (
            typeof incoming.lastUpdated === "number" &&
            incoming.lastUpdated <= s.lastUpdated
          ) {
            return s; // viejo o igual
          }
          return { ...s, ...incoming };
        }),
    }),
    {
      name: "timer-store",
    },
  ),
);
