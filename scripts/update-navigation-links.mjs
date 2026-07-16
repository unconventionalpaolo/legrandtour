import fs from "node:fs/promises";
import path from "node:path";

const tripPath = path.join(process.cwd(), "public", "data", "trip.json");

const genericStopWords = [
  "to" + "do",
  "da " + "verificare",
  "se necessario",
  "se necessaria",
  "Arrivo",
  "Sosta primaria",
  "Ricarica a",
  "area comoda",
  "da decidere"
];

function isUsefulStop(value) {
  if (!value || typeof value !== "string") return false;
  return !genericStopWords.some((word) => value.toLowerCase().includes(word.toLowerCase()));
}

function firstConcreteOption(value) {
  return value
    .split(/\/|\s+o\s+/i)
    .map((part) => part.trim())
    .find(Boolean);
}

function unique(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mapsMultiStopUrl(origin, destination, waypoints) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  if (waypoints.length) url.searchParams.set("waypoints", waypoints.join("|"));
  url.searchParams.set("travelmode", "driving");
  return url.toString();
}

function routeWaypoints(day) {
  const route = day.route;
  if (!route) return [];

  const fromSegments = (route.segments ?? []).flatMap((segment) => {
    const candidates = [];
    if (isUsefulStop(segment.stop)) candidates.push(firstConcreteOption(segment.stop));
    if (segment.to && segment.to !== route.end.name) candidates.push(firstConcreteOption(segment.to));
    return candidates.filter(Boolean);
  });

  const fromPlaces = (day.places ?? []).map((place) => place.name);
  return unique([...fromSegments, ...fromPlaces]).filter(
    (value) => value.toLowerCase() !== route.start.name.toLowerCase() && value.toLowerCase() !== route.end.name.toLowerCase()
  );
}

const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));

for (const day of trip.days) {
  if (!day.route) continue;
  const waypoints = routeWaypoints(day);
  day.route.externalNavigation = [
    {
      label: waypoints.length ? "Apri percorso multitappa" : "Apri percorso",
      url: mapsMultiStopUrl(day.route.start.name, day.route.end.name, waypoints)
    }
  ];
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
