import { useTimerStore } from "@/stores";
import { useState } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { Timer } from "./Timer";
import styles from "@/styles/Timer.module.css";

export default function Control() {
  const start = useTimerStore((s) => s.start);
  const stop = useTimerStore((s) => s.stop);
  const reset = useTimerStore((s) => s.reset);
  const isRunning = useTimerStore((s) => s.isRunning);
  const [minutes, setMinutes] = useState(5);

  const handleReset = () => {
    if (confirm("¿Seguro que quieres reiniciar el temporizador?")) {
      reset();
    }
  };

  return (
    <div className={styles.timerControl}>
      <Timer />
      <button
        className={styles.startButton}
        onClick={() => start()}
        disabled={isRunning}
      >
        <FaPlay />
      </button>
      <button
        className={styles.stopButton}
        onClick={() => stop()}
        disabled={!isRunning}
      >
        <FaPause />
      </button>
      <button className={styles.resetButton} onClick={handleReset}>
        <FaRedo />
      </button>

      {!isRunning && (
        <div>
          <label>
            Minutes:
            <input
              type="number"
              value={minutes}
              className={styles.minuteInput}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
              min={0}
            />
          </label>
          <button
            className={styles.configureButton}
            onClick={() => {
              const seconds = minutes * 60;
              useTimerStore.getState().setInitial(seconds);
            }}
          >
            Configurar
          </button>
        </div>
      )}
    </div>
  );
}
