import fs from "node:fs/promises";
import path from "node:path";

const tripPath = path.join(process.cwd(), "public", "data", "trip.json");

const rouenImage = {
  src: "/images/places/rouen-facciate-paolo.jpg",
  alt: "Facciate a graticcio colorate nel centro storico di Rouen",
  author: "Foto fornita da Paolo",
  sourceName: "Archivio locale",
  sourceUrl: null,
  license: "Uso locale privato",
  status: "ready"
};

const saintMaloImage = {
  src: "/images/places/saint-malo-paolo.jpeg",
  alt: "Vista aerea delle mura e del centro storico di Saint-Malo sul mare",
  author: "Foto fornita da Paolo",
  sourceName: "Archivio locale",
  sourceUrl: null,
  license: "Uso locale privato",
  status: "ready"
};

const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));

for (const day of trip.days) {
  const dayText = `${day.id} ${day.base} ${day.subtitle} ${day.title}`;

  if (/Rouen/i.test(dayText) && day.id !== "2026-08-11" && day.id !== "2026-08-12") {
    day.heroImage = rouenImage;
  }

  if (/Saint-Malo|Cancale/i.test(dayText)) {
    day.heroImage = saintMaloImage;
  }

  for (const place of day.places ?? []) {
    if (/Rouen|Cathédrale|Gros-Horloge/i.test(place.name)) {
      place.image = rouenImage;
    }
    if (/Saint-Malo/i.test(place.name)) {
      place.image = saintMaloImage;
    }
  }
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
