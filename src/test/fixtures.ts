import type { DayPlan, Settings, Trip } from "../types/trip";

export const settingsFixture: Settings = {
  schemaVersion: "1.0.0",
  app: {
    id: "bonjour-mur-mur",
    title: "Bonjour Mur Mur",
    subtitle: "23 Polaroid francesi",
    language: "it",
    timezone: "Europe/Paris",
    startDate: "2026-07-31",
    endDate: "2026-08-22",
    dailyUnlockTime: "05:00",
    futureDaysVisibility: "hidden",
    pastDaysRemainAccessible: true,
    storeRevealStateLocally: true,
    offlineMode: true
  },
  travellers: {
    primaryGuestName: "Mur Mur",
    organizerName: "Paolo",
    baby: {
      name: "Atti",
      ageMonthsAtTrip: 5,
      maxContinuousCarMinutes: 90,
      notes: ""
    }
  },
  journey: {
    outboundStart: { name: "Rossiglione", country: "Italia" },
    returnDestination: { name: "Rossiglione", country: "Italia" }
  },
  vehicle: {
    make: "Volvo",
    model: "XC40 Recharge",
    batteryCapacityKWh: 72,
    prudentHighwayRangeKm: 200,
    maxContinuousDrivingMinutes: 90,
    maxDcPowerKw: null,
    chargingStrategy: { preferFastDC: true }
  },
  admin: {
    enabled: true,
    passwordHashAlgorithm: "SHA-256",
    passwordHash: "187bbe43a16871c359636b724645272b288532eab7238de56e1580b75fa8ec49",
    openMethods: [],
    warning: ""
  },
  features: { weather: true }
};

function day(id: string, dayNumber: number): DayPlan {
  return {
    id,
    date: id,
    dayNumber,
    type: "base",
    base: "Base",
    title: `Giornata ${dayNumber}`,
    subtitle: "Sottotitolo",
    intro: "Intro",
    personalNote: "",
    heroImage: {
      src: "/images/placeholder.svg",
      alt: "Placeholder",
      author: "Placeholder",
      sourceName: "Fixture source",
      sourceUrl: null,
      license: "Fixture license",
      status: "placeholder"
    },
    accommodation: { name: "Alloggio fixture", address: "Indirizzo fixture", checkIn: "dalle 15:00", notes: "" },
    timeline: [{ time: "Mattina", title: "Test", description: "Test", kind: "test" }],
    route: null,
    places: [],
    babyNotes: { carMinutes: "0 minuti", pauseIdeas: "Base", whatToBring: ["Cambio"] },
    practicalInfo: { narrative: "Racconto fixture" },
    foodRecommendations: [],
    parkingOptions: [],
    ticketLinks: [],
    weatherLocation: { name: "Base", lat: 45, lng: 7 },
    backupPlans: [{ condition: "Pioggia", plan: "Piano B" }],
    bookings: [],
    sources: [{ name: "Fonte", url: "https://example.com", lastVerified: null }],
    lastVerified: null
  };
}

export const daysFixture = [day("2026-07-31", 1), day("2026-08-01", 2), day("2026-08-22", 23)];

export const tripFixture: Trip = {
  schemaVersion: "1.0.0",
  tripId: "test",
  title: "Test",
  sourceOfTruth: { file: "test", importedAt: "2026-07-15", notes: "test" },
  days: daysFixture
};
