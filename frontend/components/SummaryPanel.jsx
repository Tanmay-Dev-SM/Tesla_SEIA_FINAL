import styles from "./SummaryPanel.module.css";

export default function SummaryPanel({ result, autoRecalc }) {
  const totals = result?.totals;

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Summary</h2>
      {totals ? (
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>Industrial batteries</div>
            <div className={styles.value}>{totals.industrialCount}</div>
          </div>
          <div>
            <div className={styles.label}>Transformers</div>
            <div className={styles.value}>{totals.transformers}</div>
          </div>
          <div>
            <div className={styles.label}>Total energy (MWh)</div>
            <div className={styles.value}>{totals.totalMwh.toFixed(2)}</div>
          </div>
          <div>
            <div className={styles.label}>Total cost ($)</div>
            <div className={styles.value}>
              {totals.totalCost.toLocaleString()}
            </div>
          </div>
          <div>
            <div className={styles.label}>Site width (ft)</div>
            <div className={styles.value}>{totals.siteWidthFt}</div>
          </div>
          <div>
            <div className={styles.label}>Site depth (ft)</div>
            <div className={styles.value}>{totals.siteDepthFt}</div>
          </div>
        </div>
      ) : (
        <p className={styles.placeholder}>
          No layout yet. Enter counts and{" "}
          {autoRecalc ? "change a value to recalc." : 'click "Recalculate layout".'}
        </p>
      )}
    </section>
  );
}
