import type { Settings, Trip } from "../types/trip";
import { settingsSchema, tripSchema } from "./schemas";

async function loadJson(path: string): Promise<unknown> {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Impossibile caricare ${path}`);
  }
  return response.json();
}

export async function loadSettings(): Promise<Settings> {
  const json = await loadJson(`${import.meta.env.BASE_URL}data/settings.json`);
  return settingsSchema.parse(json) as Settings;
}

export async function loadTrip(): Promise<Trip> {
  const json = await loadJson(`${import.meta.env.BASE_URL}data/trip.json`);
  return tripSchema.parse(json) as Trip;
}

export async function loadAppData(): Promise<{ settings: Settings; trip: Trip }> {
  const [settings, trip] = await Promise.all([loadSettings(), loadTrip()]);
  return { settings, trip };
}
