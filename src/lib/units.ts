const WEIGHT_TO_GRAMS: Record<string, number> = {
  g: 1, gram: 1, grams: 1,
  kg: 1000, kilogram: 1000, kilograms: 1000,
};

const VOLUME_TO_ML: Record<string, number> = {
  ml: 1, millilitre: 1, millilitres: 1, milliliter: 1, milliliters: 1,
  l: 1000, litre: 1000, litres: 1000, liter: 1000, liters: 1000,
};

/**
 * Converts `qty` from `fromUnit` to `toUnit` when both are weight units or
 * both are volume units (e.g. pantry "1 kg" vs recipe "200 g"). Returns null
 * for count-style units ("medium", "piece", "leaves"...) or mismatched
 * dimensions (weight vs volume) — callers must treat null as "not
 * comparable", never as 0, so a unit mismatch never silently credits stock
 * that may not actually cover the need.
 */
export function convertQuantity(qty: number, fromUnit: string, toUnit: string): number | null {
  const from = fromUnit.trim().toLowerCase();
  const to = toUnit.trim().toLowerCase();
  if (from === to) return qty;
  if (from in WEIGHT_TO_GRAMS && to in WEIGHT_TO_GRAMS) {
    return (qty * WEIGHT_TO_GRAMS[from]) / WEIGHT_TO_GRAMS[to];
  }
  if (from in VOLUME_TO_ML && to in VOLUME_TO_ML) {
    return (qty * VOLUME_TO_ML[from]) / VOLUME_TO_ML[to];
  }
  return null;
}
