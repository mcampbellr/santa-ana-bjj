import { useAppStore } from "@/stores";
import styles from "@/styles/Fighter.module.css";

interface Props {
  fighterId: 1 | 2;
}

export default function Fighter({ fighterId }: Props) {
  const { fighter1, fighter2 } = useAppStore();

  const fighter = fighterId === 1 ? fighter1 : fighter2;

  return (
    <div
      className={`${styles.fighter} ${fighterId === 1 ? styles.fighter1 : styles.fighter2}`}
    >
      <div className={styles.name}>
        <h2>{fighter.name}</h2>
      </div>
      <div className={styles.details}>
        <p className={styles.penalties}>{fighter.penalties}</p>
        <p className={styles.advantages}>{fighter.advantages}</p>
      </div>
      <div className={styles.score}>{fighter.score}</div>
    </div>
  );
}
