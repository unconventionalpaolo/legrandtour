import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tripPath = path.join(root, "public", "data", "trip.json");
const imagesDir = path.join(root, "public", "images", "places");
const laToussuireImage = {
  src: "/images/places/la-toussuire-sybelles-david-malacrida.webp",
  alt: "Panorama estivo di La Toussuire e delle Aiguilles d'Arves",
  author: "David Malacrida / elmerjack.com",
  sourceName: "Foto fornita da Paolo",
  sourceUrl: null,
  license: "Uso locale privato",
  status: "ready"
};

const placeTitles = {
  "Chambéry": "Chambéry",
  "Vieux Lyon": "Vieux Lyon",
  "Fourvière": "Fourvière",
  "Parc de la Tête d'Or": "Parc de la Tête d'Or",
  "Charlieu": "Charlieu",
  "Bourges": "Bourges",
  "Château de Chenonceau": "Château de Chenonceau",
  "Amboise": "Amboise",
  "Château et Jardins de Villandry": "Château de Villandry",
  "Chambord": "Château de Chambord",
  "Chartres": "Chartres",
  "Cathédrale Notre-Dame de Rouen": "Rouen Cathedral",
  "Gros-Horloge": "Gros Horloge",
  "Étretat": "Étretat",
  "Honfleur": "Honfleur",
  "Fougères": "Fougères",
  "Centro storico di Rennes": "Rennes",
  "Parc des Gayeulles": "Parc des Gayeulles",
  "Saint-Malo": "Saint-Malo",
  "Cancale": "Cancale",
  "Dinan": "Dinan",
  "Cap Fréhel": "Cap Fréhel",
  "Laval": "Laval, Mayenne"
};

function slug(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isLaToussuirePlace(place) {
  return /toussuire|belvedere|panoramica locale/i.test(`${place.name} ${place.officialUrl ?? ""}`);
}

async function pause(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(url, options);
    if (response.status !== 429) return response;
    await pause(1200 + attempt * 1200);
  }
  return fetch(url, options);
}

async function imageForTitle(title) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summaryResponse = await fetchWithRetry(summaryUrl, {
    headers: { "User-Agent": "BonjourMurMurLocal/1.0" }
  });
  if (!summaryResponse.ok) throw new Error(`${title}: summary ${summaryResponse.status}`);
  const summary = await summaryResponse.json();
  const imageUrl = summary.thumbnail?.source ?? summary.originalimage?.source;
  if (!imageUrl) throw new Error(`${title}: no image`);

  const imageResponse = await fetchWithRetry(imageUrl, {
    headers: { "User-Agent": "BonjourMurMurLocal/1.0" }
  });
  if (!imageResponse.ok) throw new Error(`${title}: image ${imageResponse.status}`);

  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const filename = `place-${slug(title)}.${ext}`;
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
const cache = new Map();

for (const day of trip.days) {
  if (/La Toussuire/i.test(`${day.base} ${day.subtitle}`)) {
    day.heroImage = laToussuireImage;
  }

  for (const place of day.places ?? []) {
    if (isLaToussuirePlace(place)) {
      place.image = laToussuireImage;
      continue;
    }

    const title = placeTitles[place.name] ?? place.name;
    try {
      if (!cache.has(title)) {
        cache.set(title, await imageForTitle(title));
        await pause(350);
      }
      place.image = cache.get(title);
    } catch (error) {
      console.warn(`Immagine luogo saltata per ${place.name}: ${error.message}`);
      if (day.heroImage?.status === "ready") place.image = day.heroImage;
    }
  }
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
