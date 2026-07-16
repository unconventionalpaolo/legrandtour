import { BatteryCharging, ExternalLink } from "lucide-react";
import type { DayPlan } from "../../types/trip";

export function ChargingPlan({ day }: { day: DayPlan }) {
  if (!day.route?.segments.length) return null;

  return (
    <section className="ev-panel" aria-labelledby="charging-title">
      <div className="section-head inverse">
        <div>
          <span className="scribble">la Volvo non va nutrita a caso</span>
          <h2 id="charging-title">Il piano di fuga elettrico</h2>
        </div>
        <p>Le batterie, il traffico e i bambini seguono leggi proprie. Controlliamo il percorso prima di partire.</p>
      </div>
      <div className="charge-grid">
        {day.route.segments.map((segment, index) => (
          <article className="charge-card" key={`${segment.from}-${segment.to}`}>
            <div className="charge-num">{index + 1}</div>
            <h3>
              {segment.from} → {segment.to}
            </h3>
            <p>
              {segment.distanceKm} km · {segment.drivingMinutes} min stimati
            </p>
            <dl>
              <div>
                <dt>Batteria</dt>
                <dd>
                  {segment.batteryStartPct}% → {segment.batteryEndPct}%
                </dd>
              </div>
              <div>
                <dt>Sosta</dt>
                <dd>{segment.stop}</dd>
              </div>
              <div>
                <dt>Potenza</dt>
                <dd>{segment.powerKw ? `${segment.powerKw} kW` : "Da verificare"}</dd>
              </div>
              <div>
                <dt>Backup</dt>
                <dd>
                  {segment.backupA}
                  {segment.backupB ? ` / ${segment.backupB}` : ""}
                </dd>
              </div>
            </dl>
            <div className="service-tags">
              {segment.services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {day.route.externalNavigation[0] ? (
        <a className="live-check" href={day.route.externalNavigation[0].url} target="_blank" rel="noreferrer">
          <BatteryCharging aria-hidden="true" />
          Controlla disponibilità live
          <ExternalLink aria-hidden="true" />
        </a>
      ) : null}
    </section>
  );
}
