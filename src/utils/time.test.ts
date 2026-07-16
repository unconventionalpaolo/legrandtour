import { describe, expect, it } from "vitest";
import { settingsFixture, daysFixture } from "../test/fixtures";
import {
  getCurrentUnlockedDay,
  getHiddenFutureDays,
  getUnlockedDays,
  isDayUnlocked,
  tripVisibility,
  type EffectiveDateTime
} from "./time";

function at(date: string, time: string, preview = false): EffectiveDateTime {
  return { date, time, preview };
}

describe("logica di sblocco", () => {
  it("riconosce una data precedente al viaggio", () => {
    expect(tripVisibility(settingsFixture, at("2026-07-30", "09:00"))).toBe("before");
    expect(getUnlockedDays(daysFixture, at("2026-07-30", "09:00"), settingsFixture)).toHaveLength(0);
  });

  it("mantiene il 31 luglio bloccato alle 04:59", () => {
    expect(isDayUnlocked(daysFixture[0], at("2026-07-31", "04:59"), settingsFixture)).toBe(false);
  });

  it("sblocca il 31 luglio alle 05:00", () => {
    expect(isDayUnlocked(daysFixture[0], at("2026-07-31", "05:00"), settingsFixture)).toBe(true);
  });

  it("sblocca la giornata corrente dopo l'orario", () => {
    expect(getCurrentUnlockedDay(daysFixture, at("2026-08-01", "09:00"), settingsFixture)?.id).toBe("2026-08-01");
  });

  it("nasconde le giornate future", () => {
    const hidden = getHiddenFutureDays(daysFixture, at("2026-08-01", "09:00"), settingsFixture);
    expect(hidden.map((day) => day.id)).toEqual(["2026-08-22"]);
  });

  it("mantiene consultabile una giornata passata", () => {
    const unlocked = getUnlockedDays(daysFixture, at("2026-08-01", "09:00"), settingsFixture);
    expect(unlocked.map((day) => day.id)).toContain("2026-07-31");
  });

  it("mostra tutto dopo il 22 agosto", () => {
    expect(getUnlockedDays(daysFixture, at("2026-08-23", "09:00"), settingsFixture)).toHaveLength(3);
  });

  it("l'override admin simula la data scelta senza sbloccare il futuro", () => {
    expect(getUnlockedDays(daysFixture, at("2026-08-01", "09:00", true), settingsFixture).map((day) => day.id)).toEqual([
      "2026-07-31",
      "2026-08-01"
    ]);
  });

  it("il reset admin torna alla data reale simulata", () => {
    expect(getUnlockedDays(daysFixture, at("2026-07-30", "09:00", false), settingsFixture)).toHaveLength(0);
  });

  it("filtra l'album usando solo giornate sbloccate", () => {
    expect(getUnlockedDays(daysFixture, at("2026-08-01", "05:00"), settingsFixture).map((day) => day.id)).toEqual([
      "2026-07-31",
      "2026-08-01"
    ]);
  });
});
