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
      address: "La Toussuire, Francia - indirizzo preciso TODO",
      checkIn: "TODO",
      notes: "Aggiungere indirizzo preciso.",
      bookingUrl: null,
      mapsUrl: mapsUrl("La Toussuire France")
    }
  },
  {
    from: "2026-08-03",
    to: "2026-08-04",
    accommodation: {
      name: "Residence Montempo Appart'Hôtel Lyon Cité Internationale",
      address: "Lione, Cité Internationale - indirizzo esatto da Booking da verificare",
      checkIn: "TODO",
      notes: "Soggiorno 3-5 agosto.",
      bookingUrl: "https://www.booking.com/hotel/fr/residence-hoteliere-temporim-cite-internationale.it.html",
      mapsUrl: mapsUrl("Residence Montempo Appart'Hôtel Lyon Cité Internationale")
    }
  },
  {
    from: "2026-08-05",
    to: "2026-08-05",
    accommodation: {
      name: "Le Chalet Montégut",
      address: "Zona Moulins - indirizzo esatto da Booking da verificare",
      checkIn: "TODO",
      notes: "Soggiorno 5-6 agosto.",
      bookingUrl: "https://www.booking.com/hotel/fr/le-chalet-monta-c-gut.it.html",
      mapsUrl: mapsUrl("Le Chalet Montégut Moulins France")
    }
  },
  {
    from: "2026-08-06",
    to: "2026-08-08",
    accommodation: {
      name: "Airbnb da Tom",
      address: "11 Rue Saint-Michel, Saint-Avertin, Centro-Valle della Loira 37550, Francia",
      checkIn: "TODO",
      notes: "Soggiorno 6-9 agosto.",
      bookingUrl: null,
      mapsUrl: mapsUrl("11 Rue Saint-Michel, 37550 Saint-Avertin, France")
    }
  },
  {
    from: "2026-08-09",
    to: "2026-08-11",
    accommodation: {
      name: "Novotel Suites Rouen Normandie",
      address: "Rouen, Normandia - indirizzo esatto da Booking da verificare",
      checkIn: "TODO",
      notes: "Soggiorno 9-12 agosto.",
      bookingUrl: "https://www.booking.com/hotel/fr/suitehotel-rouen-normandie.it.html",
      mapsUrl: mapsUrl("Novotel Suites Rouen Normandie")
    }
  },
  {
    from: "2026-08-12",
    to: "2026-08-15",
    accommodation: {
      name: "Camping des Gayeulles",
      address: "Rennes, Parc des Gayeulles - indirizzo esatto da verificare",
      checkIn: "TODO",
      notes: "Soggiorno 12-16 agosto.",
      bookingUrl: "https://www.camping-rennes.com/",
      mapsUrl: mapsUrl("Camping des Gayeulles Rennes")
    }
  },
  {
    from: "2026-08-16",
    to: "2026-08-16",
    accommodation: {
      name: "Appart'City Classic Blois",
      address: "Blois - indirizzo esatto da Booking da verificare",
      checkIn: "TODO",
      notes: "Soggiorno 16-17 agosto.",
      bookingUrl: "https://www.booking.com/hotel/fr/apart-city-cap-affaires-blois.it.html",
      mapsUrl: mapsUrl("Appart'City Classic Blois")
    }
  },
  {
    from: "2026-08-17",
    to: "2026-08-17",
    accommodation: {
      name: "Residence Montempo Appart'Hôtel Lyon Cité Internationale",
      address: "Lione, Cité Internationale - indirizzo esatto da Booking da verificare",
      checkIn: "TODO",
      notes: "Soggiorno 17-18 agosto.",
      bookingUrl: "https://www.booking.com/hotel/fr/residence-hoteliere-temporim-cite-internationale.it.html",
      mapsUrl: mapsUrl("Residence Montempo Appart'Hôtel Lyon Cité Internationale")
    }
  },
  {
    from: "2026-08-18",
    to: "2026-08-21",
    accommodation: {
      name: "Casa di Eveline",
      address: "La Toussuire, Francia - indirizzo preciso TODO",
      checkIn: "TODO",
      notes: "Aggiungere indirizzo preciso.",
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
