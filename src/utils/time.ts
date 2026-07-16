import type { DayPlan, Settings } from "../types/trip";

export type EffectiveDateTime = {
  date: string;
  time: string;
  preview: boolean;
};

export type TripVisibility = "before" | "during" | "after";

export function parisParts(date = new Date(), timezone = "Europe/Paris"): EffectiveDateTime {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    preview: false
  };
}

export function compareDateTime(dayDate: string, unlockTime: string, effective: EffectiveDateTime): number {
  const left = `${effective.date}T${effective.time}`;
  const right = `${dayDate}T${unlockTime}`;
  return left.localeCompare(right);
}

export function isDayUnlocked(day: DayPlan, effective: EffectiveDateTime, settings: Settings): boolean {
  const unlockTime = settings.app.dailyUnlockTime || "05:00";
  return compareDateTime(day.date, unlockTime, effective) >= 0;
}

export function tripVisibility(settings: Settings, effective: EffectiveDateTime): TripVisibility {
  if (effective.date < settings.app.startDate) return "before";
  if (effective.date > settings.app.endDate) return "after";
  return "during";
}

export function getUnlockedDays(days: DayPlan[], effective: EffectiveDateTime, settings: Settings): DayPlan[] {
  const visibility = tripVisibility(settings, effective);
  if (visibility === "after") return [...days];
  if (visibility === "before") return [];
  return days.filter((day) => isDayUnlocked(day, effective, settings));
}

export function getCurrentUnlockedDay(
  days: DayPlan[],
  effective: EffectiveDateTime,
  settings: Settings
): DayPlan | null {
  const unlocked = getUnlockedDays(days, effective, settings);
  return unlocked.at(-1) ?? null;
}

export function getHiddenFutureDays(
  days: DayPlan[],
  effective: EffectiveDateTime,
  settings: Settings
): DayPlan[] {
  return days.filter((day) => !isDayUnlocked(day, effective, settings));
}

export function formatItalianDate(isoDate: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris"
  }).format(new Date(`${isoDate}T12:00:00+02:00`));
}

export function daysUntil(startDate: string, now = new Date()): number {
  const start = new Date(`${startDate}T05:00:00+02:00`).getTime();
  const current = now.getTime();
  return Math.max(0, Math.ceil((start - current) / 86_400_000));
}
