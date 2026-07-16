import { motion, useReducedMotion } from "framer-motion";
import { Camera, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import type { DayPlan, Settings } from "../../types/trip";
import { type EffectiveDateTime, type TripVisibility, daysUntil, formatItalianDate } from "../../utils/time";

type Props = {
  currentDay: DayPlan | null;
  settings: Settings;
  visibility: TripVisibility;
  effective: EffectiveDateTime;
  onReveal: (day: DayPlan) => void;
};

export function RevealStage({ currentDay, settings, visibility, effective, onReveal }: Props) {
  const [revealing, setRevealing] = useState(false);
  const reducedMotion = useReducedMotion();
  const canReveal = Boolean(currentDay);
  const countdown = daysUntil(settings.app.startDate);

  function reveal() {
    if (!currentDay) return;
    setRevealing(true);
    window.setTimeout(
      () => {
        onReveal(currentDay);
      },
      reducedMotion ? 250 : 3300
    );
  }

  const title =
    visibility === "before"
      ? "La prima fotografia è ancora chiusa."
      : canReveal
        ? "La fotografia di oggi è pronta."
        : "La fotografia di oggi è ancora in camera oscura.";

  const lead =
    visibility === "before"
      ? `Mancano ${countdown} ${countdown === 1 ? "giorno" : "giorni"} alla prima Polaroid. Niente destinazioni future: la curiosità si allena.`
      : canReveal
        ? "Bonjour Mur Mur. Il negativo ha fatto il suo dovere: adesso possiamo sviluppare la giornata."
        : `Torna dopo le ${settings.app.dailyUnlockTime}. Prima di quell'ora, anche la Francia fa finta di dormire.`;
  const photoSrc = revealing && currentDay ? currentDay.heroImage.src : "/images/placeholder-closed.svg";
  const caption = revealing && currentDay ? currentDay.base : "Camera oscura";
  const captionDate =
    revealing && currentDay ? currentDay.date.slice(5).replace("-", ".") : effective.date.slice(5).replace("-", ".");

  return (
    <section className="reveal-stage" aria-labelledby="reveal-title">
      <div className="intro-copy">
        <p className="eyebrow">Diario di viaggio, ma con giudizio</p>
        <h1 id="reveal-title">{title}</h1>
        <p className="lead">{lead}</p>
        <div className="countdown-card">
          <Clock aria-hidden="true" />
          <div>
            <b>{currentDay ? "Fotografia pronta" : "Top secret"}</b>
            <small>{currentDay ? formatItalianDate(currentDay.date) : "Sblocco alle 05:00"}</small>
          </div>
        </div>
        <div className="action-row">
          <button className="primary-btn" type="button" onClick={reveal} disabled={!canReveal || revealing}>
            <Camera aria-hidden="true" />
            {revealing ? "Sviluppo in corso" : "Sviluppa la giornata"}
          </button>
          {revealing ? (
            <button className="secondary-btn" type="button" onClick={() => currentDay && onReveal(currentDay)}>
              Salta animazione
            </button>
          ) : null}
        </div>
      </div>

      <div className={revealing ? "camera-wrap is-revealing" : "camera-wrap"} aria-hidden="true">
        <motion.div
          className="flash-overlay"
          animate={revealing && !reducedMotion ? { opacity: [0, 0.92, 0] } : { opacity: 0 }}
          transition={{ duration: 0.55 }}
        />
        <div className="camera-body">
          <div className="camera-top">
            <span>MurMatic 2026</span>
            <Sparkles />
          </div>
          <div className="camera-lens" />
          <div className="camera-slot" />
        </div>
        <motion.div
          className="developing-polaroid"
          animate={
            revealing && !reducedMotion
              ? { opacity: [0, 1, 1], y: [150, 45, -55], rotate: [-2, 3, -1], scale: [0.86, 0.95, 1] }
              : { opacity: 0, y: 150 }
          }
          transition={{ duration: 3.15, ease: [0.18, 0.86, 0.24, 1] }}
        >
          <div className="photo-window">
            <img src={photoSrc} alt="" />
            <motion.div
              className="photo-wash"
              animate={revealing && !reducedMotion ? { opacity: [0.96, 0.8, 0] } : { opacity: 0.9 }}
              transition={{ delay: 0.65, duration: 2.2 }}
            />
          </div>
          <div className="polaroid-caption">
            <span>{caption}</span>
            <small>{captionDate}</small>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
