import { deviceLabels } from "../lib/constants";
import styles from "./ColorSettings.module.css";

export default function ColorSettings({ colors, onColorChange }) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Appearance</h2>
      <p className={styles.description}>
        Adjust colors for each device type. Changes are saved with the session.
      </p>
      <div className={styles.grid}>
        {Object.keys(colors).map((key) => (
          <div key={key} className={styles.row}>
            <div
              className={styles.swatch}
              style={{ background: colors[key] }}
            />
            <div className={styles.label}>{deviceLabels[key]}</div>
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => onColorChange(key, e.target.value)}
              className={styles.input}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
