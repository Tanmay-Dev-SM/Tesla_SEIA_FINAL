import { deviceLabels } from "../lib/constants";
import styles from "./LayoutPanel.module.css";

export default function LayoutPanel({
  result,
  alignment,
  onAlignmentChange,
  colors,
  devicesMeta,
}) {
  function computeAlignedLayout() {
    if (!result || !result.layout) return [];

    if (alignment === "left") {
      return result.layout;
    }

    const rows = new Map();
    for (const item of result.layout) {
      if (!rows.has(item.row)) rows.set(item.row, []);
      rows.get(item.row).push(item);
    }

    const aligned = [];
    const maxCols = 10;

    for (const [, items] of rows.entries()) {
      const rowWidth = items.reduce((sum, it) => sum + it.colSpan, 0);
      const free = maxCols - rowWidth;
      const shift = Math.floor(free / 2);

      for (const it of items) {
        aligned.push({
          ...it,
          colStart: it.colStart + shift,
        });
      }
    }

    return aligned;
  }

  const alignedLayout = computeAlignedLayout();

  return (
    <section className={styles.panel}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Layout (top view)</h2>
        <div className={styles.alignRow}>
          <span style={{ color: "#9ca3af" }}>Row alignment:</span>
          <select
            value={alignment}
            onChange={(e) => onAlignmentChange(e.target.value)}
            className={styles.select}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
          </select>
        </div>
      </div>

      <div className={styles.container}>
        {alignedLayout && alignedLayout.length > 0 ? (
          <div className={styles.grid}>
            {alignedLayout.map((item) => {
              const color = colors[item.type] || "#4b5563";
              const label = deviceLabels[item.type] || item.type;

              const tooltipText =
                devicesMeta &&
                devicesMeta.devices &&
                devicesMeta.devices[item.type]
                  ? `${devicesMeta.devices[item.type].name} • ${
                      devicesMeta.devices[item.type].mwh
                    } MWh • ${devicesMeta.devices[item.type].widthFt}x${
                      devicesMeta.devices[item.type].depthFt
                    } ft`
                  : label;

              return (
                <div
                  key={item.id}
                  className={styles.cell}
                  title={tooltipText}
                  style={{
                    background: color,
                    gridColumn: `${item.colStart + 1} / span ${item.colSpan}`,
                    gridRow: item.row + 1,
                  }}
                >
                  {item.type === "transformer"
                    ? "TR"
                    : label.replace("Megapack", "MP")}
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.placeholder}>
            No devices to display. Configure counts and recalculate.
          </p>
        )}
      </div>
    </section>
  );
}
