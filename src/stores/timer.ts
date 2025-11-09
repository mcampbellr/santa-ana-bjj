import { create } from "zustand";
import { syncTabs } from "zustand-sync-tabs";

type TimerState = {
  remaining: number;
  initial: number;
  isRunning: boolean;
  lastUpdated: number; // for drift correction between tabs

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

      start: (seconds) =>
        set((s) => {
          const initial = typeof seconds === "number" ? seconds : s.initial;
          return {
            isRunning: true,
            initial,
            remaining: typeof seconds === "number" ? seconds : s.remaining,
            lastUpdated: Date.now(),
          };
        }),

      stop: () => set({ isRunning: false, lastUpdated: Date.now() }),

      reset: () =>
        set((s) => ({
          isRunning: false,
          remaining: s.initial,
          lastUpdated: Date.now(),
        })),

      tick: () => {
        const { remaining, stop } = get();
        if (remaining <= 0) {
          stop();
          return;
        }
        set({ remaining: remaining - 1, lastUpdated: Date.now() });
      },

      setInitial: (seconds) =>
        set({ initial: seconds, remaining: seconds, lastUpdated: Date.now() }),

      sync: (incoming) => set(incoming),
    }),
    {
      name: "timer-store", // key in localStorage
    },
  ),
);
