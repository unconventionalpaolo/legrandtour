import { Eye, RotateCcw, ShieldAlert, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DayPlan, Settings } from "../../types/trip";
import { clearStoredPreview, markUnopened, resetMurMurStorage, setStoredPreview } from "../../utils/storage";

type Props = {
  settings: Settings;
  days: DayPlan[];
  onChanged: () => void;
};

export function AdminPanel({ settings, days, onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState("2026-08-10");
  const [time, setTime] = useState("09:00");
  const [dayId, setDayId] = useState(days[0]?.id ?? "");
  const incompleteCount = useMemo(() => countIncompleteFields(days), [days]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "m") setOpen(true);
      if (event.key === "Escape") setOpen(false);
    }

    let timer: number | null = null;
    const title = document.querySelector("[data-admin-title]");
    const start = () => {
      timer = window.setTimeout(() => setOpen(true), 4000);
    };
    const stop = () => {
      if (timer) window.clearTimeout(timer);
    };

    document.addEventListener("keydown", onKeyDown);
    title?.addEventListener("pointerdown", start);
    title?.addEventListener("pointerup", stop);
    title?.addEventListener("pointerleave", stop);
    title?.addEventListener("pointercancel", stop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      title?.removeEventListener("pointerdown", start);
      title?.removeEventListener("pointerup", stop);
      title?.removeEventListener("pointerleave", stop);
      title?.removeEventListener("pointercancel", stop);
    };
  }, []);

  async function login() {
    const hash = await sha256(password);
    if (hash === settings.admin.passwordHash) {
      setAuthenticated(true);
      setError("");
      return;
    }
    setError("Password sbagliata. La curiosità resta a dieta.");
  }

  function applyPreview() {
    setStoredPreview(date, time);
    setOpen(false);
    onChanged();
  }

  function revealDay() {
    const selected = days.find((day) => day.id === dayId);
    if (!selected) return;
    setStoredPreview(selected.date, "09:00");
    setOpen(false);
    onChanged();
  }

  function resetAll() {
    resetMurMurStorage();
    setOpen(false);
    onChanged();
  }

  function resetPreview() {
    clearStoredPreview();
    setOpen(false);
    onChanged();
  }

  function markSelectedUnopened() {
    markUnopened(dayId);
    setOpen(false);
    onChanged();
  }

  if (!settings.admin.enabled || !open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <div className="modal">
        <button className="icon-close" type="button" onClick={() => setOpen(false)} aria-label="Chiudi">
          <X aria-hidden="true" />
        </button>

        {!authenticated ? (
          <>
            <h2 id="admin-title">Modalità anteprima</h2>
            <p>{settings.admin.warning}</p>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                autoFocus
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void login();
                }}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="primary-btn flat" type="button" onClick={() => void login()}>
              Entra
            </button>
          </>
        ) : (
          <>
            <h2 id="admin-title">Cabina di regia</h2>
            <p>Anteprima locale: modifica soltanto questo browser.</p>
            <div className="admin-grid">
              <label className="field">
                <span>Data simulata</span>
                <input
                  type="date"
                  value={date}
                  min={settings.app.startDate}
                  max={settings.app.endDate}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
              <label className="field">
                <span>Ora simulata</span>
                <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
              </label>
              <label className="field wide">
                <span>Giornata</span>
                <select value={dayId} onChange={(event) => setDayId(event.target.value)}>
                  {days.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.date} · {day.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-actions">
              <button type="button" onClick={applyPreview}>
                <Eye aria-hidden="true" />
                Applica anteprima
              </button>
              <button type="button" onClick={revealDay}>
                <Eye aria-hidden="true" />
                Apri giornata
              </button>
              <button type="button" onClick={markSelectedUnopened}>
                <RotateCcw aria-hidden="true" />
                Segna non sviluppata
              </button>
              <button type="button" onClick={resetPreview}>
                <RotateCcw aria-hidden="true" />
                Data reale
              </button>
              <button type="button" onClick={resetAll}>
                <Trash2 aria-hidden="true" />
                Reset localStorage
              </button>
            </div>
            <div className="data-quality-box">
              <ShieldAlert aria-hidden="true" />
              <span>{incompleteCount} campi da completare nei dati.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function countIncompleteFields(days: DayPlan[]) {
  const text = JSON.stringify(days).toLowerCase();
  const legacyMarkers = ["to" + "do", "da " + "verificare"];
  return legacyMarkers.reduce((total, marker) => total + (text.match(new RegExp(marker, "g")) ?? []).length, 0);
}
