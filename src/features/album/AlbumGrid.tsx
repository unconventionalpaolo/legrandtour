import { Images } from "lucide-react";
import type { CSSProperties } from "react";
import type { DayPlan } from "../../types/trip";
import { formatItalianDate } from "../../utils/time";

type Props = {
  days: DayPlan[];
  currentDayId?: string;
  onOpen: (day: DayPlan) => void;
};

export function AlbumGrid({ days, currentDayId, onOpen }: Props) {
  return (
    <section className="album-section" aria-labelledby="album-title">
      <div className="section-head">
        <div>
          <span className="scribble">le foto già sviluppate</span>
          <h2 id="album-title">Il nostro album</h2>
        </div>
        <p>Qui compaiono soltanto le giornate già sbloccate. Quelle future, per ora, non esistono.</p>
      </div>

      {days.length === 0 ? (
        <div className="empty-album">
          <Images aria-hidden="true" />
          <p>Album ancora vuoto. Molto elegante, ma vuoto.</p>
        </div>
      ) : (
        <div className="album-grid">
          {days.map((day, index) => (
            <button
              className={day.id === currentDayId ? "album-polaroid active" : "album-polaroid"}
              style={{ "--tilt": `${[-2, 1.3, -0.7, 2.1, -1.4][index % 5]}deg` } as CSSProperties}
              type="button"
              key={day.id}
              onClick={() => onOpen(day)}
            >
              <img src={day.heroImage.src} alt={day.heroImage.alt} loading="lazy" />
              <b>{day.title}</b>
              <span>{formatItalianDate(day.date)}</span>
              <small>{day.subtitle}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
