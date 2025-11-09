import { useEffect } from "react";
import { useTimerStore } from "@/stores";
import styles from "@/styles/Timer.module.css";

function format(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const Timer = () => {
  const remaining = useTimerStore((s) => s.remaining);
  const isRunning = useTimerStore((s) => s.isRunning);
  const tick = useTimerStore((s) => s.tick);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  return (
    <>
      {remaining <= 0 ? (
        <div className={styles.timer}>TIEMPO!</div>
      ) : (
        <div className={styles.timer}>{format(remaining)}</div>
      )}
    </>
  );
};
