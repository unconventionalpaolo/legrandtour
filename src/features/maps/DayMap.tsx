import L from "leaflet";
import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { DayPlan } from "../../types/trip";

export function DayMap({ day }: { day: DayPlan }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const points = useMemo(
    () => [
      ...(day.route ? [day.route.start, day.route.end] : []),
      ...day.places.map((place) => ({ name: place.name, lat: place.lat, lng: place.lng }))
    ],
    [day.places, day.route]
  );

  useEffect(() => {
    if (!mapRef.current || leafletRef.current || points.length === 0) return;
    const map = L.map(mapRef.current, { scrollWheelZoom: false });
    leafletRef.current = map;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    const markers = points.map((point) => L.marker([point.lat, point.lng]).addTo(map).bindPopup(point.name));
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, [points]);

  return (
    <div className="panel map-panel">
      <div className="section-head compact">
        <div>
          <span className="scribble">online se possibile</span>
          <h2>Mappa</h2>
        </div>
      </div>
      <div ref={mapRef} className="leaflet-shell" aria-label={`Mappa del giorno ${day.date}`} />
      <div className="offline-map" aria-hidden="true">
        <svg viewBox="0 0 640 420" role="img">
          <rect width="640" height="420" fill="#edf1df" />
          <path d="M65 310 C160 180 255 250 330 170 S520 110 585 230" fill="none" stroke="#d55552" strokeWidth="7" strokeLinecap="round" strokeDasharray="4 13" />
          {points.slice(0, 6).map((point, index) => (
            <g key={point.name} transform={`translate(${80 + index * 96} ${300 - (index % 3) * 58})`}>
              <circle r="20" fill={["#f3d46f", "#8ec8d8", "#9fbea7", "#f28372"][index % 4]} />
              <text textAnchor="middle" y="6" fontSize="16" fontWeight="800" fill="#17324a">
                {index + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {day.route?.externalNavigation[0] ? (
        <a className="map-link" href={day.route.externalNavigation[0].url} target="_blank" rel="noreferrer">
          {day.route.externalNavigation[0].label} <ExternalLink aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}
