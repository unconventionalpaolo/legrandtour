import fs from "node:fs/promises";
import path from "node:path";

const tripPath = path.join(process.cwd(), "public", "data", "trip.json");

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const stays = [
  {
    from: "2026-07-31",
    to: "2026-08-02",
    accommodation: {
      name: "Casa di Eveline",
      address: "La Toussuire, Francia - Chalet di Eveline",
      checkIn: "Secondo accordi con Eveline",
      notes: "Base di famiglia: indirizzo pratico da usare con il navigatore gia in mano a Mati.",
      bookingUrl: null,
      mapsUrl: mapsUrl("La Toussuire France")
    }
  },
  {
    from: "2026-08-03",
    to: "2026-08-04",
    accommodation: {
      name: "Residence Montempo Appart'Hotel Lyon Cite Internationale",
      address: "35 Quai Charles de Gaulle, 69006 Lyon, Francia",
      checkIn: "dalle 15:00",
      notes: "Soggiorno 3-5 agosto. Base comoda per Parc de la Tete d'Or e Cite Internationale.",
      bookingUrl: "https://www.booking.com/hotel/fr/residence-hoteliere-temporim-cite-internationale.it.html",
      mapsUrl: mapsUrl("35 Quai Charles de Gaulle, 69006 Lyon, France")
    }
  },
  {
    from: "2026-08-05",
    to: "2026-08-05",
    accommodation: {
      name: "Le Chalet Montegut",
      address: "26-30 Route du Pont, 03000 Coulandon, Francia",
      checkIn: "dalle 16:00",
      notes: "Tappa breve in zona Moulins: arrivare con margine e cena semplice.",
      bookingUrl: "https://www.booking.com/hotel/fr/le-chalet-monta-c-gut.it.html",
      mapsUrl: mapsUrl("26-30 Route du Pont, 03000 Coulandon, France")
    }
  },
  {
    from: "2026-08-06",
    to: "2026-08-08",
    accommodation: {
      name: "Airbnb da Tom",
      address: "11 Rue Saint-Michel, 37550 Saint-Avertin, Francia",
      checkIn: "secondo accordi con Tom",
      notes: "Base Loira: tenere il link Airbnb o messaggio host a portata di mano.",
      bookingUrl: null,
      mapsUrl: mapsUrl("11 Rue Saint-Michel, 37550 Saint-Avertin, France")
    }
  },
  {
    from: "2026-08-09",
    to: "2026-08-11",
    accommodation: {
      name: "Novotel Suites Rouen Normandie",
      address: "10 Quai de Boisguilbert, 76000 Rouen, Francia",
      checkIn: "dalle 14:00",
      notes: "Soggiorno 9-12 agosto. Base comoda sul lungosenna per Rouen e gite normanne.",
      bookingUrl: "https://www.booking.com/hotel/fr/suitehotel-rouen-normandie.it.html",
      mapsUrl: mapsUrl("10 Quai de Boisguilbert, 76000 Rouen, France")
    }
  },
  {
    from: "2026-08-12",
    to: "2026-08-15",
    accommodation: {
      name: "Camping des Gayeulles",
      address: "Rue du Professeur Maurice Audin, 35700 Rennes, Francia",
      checkIn: "arrivo possibile fino alle 23:00 con borne autonoma",
      notes: "Soggiorno 12-16 agosto. Camping nel parc des Gayeulles: natura vicina e centro raggiungibile.",
      bookingUrl: "https://www.camping-rennes.com/",
      mapsUrl: mapsUrl("Rue du Professeur Maurice Audin, 35700 Rennes, France")
    }
  },
  {
    from: "2026-08-16",
    to: "2026-08-16",
    accommodation: {
      name: "Appart'City Classic Blois",
      address: "20 Rue de la Chocolaterie, 41000 Blois, Francia",
      checkIn: "dalle 15:00",
      notes: "Soggiorno 16-17 agosto. Vicino a centro, stazione e castello.",
      bookingUrl: "https://www.booking.com/hotel/fr/apart-city-cap-affaires-blois.it.html",
      mapsUrl: mapsUrl("20 Rue de la Chocolaterie, 41000 Blois, France")
    }
  },
  {
    from: "2026-08-17",
    to: "2026-08-17",
    accommodation: {
      name: "Residence Montempo Appart'Hotel Lyon Cite Internationale",
      address: "35 Quai Charles de Gaulle, 69006 Lyon, Francia",
      checkIn: "dalle 15:00",
      notes: "Soggiorno 17-18 agosto. Base comoda per ripartire verso la montagna.",
      bookingUrl: "https://www.booking.com/hotel/fr/residence-hoteliere-temporim-cite-internationale.it.html",
      mapsUrl: mapsUrl("35 Quai Charles de Gaulle, 69006 Lyon, France")
    }
  },
  {
    from: "2026-08-18",
    to: "2026-08-21",
    accommodation: {
      name: "Casa di Eveline",
      address: "La Toussuire, Francia - Chalet di Eveline",
      checkIn: "Secondo accordi con Eveline",
      notes: "Seconda parte in quota: recupero, aria buona e ritmi bassi.",
      bookingUrl: null,
      mapsUrl: mapsUrl("La Toussuire France")
    }
  },
  {
    from: "2026-08-22",
    to: "2026-08-22",
    accommodation: {
      name: "Rientro",
      address: "Rossiglione, Italia",
      checkIn: null,
      notes: "Arrivo finale.",
      bookingUrl: null,
      mapsUrl: mapsUrl("Rossiglione Italy")
    }
  }
];

const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));

for (const day of trip.days) {
  const stay = stays.find((item) => day.date >= item.from && day.date <= item.to);
  if (stay) day.accommodation = stay.accommodation;
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
