import { beforeEach, describe, expect, it } from "vitest";
import { clearStoredPreview, getStoredPreview, isOpened, markOpened, setStoredPreview } from "./storage";

describe("storage locale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("cancella l'anteprima admin senza cancellare le giornate sviluppate", () => {
    setStoredPreview("2026-08-10", "09:00");
    markOpened("2026-08-01");

    clearStoredPreview();

    expect(getStoredPreview()).toBeNull();
    expect(isOpened("2026-08-01")).toBe(true);
  });
});
