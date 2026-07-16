import { z } from "zod";

const coordinatesSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number()
});

const routeSegmentSchema = z.object({
  from: z.string(),
  to: z.string(),
  distanceKm: z.number(),
  drivingMinutes: z.number(),
  batteryStartPct: z.number(),
  batteryEndPct: z.number(),
  stop: z.string(),
  operator: z.string(),
  powerKw: z.number().nullable(),
  services: z.array(z.string()),
  backupA: z.string(),
  backupB: z.string().nullable(),
  lastVerified: z.string().nullable()
});

const heroImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  author: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string().nullable(),
  license: z.string(),
  status: z.enum(["ready", "placeholder", "to_add"])
});

const daySchema = z.object({
  id: z.string(),
  date: z.string(),
  dayNumber: z.number(),
  type: z.enum(["base", "transfer"]),
  base: z.string(),
  title: z.string(),
  subtitle: z.string(),
  intro: z.string(),
  personalNote: z.string(),
  heroImage: heroImageSchema,
  accommodation: z.object({
    name: z.string(),
    address: z.string().nullable(),
    checkIn: z.string().nullable(),
    notes: z.string(),
    bookingUrl: z.string().nullable().optional(),
    mapsUrl: z.string().nullable().optional()
  }),
  timeline: z.array(
    z.object({
      time: z.string(),
      title: z.string(),
      description: z.string(),
      kind: z.string()
    })
  ),
  route: z
    .object({
      start: coordinatesSchema,
      end: coordinatesSchema,
      distanceKm: z.number().nullable(),
      drivingMinutes: z.number().nullable(),
      segments: z.array(routeSegmentSchema),
      chargingStops: z.array(z.unknown()),
      externalNavigation: z.array(z.object({ label: z.string(), url: z.string() }))
    })
    .nullable(),
  places: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      description: z.string(),
      duration: z.string(),
      priority: z.string(),
      bookingRequired: z.string(),
      lat: z.number(),
      lng: z.number(),
      officialUrl: z.string().nullable(),
      image: heroImageSchema.optional(),
      story: z.string().optional(),
      curiosity: z.string().optional(),
      matiAngle: z.string().optional()
    })
  ),
  babyNotes: z.record(z.string(), z.union([z.string(), z.number(), z.array(z.string()), z.null()])),
  practicalInfo: z.record(z.string(), z.unknown()),
  foodRecommendations: z
    .array(
      z.object({
        name: z.string(),
        city: z.string(),
        style: z.string(),
        budget: z.string(),
        note: z.string(),
        mapsUrl: z.string(),
        sourceUrl: z.string().nullable().optional()
      })
    )
    .optional(),
  parkingOptions: z
    .array(
      z.object({
        name: z.string(),
        area: z.string(),
        hasCharging: z.boolean().nullable(),
        note: z.string(),
        mapsUrl: z.string()
      })
    )
    .optional(),
  ticketLinks: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        note: z.string()
      })
    )
    .optional(),
  weatherLocation: coordinatesSchema,
  backupPlans: z.array(z.object({ condition: z.string(), plan: z.string() })),
  bookings: z.array(
    z.object({
      name: z.string(),
      status: z.string(),
      time: z.string(),
      address: z.string(),
      codeOrNote: z.string()
    })
  ),
  sources: z.array(z.object({ name: z.string(), url: z.string(), lastVerified: z.string().nullable() })),
  lastVerified: z.string().nullable()
});

export const tripSchema = z.object({
  schemaVersion: z.string(),
  tripId: z.string(),
  title: z.string(),
  sourceOfTruth: z.object({
    file: z.string(),
    importedAt: z.string(),
    notes: z.string()
  }),
  days: z.array(daySchema).min(1)
});

export const settingsSchema = z.object({
  schemaVersion: z.string(),
  app: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    language: z.string(),
    timezone: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    dailyUnlockTime: z.string(),
    futureDaysVisibility: z.string(),
    pastDaysRemainAccessible: z.boolean(),
    storeRevealStateLocally: z.boolean(),
    offlineMode: z.boolean()
  }),
  travellers: z.object({
    primaryGuestName: z.string(),
    organizerName: z.string(),
    baby: z.object({
      name: z.string(),
      ageMonthsAtTrip: z.number(),
      maxContinuousCarMinutes: z.number(),
      notes: z.string()
    })
  }),
  journey: z.object({
    outboundStart: z.object({ name: z.string(), country: z.string() }),
    returnDestination: z.object({ name: z.string(), country: z.string() })
  }),
  vehicle: z.object({
    make: z.string(),
    model: z.string(),
    batteryCapacityKWh: z.number(),
    prudentHighwayRangeKm: z.number(),
    maxContinuousDrivingMinutes: z.number(),
    maxDcPowerKw: z.number().nullable(),
    chargingStrategy: z.record(z.string(), z.boolean())
  }),
  admin: z.object({
    enabled: z.boolean(),
    passwordHashAlgorithm: z.literal("SHA-256"),
    passwordHash: z.string(),
    openMethods: z.array(z.string()),
    warning: z.string()
  }),
  features: z.record(z.string(), z.boolean())
});
