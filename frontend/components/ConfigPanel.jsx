import { deviceLabels } from "../lib/constants";
import styles from "./ConfigPanel.module.css";

export default function ConfigPanel({
  configInput,
  autoRecalc,
  loading,
  onConfigChange,
  onToggleAutoRecalc,
  onManualRecalc,
}) {
  const keys = ["megapackXL", "megapack2", "megapack", "powerPack"];

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Configuration</h2>
      <p className={styles.description}>
        Enter counts for industrial batteries. Transformers will be auto-calculated.
      </p>

      {keys.map((key) => (
        <div key={key} className={styles.row}>
          <label className={styles.label}>{deviceLabels[key]}</label>
          <input
            type="number"
            min="0"
            step="1"
            value={configInput[key]}
            onChange={(e) => onConfigChange(key, e.target.value)}
            className={styles.input}
          />
        </div>
      ))}

      <div className={styles.toggleRow}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={autoRecalc}
            onChange={(e) => onToggleAutoRecalc(e.target.checked)}
          />
          <span>Instant recalculation</span>
        </label>

        {!autoRecalc && (
          <button
            onClick={onManualRecalc}
            disabled={loading}
            className={styles.manualButton}
          >
            {loading ? "Calculating…" : "Recalculate layout"}
          </button>
        )}
      </div>
    </section>
  );
}
