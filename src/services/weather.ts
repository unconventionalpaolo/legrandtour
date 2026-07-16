import type { DayPlan } from "../types/trip";

export type WeatherSnapshot = {
  temperature: number | null;
  precipitation: number | null;
  wind: number | null;
  code: number | null;
  fetchedAt: string;
  offline: boolean;
};

function weatherKey(dayId: string) {
  return `murMurWeather:${dayId}`;
}

export async function getWeather(day: DayPlan): Promise<WeatherSnapshot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(day.weatherLocation.lat));
  url.searchParams.set("longitude", String(day.weatherLocation.lng));
  url.searchParams.set("daily", "weather_code,temperature_2m_max,precipitation_sum,wind_speed_10m_max");
  url.searchParams.set("timezone", "Europe/Paris");
  url.searchParams.set("start_date", day.date);
  url.searchParams.set("end_date", day.date);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("meteo non disponibile");
    const payload = await response.json();
    const snapshot: WeatherSnapshot = {
      temperature: payload.daily?.temperature_2m_max?.[0] ?? null,
      precipitation: payload.daily?.precipitation_sum?.[0] ?? null,
      wind: payload.daily?.wind_speed_10m_max?.[0] ?? null,
      code: payload.daily?.weather_code?.[0] ?? null,
      fetchedAt: new Date().toISOString(),
      offline: false
    };
    localStorage.setItem(weatherKey(day.id), JSON.stringify(snapshot));
    return snapshot;
  } catch {
    const cached = localStorage.getItem(weatherKey(day.id));
    if (cached) {
      return { ...(JSON.parse(cached) as WeatherSnapshot), offline: true };
    }
    return {
      temperature: null,
      precipitation: null,
      wind: null,
      code: null,
      fetchedAt: new Date().toISOString(),
      offline: true
    };
  }
}

export function clothingHint(snapshot: WeatherSnapshot): string {
  if (snapshot.temperature == null) return "Abbigliamento da decidere guardando fuori dalla finestra.";
  if (snapshot.precipitation && snapshot.precipitation > 3) return "K-way, cambio asciutto e ambizioni ridotte.";
  if (snapshot.temperature > 28) return "Leggero, cappellino, ombra e pause più frequenti.";
  if (snapshot.temperature < 16) return "Uno strato in più: elegante no, utile sì.";
  return "Strati leggeri e una felpa a portata di mano.";
}
