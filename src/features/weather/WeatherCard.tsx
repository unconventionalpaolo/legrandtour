import { CloudSun } from "lucide-react";
import { useEffect, useState } from "react";
import { clothingHint, getWeather, type WeatherSnapshot } from "../../services/weather";
import type { DayPlan } from "../../types/trip";

export function WeatherCard({ day }: { day: DayPlan }) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    let active = true;
    getWeather(day).then((snapshot) => {
      if (active) setWeather(snapshot);
    });
    return () => {
      active = false;
    };
  }, [day]);

  return (
    <div className="panel weather-panel">
      <div className="section-head compact">
        <div>
          <span className="scribble">cielo permettendo</span>
          <h2>Meteo</h2>
        </div>
      </div>
      <div className="weather-main">
        <CloudSun aria-hidden="true" />
        <div>
          <b>{weather?.temperature == null ? "Meteo non disponibile offline" : `${Math.round(weather.temperature)} °C`}</b>
          <span>{weather?.offline ? "Ultimo dato salvato o nessun dato online" : "Previsione Open-Meteo"}</span>
        </div>
      </div>
      {weather ? (
        <dl className="info-list">
          <div>
            <dt>Pioggia</dt>
            <dd>{weather.precipitation == null ? "Da verificare" : `${weather.precipitation} mm`}</dd>
          </div>
          <div>
            <dt>Vento</dt>
            <dd>{weather.wind == null ? "Da verificare" : `${weather.wind} km/h`}</dd>
          </div>
          <div>
            <dt>Vestiti</dt>
            <dd>{clothingHint(weather)}</dd>
          </div>
        </dl>
      ) : (
        <p className="empty-text">Recupero il meteo. Con calma meteorologica.</p>
      )}
    </div>
  );
}
