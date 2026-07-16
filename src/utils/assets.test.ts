import { describe, expect, it } from "vitest";
import { assetUrl } from "./assets";

describe("assetUrl", () => {
  it("mantiene gli URL remoti invariati", () => {
    expect(assetUrl("https://example.com/photo.jpg")).toBe("https://example.com/photo.jpg");
  });

  it("risolve gli asset locali rispetto alla base Vite", () => {
    expect(assetUrl("/images/photo.jpg")).toBe("/images/photo.jpg");
  });
});
