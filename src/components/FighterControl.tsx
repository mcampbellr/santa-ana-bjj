import { useAppStore } from "@/stores";
import styles from "@/styles/Fighter.module.css";

interface Props {
  fighterId: 1 | 2;
}

export default function Fighter({ fighterId }: Props) {
  // Selecciona SOLO el fighter necesario, con comparación superficial
  const fighter = useAppStore((s) =>
    fighterId === 1 ? s.fighter1 : s.fighter2,
  );

  // Acciones por separado (referencias estables)
  const setFighterName = useAppStore((s) => s.setFighterName);
  const addPoints = useAppStore((s) => s.addPoints);
  const removePoints = useAppStore((s) => s.removePoints);
  const addPenalty = useAppStore((s) => s.addPenalty);
  const removePenalty = useAppStore((s) => s.removePenalty);
  const addAdvantage = useAppStore((s) => s.addAdvantage);
  const removeAdvantage = useAppStore((s) => s.removeAdvantage);

  const points = [
    { label: "Derribo", value: 2 },
    { label: "Pasada Guardia", value: 3 },
    { label: "Montada o Espalda", value: 4 },
  ];

  return (
    <div
      className={`${styles.fighter} ${fighterId === 1 ? styles.fighter1 : styles.fighter2}`}
    >
      <div className={styles.name}>
        <input
          type="text"
          value={fighter.name}
          onChange={(e) => setFighterName(fighterId, e.target.value)}
          className={styles.nameInput}
        />
      </div>

      <div className={styles.score}>{fighter.score}</div>

      <div className={styles.details}>
        <p className={styles.penalties}>{fighter.penalties}</p>
        <p className={styles.advantages}>{fighter.advantages}</p>
      </div>

      <div className={styles.pointControls}>
        {/* Agregar puntos */}
        <div className={styles.points}>
          {points.map((p) => (
            <button
              key={`add-${p.label}`}
              type="button"
              className={styles.pointButton}
              onClick={() => addPoints(fighterId, p.value)}
            >
              +{p.value} {p.label}
            </button>
          ))}
        </div>

        {/* Quitar puntos */}
        <div className={styles.points}>
          {points.map((p) => (
            <button
              key={`rem-${p.label}`}
              type="button"
              className={`${styles.pointButton} ${styles.removeButton}`}
              onClick={() => removePoints(fighterId, p.value)}
            >
              -{p.value} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ventajas y penalizaciones */}
      <div className={styles.points}>
        <button
          type="button"
          className={styles.pointButton}
          onClick={() => addAdvantage(fighterId)}
        >
          +1 Ventaja
        </button>
        <button
          type="button"
          className={`${styles.pointButton} ${styles.removeButton}`}
          onClick={() => removeAdvantage(fighterId)}
        >
          -1 Ventaja
        </button>
        <button
          type="button"
          className={styles.pointButton}
          onClick={() => addPenalty(fighterId)}
        >
          +1 Penalización
        </button>
        <button
          type="button"
          className={`${styles.pointButton} ${styles.removeButton}`}
          onClick={() => removePenalty(fighterId)}
        >
          -1 Penalización
        </button>
      </div>
    </div>
  );
}
