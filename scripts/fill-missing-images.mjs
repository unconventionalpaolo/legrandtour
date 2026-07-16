import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tripPath = path.join(root, "public", "data", "trip.json");
const imagesDir = path.join(root, "public", "images", "places");

const titles = {
  "2026-08-06": "Bourges",
  "2026-08-07": "Château de Chenonceau",
  "2026-08-08": "Château de Villandry",
  "2026-08-09": "Chartres",
  "2026-08-10": "Rouen Cathedral",
  "2026-08-11": "Étretat",
  "2026-08-13": "Rennes",
  "2026-08-14": "Saint-Malo",
  "2026-08-15": "Dinan",
  "2026-08-16": "Laval, Mayenne",
  "2026-08-17": "Bourges",
  "2026-08-18": "La Toussuire",
  "2026-08-19": "La Toussuire",
  "2026-08-20": "La Toussuire",
  "2026-08-21": "La Toussuire",
  "2026-08-22": "La Toussuire"
};

function slug(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchImage(dayId, title) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summaryResponse = await fetch(summaryUrl, { headers: { "User-Agent": "BonjourMurMurLocal/1.0" } });
  if (!summaryResponse.ok) throw new Error(`${title}: summary ${summaryResponse.status}`);
  const summary = await summaryResponse.json();
  const imageUrl = summary.thumbnail?.source ?? summary.originalimage?.source;
  if (!imageUrl) throw new Error(`${title}: no image`);
  let imageResponse = await fetch(imageUrl, { headers: { "User-Agent": "BonjourMurMurLocal/1.0" } });
  if (imageResponse.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    imageResponse = await fetch(imageUrl, { headers: { "User-Agent": "BonjourMurMurLocal/1.0" } });
  }
  if (!imageResponse.ok) throw new Error(`${title}: image ${imageResponse.status}`);
  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const filename = `${dayId}-${slug(title)}.${ext}`;
  await fs.writeFile(path.join(imagesDir, filename), Buffer.from(await imageResponse.arrayBuffer()));
  return {
    src: `/images/places/${filename}`,
    alt: summary.description ? `${summary.title}: ${summary.description}` : `Fotografia di ${summary.title}`,
    author: "Wikimedia contributors",
    sourceName: "Wikipedia / Wikimedia Commons",
    sourceUrl: summary.content_urls?.desktop?.page ?? summaryUrl,
    license: "Da verificare sulla pagina Wikimedia prima di pubblicare",
    status: "ready"
  };
}

const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));
await fs.mkdir(imagesDir, { recursive: true });

for (const day of trip.days) {
  if (!titles[day.id]) continue;
  try {
    day.heroImage = await fetchImage(day.id, titles[day.id]);
    await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
    await new Promise((resolve) => setTimeout(resolve, 350));
  } catch (error) {
    console.warn(`Immagine saltata per ${day.id}: ${error.message}`);
  }
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
