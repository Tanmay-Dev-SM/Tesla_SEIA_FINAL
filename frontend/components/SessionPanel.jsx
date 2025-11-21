import styles from "./SessionPanel.module.css";

function formatSessionLabel(session) {
  if (!session) return session._id;

  const d = new Date(session.createdAt);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionPanel({
  sessionId,
  loadSessionId,
  sessionsList,
  loading,
  onSaveSession,
  onChangeLoadSessionId,
  onLoadSession,
}) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Session</h2>

      <div>
        <button
          onClick={onSaveSession}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Saving…" : "Save current configuration"}
        </button>
        {sessionId && (
          <p className={styles.info}>
            Last saved session ID: <span>{sessionId}</span>
          </p>
        )}
      </div>

      <div style={{ marginTop: "12px" }}>
        <label className={styles.loadLabel}>Load session by ID</label>
        <div className={styles.loadRow}>
          <input
            type="text"
            value={loadSessionId}
            onChange={(e) => onChangeLoadSessionId(e.target.value)}
            placeholder="Session ID"
            className={styles.loadInput}
          />
          <button
            onClick={() => onLoadSession()}
            disabled={loading}
            className={styles.loadButton}
          >
            Load
          </button>
        </div>
      </div>

      {sessionsList && sessionsList.length > 0 && (
        <div>
          <label className={styles.loadLabel}>
            Quick load from saved sessions
          </label>
          <select
            onChange={(e) => {
              const id = e.target.value;
              if (id) onLoadSession(id);
            }}
            defaultValue=""
            className={styles.select}
          >
            <option value="">Select a session…</option>
            {sessionsList.map((s) => (
              <option key={s._id} value={s._id}>
                {formatSessionLabel(s)}
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
}
