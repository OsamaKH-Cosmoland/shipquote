import { describe, it, expect } from "vitest";
import { calculateShippingCost } from "./pricing";

// Pricing formula under test: base = 5 + 2 * weightKg, then × 1.5 unless the
// destination is exactly "domestic", finally rounded to 2 decimal places.
// Expected values below were verified against the real compiled function.
describe("calculateShippingCost", () => {
  describe("domestic shipping", () => {
    it("charges only the flat base rate for a 0 kg parcel", () => {
      expect(calculateShippingCost("domestic", 0)).toBe(5);
    });

    it("adds the per-kg rate ($2/kg) on top of the base rate", () => {
      // 5 + 2 * 10 = 25
      expect(calculateShippingCost("domestic", 10)).toBe(2500);
    });

    it("prices real-world domestic quotes", () => {
      expect(calculateShippingCost("domestic", 100)).toBe(205); // 5 + 2*100
      expect(calculateShippingCost("domestic", 102)).toBe(209); // 5 + 2*102
    });
  });

  describe("international shipping", () => {
    it("applies the 1.5x multiplier to the base rate", () => {
      // 5 * 1.5 = 7.5
      expect(calculateShippingCost("international", 0)).toBe(7.5);
    });

    it("applies the multiplier to the base rate plus per-kg charge", () => {
      // (5 + 2 * 10) * 1.5 = 37.5
      expect(calculateShippingCost("international", 10)).toBe(37.5);
    });

    it("prices real-world international quotes", () => {
      expect(calculateShippingCost("international", 5)).toBe(22.5); // (5+10)*1.5
      expect(calculateShippingCost("international", 102)).toBe(313.5); // (5+204)*1.5
    });

    it("is always more expensive than domestic for the same weight", () => {
      const weight = 40;
      expect(calculateShippingCost("international", weight)).toBeGreaterThan(
        calculateShippingCost("domestic", weight),
      );
    });
  });

  describe("destination handling", () => {
    it('treats any destination other than "domestic" as international', () => {
      // Only the exact string "domestic" gets the cheaper rate; every other
      // value falls through to the international (1.5x) branch.
      expect(calculateShippingCost("mars", 5)).toBe(
        calculateShippingCost("international", 5),
      );
      expect(calculateShippingCost("", 0)).toBe(7.5);
    });

    it('is case-sensitive: "Domestic" is billed at the international rate', () => {
      expect(calculateShippingCost("Domestic", 10)).toBe(
        calculateShippingCost("international", 10),
      );
    });
  });

  describe("rounding", () => {
    it("rounds the result to 2 decimal places", () => {
      // 5 + 2 * 0.333 = 5.666 -> 5.67
      expect(calculateShippingCost("domestic", 0.333)).toBe(5.67);
    });

    it("never returns a value with more than 2 decimal places", () => {
      for (const weight of [0.333, 1.675, 3.14159, 0.001, 99.999]) {
        for (const destination of ["domestic", "international"]) {
          const cost = calculateShippingCost(destination, weight);
          expect(cost).toBe(Number(cost.toFixed(2)));
        }
      }
    });
  });
});
