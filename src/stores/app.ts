import { create } from "zustand";
import { syncTabs } from "zustand-sync-tabs";

interface Fighter {
  name: string;
  score: number;
  penalties: number;
  advantages: number;
}

type FighterId = 1 | 2;
type NumKey = "score" | "penalties" | "advantages";

type AppState = {
  fighter1: Fighter;
  fighter2: Fighter;

  // Nombres
  setFighterName: (id: FighterId, name: string) => void;

  // Sumar / restar (todo)
  addPoints: (id: FighterId, by?: number) => void;
  removePoints: (id: FighterId, by?: number) => void;

  addPenalty: (id: FighterId, by?: number) => void;
  removePenalty: (id: FighterId, by?: number) => void;

  addAdvantage: (id: FighterId, by?: number) => void;
  removeAdvantage: (id: FighterId, by?: number) => void;

  // Utilidades
  setValues: (id: FighterId, values: Partial<Omit<Fighter, "name">>) => void;
  reset: () => void;
};

const emptyFighter = (name: string): Fighter => ({
  name,
  score: 0,
  penalties: 0,
  advantages: 0,
});

export const useAppStore = create<AppState>()(
  syncTabs(
    (set) => {
      // Helpers internos para no repetir código
      const adjust = (id: FighterId, key: NumKey, delta: number) =>
        set((s) => {
          const k = `fighter${id}` as const;
          const curr = s[k][key];
          const next = Math.max(0, curr + delta); // nunca negativo
          return { [k]: { ...s[k], [key]: next } } as any;
        });

      const setName = (id: FighterId, name: string) =>
        set((s) => {
          const k = `fighter${id}` as const;
          return { [k]: { ...s[k], name } } as any;
        });

      const setPartial = (
        id: FighterId,
        values: Partial<Omit<Fighter, "name">>,
      ) =>
        set((s) => {
          const k = `fighter${id}` as const;
          const v = {
            ...values,
            // clamp a 0 lo que venga numérico
            ...(values.score !== undefined && {
              score: Math.max(0, values.score),
            }),
            ...(values.penalties !== undefined && {
              penalties: Math.max(0, values.penalties),
            }),
            ...(values.advantages !== undefined && {
              advantages: Math.max(0, values.advantages),
            }),
          };
          return { [k]: { ...s[k], ...v } } as any;
        });

      return {
        fighter1: emptyFighter("Fighter 1"),
        fighter2: emptyFighter("Fighter 2"),

        // Nombres
        setFighterName: setName,

        // Puntos
        addPoints: (id, by = 1) => adjust(id, "score", +by),
        removePoints: (id, by = 1) => adjust(id, "score", -Math.abs(by)),

        // Penalidades
        addPenalty: (id, by = 1) => adjust(id, "penalties", +by),
        removePenalty: (id, by = 1) => adjust(id, "penalties", -Math.abs(by)),

        // Ventajas
        addAdvantage: (id, by = 1) => adjust(id, "advantages", +by),
        removeAdvantage: (id, by = 1) =>
          adjust(id, "advantages", -Math.abs(by)),

        // Utilidades
        setValues: setPartial,
        reset: () =>
          set({
            fighter1: emptyFighter("Fighter 1"),
            fighter2: emptyFighter("Fighter 2"),
          }),
      };
    },
    { name: "app-store" }, // localStorage key + sync tabs
  ),
);
