import fs from "node:fs/promises";
import path from "node:path";

const tripPath = path.join(process.cwd(), "public", "data", "trip.json");
const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));

function find(id) {
  return trip.days.find((day) => day.id === id);
}

const copies = {
  "2026-08-17": "2026-08-06",
  "2026-08-19": "2026-08-18",
  "2026-08-21": "2026-08-20"
};

for (const [target, source] of Object.entries(copies)) {
  const targetDay = find(target);
  const sourceDay = find(source);
  if (targetDay && sourceDay) {
    targetDay.heroImage = {
      ...sourceDay.heroImage,
      alt: `${targetDay.title}: ${sourceDay.heroImage.alt}`
    };
  }
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
