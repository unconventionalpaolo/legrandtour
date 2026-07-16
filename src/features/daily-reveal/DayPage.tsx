import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Utensils } from "lucide-react";
import type { Settings, DayPlan } from "../../types/trip";
import { formatItalianDate } from "../../utils/time";
import { ChargingPlan } from "../charging/ChargingPlan";
import { DayMap } from "../maps/DayMap";
import { WeatherCard } from "../weather/WeatherCard";

type Props = {
  day: DayPlan;
  settings: Settings;
  onClose: () => void;
};

export function DayPage({ day, settings, onClose }: Props) {
  return (
    <article className="day-page">
      <button className="back-btn" type="button" onClick={onClose}>
        <ArrowLeft aria-hidden="true" />
        Torna alla camera oscura
      </button>

      <section className="day-hero">
        <figure className="hero-polaroid">
          <span className="tape" aria-hidden="true" />
          <img src={day.heroImage.src} alt={day.heroImage.alt} />
          <figcaption>
            <span>{day.subtitle}</span>
            <small>{day.date.slice(5).replace("-", ".")}</small>
          </figcaption>
        </figure>
        <div className="hero-copy">
          <p className="eyebrow">{formatItalianDate(day.date)}</p>
          <h1>{day.title}</h1>
          <p className="lead">{day.intro}</p>
          <div className="day-stats">
            <span>
              <b>{day.base}</b>
              <small>base</small>
            </span>
            <span>
              <b>{day.route?.distanceKm ?? "0"} km</b>
              <small>distanza stimata</small>
            </span>
            <span>
              <b>{settings.travellers.baby.maxContinuousCarMinutes} min</b>
              <small>massimo guida continua</small>
            </span>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel timeline-panel">
          <div className="section-head compact">
            <div>
              <span className="scribble">senza correre, promesso</span>
              <h2>Programma</h2>
            </div>
          </div>
          <ol className="timeline">
            {day.timeline.map((item) => (
              <li key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <DayMap day={day} />
      </section>

      {day.route?.segments.length ? <ChargingPlan day={day} /> : null}

      <section className="places-section" aria-labelledby="places-title">
        <div className="section-head">
          <div>
            <span className="scribble">tre cose, non trentadue</span>
            <h2 id="places-title">Luoghi da vedere</h2>
          </div>
          <p>Obiettivi scelti per restare nella zona “bella giornata” e fuori dalla zona “spedizione”.</p>
        </div>
        {day.places.length ? (
          <div className="places-grid">
            {day.places.map((place) => (
              <article className="place-card" key={place.name}>
                {place.image ? (
                  <img className="place-card-photo" src={place.image.src} alt={place.image.alt} loading="lazy" />
                ) : (
                  <div className="place-card-map">
                    <MapPin aria-hidden="true" />
                  </div>
                )}
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                {place.story ? <p className="place-story">{place.story}</p> : null}
                {place.curiosity ? (
                  <p className="place-curiosity">
                    <b>Curiosità:</b> {place.curiosity}
                  </p>
                ) : null}
                {place.matiAngle ? <p className="place-mati">{place.matiAngle}</p> : null}
                <dl>
                  <div>
                    <dt>Durata</dt>
                    <dd>{place.duration}</dd>
                  </div>
                  <div>
                    <dt>Priorità</dt>
                    <dd>{place.priority}</dd>
                  </div>
                  <div>
                    <dt>Prenotazione</dt>
                    <dd>{place.bookingRequired}</dd>
                  </div>
                </dl>
                {place.officialUrl ? (
                  <a href={place.officialUrl} target="_blank" rel="noreferrer">
                    Fonte ufficiale <ExternalLink aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-text">Oggi il programma non ha visite: anche questa è civiltà.</p>
        )}
      </section>

      <section className="content-grid">
        <AccommodationPanel day={day} />
        <BabyPanel items={day.babyNotes} />
      </section>

      <section className="content-grid">
        <PracticalPanel day={day} />
        <WeatherCard day={day} />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-head compact">
            <div>
              <span className="scribble">la realtà ha diritto di veto</span>
              <h2>Piano B</h2>
            </div>
          </div>
          <ul className="backup-list">
            {day.backupPlans.map((plan) => (
              <li key={plan.condition}>
                <b>{plan.condition}</b>
                <span>{plan.plan}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-head compact">
            <div>
              <span className="scribble">niente tovaglie stirate, grazie</span>
              <h2>Dove mangiamo?</h2>
            </div>
          </div>
          {day.foodRecommendations?.length ? (
            <ul className="food-list">
              {day.foodRecommendations.map((food) => (
                <li key={`${food.city}-${food.name}`}>
                  <Utensils aria-hidden="true" />
                  <div>
                    <b>{food.name}</b>
                    <span>
                      {food.city} · {food.style} · {food.budget}
                    </span>
                    <p>{food.note}</p>
                    <a href={food.mapsUrl} target="_blank" rel="noreferrer">
                      Apri su Maps <ExternalLink aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">Consigli cibo non ancora inseriti. Grave, ma recuperabile.</p>
          )}
        </div>
        <div className="personal-note">
          {day.personalNote || "Nota personale di Paolo: da scrivere quando arriva la frase giusta, non una frase qualsiasi."}
          <span>Paolo</span>
        </div>
      </section>

      <section className="credits-panel" aria-labelledby="credits-title">
        <div>
          <CalendarDays aria-hidden="true" />
          <h2 id="credits-title">Fonti e crediti fotografici</h2>
        </div>
        <p>
          Foto: {day.heroImage.sourceName} · {day.heroImage.author} · Licenza: {day.heroImage.license}.
        </p>
        <ul>
          {day.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.name}
              </a>
              <span>Verifica: {source.lastVerified ?? "non datata"}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function AccommodationPanel({ day }: { day: DayPlan }) {
  const accommodation = day.accommodation;
  const hasUsefulData = Boolean(accommodation.name && accommodation.name.trim().toLowerCase() !== "da completare");

  return (
    <div className="panel accommodation-panel">
      <div className="section-head compact">
        <div>
          <span className="scribble">base operativa</span>
          <h2>Alloggio</h2>
        </div>
      </div>
      {hasUsefulData ? (
        <>
          <h3>{accommodation.name}</h3>
          <p>{accommodation.address || "Indirizzo da completare."}</p>
          {accommodation.notes ? <p className="muted-copy">{accommodation.notes}</p> : null}
          <div className="link-actions">
            {accommodation.mapsUrl ? (
              <a href={accommodation.mapsUrl} target="_blank" rel="noreferrer">
                Torna all'alloggio <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
            {accommodation.bookingUrl ? (
              <a href={accommodation.bookingUrl} target="_blank" rel="noreferrer">
                Dettagli prenotazione <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <p className="empty-text">Alloggio da inserire.</p>
      )}
    </div>
  );
}

function BabyPanel({ items }: { items: Record<string, string | number | string[] | null> }) {
  return (
    <div className="panel">
      <div className="section-head compact">
        <div>
          <span className="scribble">mini umano, maxi logistica</span>
          <h2>Con il bambino</h2>
        </div>
      </div>
      <dl className="info-list">
        {["carMinutes", "pauseIdeas", "whatToBring"].map((key) => (
          <div key={key}>
            <dt>{labelize(key)}</dt>
            <dd>{formatValue(items[key])}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PracticalPanel({ day }: { day: DayPlan }) {
  const narrative = typeof day.practicalInfo.narrative === "string" ? day.practicalInfo.narrative : null;

  return (
    <div className="panel">
      <div className="section-head compact">
        <div>
          <span className="scribble">storia, parcheggi e sopravvivenza</span>
          <h2>Informazioni pratiche</h2>
        </div>
      </div>
      <p className="practical-story">{narrative ?? "Racconto pratico da completare."}</p>

      {day.parkingOptions?.length ? (
        <>
          <h3 className="mini-heading">Parcheggi</h3>
          <ul className="compact-link-list">
            {day.parkingOptions.map((parking) => (
              <li key={parking.name}>
                <b>{parking.name}</b>
                <span>
                  {parking.area} · {parking.hasCharging === true ? "ricarica indicata" : parking.hasCharging === false ? "senza ricarica indicata" : "ricarica non indicata"}
                </span>
                <p>{parking.note}</p>
                <a href={parking.mapsUrl} target="_blank" rel="noreferrer">
                  Apri su Maps <ExternalLink aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {day.ticketLinks?.length ? (
        <>
          <h3 className="mini-heading">Biglietti e attrazioni</h3>
          <ul className="compact-link-list">
            {day.ticketLinks.map((ticket) => (
              <li key={ticket.url}>
                <b>{ticket.name}</b>
                <span>{ticket.note}</span>
                <a href={ticket.url} target="_blank" rel="noreferrer">
                  Sito ufficiale <ExternalLink aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function formatValue(value: string | number | string[] | null | undefined) {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "non indicato";
}

function labelize(value: string) {
  const labels: Record<string, string> = {
    carMinutes: "Minuti in macchina",
    pauseIdeas: "Dove facciamo una pausa?",
    whatToBring: "Cosa portare"
  };
  return labels[value] ?? value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
