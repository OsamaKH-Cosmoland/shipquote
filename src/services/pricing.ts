const BASE_RATE = 5;
const RATE_PER_KG = 2;
const INTERNATIONAL_MULTIPLIER = 1.5;

export function calculateShippingCost(destination: string, weightKg: number): number {
  const base = BASE_RATE + RATE_PER_KG * weightKg;
  const cost = destination === "domestic" ? base : base * INTERNATIONAL_MULTIPLIER;
  return Math.round(cost * 100) / 100;
}
