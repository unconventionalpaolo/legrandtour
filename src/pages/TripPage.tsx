import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlbumGrid } from "../features/album/AlbumGrid";
import { AdminPanel } from "../features/admin/AdminPanel";
import { DayPage } from "../features/daily-reveal/DayPage";
import { RevealStage } from "../features/daily-reveal/RevealStage";
import { useEffectiveDate } from "../hooks/useEffectiveDate";
import type { DayPlan, Settings, Trip } from "../types/trip";
import { markOpened } from "../utils/storage";
import { formatItalianDate, getCurrentUnlockedDay, getUnlockedDays, tripVisibility } from "../utils/time";

type Props = {
  settings: Settings;
  trip: Trip;
};

export function TripPage({ settings, trip }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const effective = useEffectiveDate(settings);
  const [adminSignal, setAdminSignal] = useState(0);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(params.dayId ?? null);
  const visibility = tripVisibility(settings, effective);
  const unlockedDays = useMemo(
    () => getUnlockedDays(trip.days, effective, settings),
    [effective, settings, trip.days]
  );
  const currentDay = useMemo(
    () => getCurrentUnlockedDay(trip.days, effective, settings),
    [effective, settings, trip.days]
  );
  const selectedDay = useMemo(() => {
    if (!selectedDayId) return null;
    return unlockedDays.find((day) => day.id === selectedDayId) ?? null;
  }, [selectedDayId, unlockedDays]);
  const visibleDay = selectedDay;

  function openDay(day: DayPlan) {
    markOpened(day.id);
    setSelectedDayId(day.id);
    navigate(`/day/${day.id}`);
  }

  function closeDay() {
    setSelectedDayId(null);
    navigate("/");
  }

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Salta al contenuto
      </a>
      <header className="topbar">
        <button
          className="brand"
          type="button"
          aria-label="Bonjour Mur Mur. Premi a lungo per la modalità anteprima."
          data-admin-title
        >
          <span className="brand-main">Bonjour</span>
          <span className="brand-hand">Mur Mur</span>
        </button>
        <div className="top-actions">
          {effective.preview ? <span className="preview-badge">Modalità anteprima</span> : null}
          <span className="date-pill">{formatItalianDate(effective.date)}</span>
        </div>
      </header>

      <main id="main">
        {visibleDay ? (
          <DayPage day={visibleDay} settings={settings} onClose={closeDay} />
        ) : (
          <RevealStage
            currentDay={currentDay}
            settings={settings}
            visibility={visibility}
            effective={effective}
            onReveal={(day) => openDay(day)}
          />
        )}

        <AlbumGrid days={unlockedDays} currentDayId={visibleDay?.id} onOpen={openDay} />
      </main>

      <footer className="footer">
        Bonjour Mur Mur. Logistica robusta, romanticismo controllato, croissant da verificare.
      </footer>

      <AdminPanel
        key={adminSignal}
        settings={settings}
        days={trip.days}
        onChanged={() => setAdminSignal((value) => value + 1)}
      />
    </div>
  );
}
