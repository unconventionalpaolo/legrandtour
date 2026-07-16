import type { EffectiveDateTime } from "./time";

const previewKey = "murMurPreview";
const openedPrefix = "murMurOpened:";

export function getStoredPreview(): EffectiveDateTime | null {
  const value = localStorage.getItem(previewKey);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as EffectiveDateTime;
    if (!parsed.date || !parsed.time) return null;
    return { ...parsed, preview: true };
  } catch {
    return null;
  }
}

export function setStoredPreview(date: string, time: string): void {
  localStorage.setItem(previewKey, JSON.stringify({ date, time, preview: true }));
}

export function clearStoredPreview(): void {
  localStorage.removeItem(previewKey);
}

export function markOpened(dayId: string): void {
  localStorage.setItem(`${openedPrefix}${dayId}`, "1");
}

export function markUnopened(dayId: string): void {
  localStorage.removeItem(`${openedPrefix}${dayId}`);
}

export function isOpened(dayId: string): boolean {
  return localStorage.getItem(`${openedPrefix}${dayId}`) === "1";
}

export function resetMurMurStorage(): void {
  Object.keys(localStorage)
    .filter((key) => key === previewKey || key.startsWith(openedPrefix) || key.startsWith("murMurWeather:"))
    .forEach((key) => localStorage.removeItem(key));
}
