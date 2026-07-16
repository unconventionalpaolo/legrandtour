import { describe, expect, it } from "vitest";
import { settingsFixture, tripFixture } from "../test/fixtures";
import { settingsSchema, tripSchema } from "./schemas";

describe("validazione dati", () => {
  it("accetta settings validi", () => {
    expect(settingsSchema.parse(settingsFixture).app.title).toBe("Bonjour Mur Mur");
  });

  it("accetta trip validi", () => {
    expect(tripSchema.parse(tripFixture).days).toHaveLength(3);
  });

  it("gestisce dati mancanti con errore leggibile", () => {
    const result = tripSchema.safeParse({ ...tripFixture, days: [{ id: "rotto" }] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.length).toBeGreaterThan(0);
  });
});
