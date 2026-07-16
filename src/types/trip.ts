export type Coordinates = {
  name: string;
  lat: number;
  lng: number;
};

export type HeroImage = {
  src: string;
  alt: string;
  author: string;
  sourceName: string;
  sourceUrl: string | null;
  license: string;
  status: "ready" | "placeholder" | "to_add";
};

export type TimelineItem = {
  time: string;
  title: string;
  description: string;
  kind: string;
};

export type RouteSegment = {
  from: string;
  to: string;
  distanceKm: number;
  drivingMinutes: number;
  batteryStartPct: number;
  batteryEndPct: number;
  stop: string;
  operator: string;
  powerKw: number | null;
  services: string[];
  backupA: string;
  backupB: string | null;
  lastVerified: string | null;
};

export type RoutePlan = {
  start: Coordinates;
  end: Coordinates;
  distanceKm: number | null;
  drivingMinutes: number | null;
  segments: RouteSegment[];
  chargingStops: unknown[];
  externalNavigation: Array<{ label: string; url: string }>;
};

export type Place = {
  name: string;
  category: string;
  description: string;
  duration: string;
  priority: string;
  bookingRequired: string;
  lat: number;
  lng: number;
  officialUrl: string | null;
  image?: HeroImage;
  story?: string;
  curiosity?: string;
  matiAngle?: string;
};

export type DayPlan = {
  id: string;
  date: string;
  dayNumber: number;
  type: "base" | "transfer";
  base: string;
  title: string;
  subtitle: string;
  intro: string;
  personalNote: string;
  heroImage: HeroImage;
  accommodation: {
    name: string;
    address: string | null;
    checkIn: string | null;
    notes: string;
    bookingUrl?: string | null;
    mapsUrl?: string | null;
  };
  timeline: TimelineItem[];
  route: RoutePlan | null;
  places: Place[];
  babyNotes: Record<string, string | number | string[] | null>;
  practicalInfo: Record<string, unknown>;
  foodRecommendations?: Array<{
    name: string;
    city: string;
    style: string;
    budget: string;
    note: string;
    mapsUrl: string;
    sourceUrl?: string | null;
  }>;
  parkingOptions?: Array<{
    name: string;
    area: string;
    hasCharging: boolean | null;
    note: string;
    mapsUrl: string;
  }>;
  ticketLinks?: Array<{
    name: string;
    url: string;
    note: string;
  }>;
  weatherLocation: Coordinates;
  backupPlans: Array<{ condition: string; plan: string }>;
  bookings: Array<{ name: string; status: string; time: string; address: string; codeOrNote: string }>;
  sources: Array<{ name: string; url: string; lastVerified: string | null }>;
  lastVerified: string | null;
};

export type Trip = {
  schemaVersion: string;
  tripId: string;
  title: string;
  sourceOfTruth: {
    file: string;
    importedAt: string;
    notes: string;
  };
  days: DayPlan[];
};

export type Settings = {
  schemaVersion: string;
  app: {
    id: string;
    title: string;
    subtitle: string;
    language: string;
    timezone: string;
    startDate: string;
    endDate: string;
    dailyUnlockTime: string;
    futureDaysVisibility: string;
    pastDaysRemainAccessible: boolean;
    storeRevealStateLocally: boolean;
    offlineMode: boolean;
  };
  travellers: {
    primaryGuestName: string;
    organizerName: string;
    baby: {
      name: string;
      ageMonthsAtTrip: number;
      maxContinuousCarMinutes: number;
      notes: string;
    };
  };
  journey: {
    outboundStart: { name: string; country: string };
    returnDestination: { name: string; country: string };
  };
  vehicle: {
    make: string;
    model: string;
    batteryCapacityKWh: number;
    prudentHighwayRangeKm: number;
    maxContinuousDrivingMinutes: number;
    maxDcPowerKw: number | null;
    chargingStrategy: Record<string, boolean>;
  };
  admin: {
    enabled: boolean;
    passwordHashAlgorithm: "SHA-256";
    passwordHash: string;
    openMethods: string[];
    warning: string;
  };
  features: Record<string, boolean>;
};
