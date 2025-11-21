"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ConfigPanel from "../components/ConfigPanel";
import SessionPanel from "../components/SessionPanel";
import SummaryPanel from "../components/SummaryPanel";
import LayoutPanel from "../components/LayoutPanel";
import ColorSettings from "../components/ColorSettings";
import { defaultColors } from "../lib/constants";

export default function HomePage() {
  const [configInput, setConfigInput] = useState({
    megapackXL: 0,
    megapack2: 0,
    megapack: 0,
    powerPack: 0,
  });

  const [colors, setColors] = useState(defaultColors);
  const [devicesMeta, setDevicesMeta] = useState(null);
  const [result, setResult] = useState(null);
  const [alignment, setAlignment] = useState("left");
  const [autoRecalc, setAutoRecalc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loadSessionId, setLoadSessionId] = useState("");
  const [sessionsList, setSessionsList] = useState([]);
  const [dirty, setDirty] = useState(false);

  function handleConfigChange(field, value) {
    const parsed = parseIntInput(value);
    const next = { ...configInput, [field]: parsed === "" ? "" : parsed };
    setConfigInput(next);
    setDirty(true); //NEW state

    if (autoRecalc) {
      recalcLayout(next);
    }
  }

  function handleColorChange(type, value) {
    setColors((prev) => ({
      ...prev,
      [type]: value,
    }));
    setDirty(true); //NEW state
  }

useEffect(() => {
  async function init() {
    // Devices meta
    try {
      const res = await fetch("/api/devices");
      const data = await res.json();
      setDevicesMeta(data);
    } catch (err) {
      console.error("Error fetching devices", err);
    }

    // Sessions and auto-load
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) return;
      const data = await res.json();
      const items = data.items || [];
      setSessionsList(items);

      if (items.length === 0) return;

      let storedId = null;
      if (typeof window !== "undefined") {
        storedId = window.localStorage.getItem("lastSessionId");
      }

      let targetId = null;
      if (storedId && items.find((s) => s._id === storedId)) {
        targetId = storedId;
      } else {
        targetId = items[0]._id; // assume backend returns newest first
      }

      if (!targetId) return;

      setLoading(true);
      setError("");

      const sessionRes = await fetch(`/api/session_id/${targetId}`);
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        setError(sessionData.message || "Failed to load last session");
        return;
      }

      const loadedConfig = {
        megapackXL: sessionData.config.megapackXL ?? 0,
        megapack2: sessionData.config.megapack2 ?? 0,
        megapack: sessionData.config.megapack ?? 0,
        powerPack: sessionData.config.powerPack ?? 0,
      };

      setConfigInput(loadedConfig);
      setColors((prev) => ({ ...prev, ...sessionData.colors }));
      setSessionId(targetId);
      setDirty(false);
      await recalcLayout(loadedConfig);
    } catch (err) {
      console.error("Error fetching sessions list", err);
    } finally {
      setLoading(false);
    }
  }

  init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  function parseIntInput(value) {
    if (value === "") return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    if (n < 0) return 0;
    return Math.floor(n);
  }

  async function recalcLayout(withConfig) {
    const cfg = withConfig || configInput;

    try {
      setLoading(true);
      setError("");

      const body = {
        megapackXL: Number(cfg.megapackXL || 0),
        megapack2: Number(cfg.megapack2 || 0),
        megapack: Number(cfg.megapack || 0),
        powerPack: Number(cfg.powerPack || 0),
      };

      const res = await fetch("/api/layout/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to calculate layout");
        setResult(null);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Error recalculating layout", err);
      setError("Backend not reachable");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSession() {
    try {
      setLoading(true);
      setError("");

      const body = {
        config: {
          megapackXL: Number(configInput.megapackXL || 0),
          megapack2: Number(configInput.megapack2 || 0),
          megapack: Number(configInput.megapack || 0),
          powerPack: Number(configInput.powerPack || 0),
        },
        colors,
      };

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to save session");
        return;
      }

      setSessionId(data.id || "");
      setDirty(false); //NEW State

      if (typeof window !== "undefined" && data.id) {
        window.localStorage.setItem("lastSessionId", data.id); //NEW State
      }

      const listRes = await fetch("/api/sessions");
      if (listRes.ok) {
        const listData = await listRes.json();
        setSessionsList(listData.items || []);
      }
    } catch (err) {
      console.error("Error saving session", err);
      setError("Failed to save session");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadSession(idToLoad) {
    const id = idToLoad || loadSessionId;
    if (!id) {
      setError("Please enter a session id");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/session_id/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to load session");
        return;
      }

      const loadedConfig = {
        megapackXL: data.config.megapackXL ?? 0,
        megapack2: data.config.megapack2 ?? 0,
        megapack: data.config.megapack ?? 0,
        powerPack: data.config.powerPack ?? 0,
      };

      setConfigInput(loadedConfig);
      setColors((prev) => ({ ...prev, ...data.colors }));
      setSessionId(id);
      setDirty(false); // NEW State
      await recalcLayout(loadedConfig);
    } catch (err) {
      console.error("Error loading session", err);
      setError("Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Megapack Site Layout Planner</h1>
          <p className={styles.subtitle}>
            Configure industrial batteries, transformers, and visualize site
            layout (100 ft width).
          </p>
        </div>
      </header>

      {dirty && (
        <div className={styles.dirtyBanner}>
          You have unsaved changes. Save the current configuration to persist it.
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <ConfigPanel
            configInput={configInput}
            autoRecalc={autoRecalc}
            loading={loading}
            onConfigChange={handleConfigChange}
            onToggleAutoRecalc={setAutoRecalc}
            onManualRecalc={() => recalcLayout()}
          />

          <SessionPanel
            sessionId={sessionId}
            loadSessionId={loadSessionId}
            sessionsList={sessionsList}
            loading={loading}
            onSaveSession={handleSaveSession}
            onChangeLoadSessionId={setLoadSessionId}
            onLoadSession={handleLoadSession}
          />
        </div>

        <div className={styles.rightColumn}>
          <SummaryPanel result={result} autoRecalc={autoRecalc} />
          <LayoutPanel
            result={result}
            alignment={alignment}
            onAlignmentChange={setAlignment}
            colors={colors}
            devicesMeta={devicesMeta}
          />
          <ColorSettings colors={colors} onColorChange={handleColorChange} />
        </div>
      </div>
    </div>
  );
}
