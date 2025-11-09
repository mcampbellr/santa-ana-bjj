import FighterControl from "@/components/FighterControl";
import TimerControl from "@/components/TimerControl";
import styles from "@/styles/Fighter.module.css";
import { useAppStore } from "@/stores";

export default function Control() {
  const { reset } = useAppStore();

  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas resetear el combate?")) {
      reset();
    }
  };

  return (
    <div>
      <TimerControl />
      <FighterControl fighterId={1} />
      <FighterControl fighterId={2} />
      <button
        className={styles.resetButton}
        onClick={handleReset}>Resetear Peleadores y puntaje</button>
    </div>
  );
}
