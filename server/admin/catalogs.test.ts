import { describe, expect, it } from "vitest";
import { sanitizeCatalog, uploadPath } from "./catalogs";

describe("catalog validation", () => {
  it("sanitizes and sorts valid truck data", () => {
    const result = sanitizeCatalog("trucks", [
      { id: 2, brand: " Volvo ", model: "FH", year: 2020, status: "available", horsepower: 500 },
      { id: 1, brand: "Scania", model: "R500", year: 2019, status: "reserved", transmissionType: "automatic" },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, brand: "Scania", model: "R500" });
    expect(result[1]).toMatchObject({ id: 2, brand: "Volvo", horsepower: 500 });
  });

  it("rejects duplicate ids and unsupported status values", () => {
    expect(() => sanitizeCatalog("trailers", [
      { id: 1, brand: "Krone", model: "A", type: "Box", year: 2020, status: "available" },
      { id: 1, brand: "Krone", model: "B", type: "Box", year: 2021, status: "available" },
    ])).toThrow("INVALID_INPUT");

    expect(() => sanitizeCatalog("equipment", [
      { id: 1, brand: "CAT", model: "320", category: "Excavator", year: 2020, status: "hidden" },
    ])).toThrow("INVALID_INPUT");
  });

  it("accepts only supported image formats and safe item ids", () => {
    expect(uploadPath("trucks", 8, "image/webp")).toMatch(/^client\/public\/uploads\/trucks-8-\d+\.webp$/);
    expect(() => uploadPath("trucks", 8, "image/svg+xml")).toThrow("INVALID_INPUT");
    expect(() => uploadPath("equipment", 0, "image/jpeg")).toThrow("INVALID_INPUT");
  });
});
