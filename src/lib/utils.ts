/**
 * Soleil – Shared utility helpers
 */

/**
 * Format a number as Bangladeshi Taka (BDT).
 * e.g. 4900 → "৳4,900"
 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Truncate a string to a given length and add ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

/**
 * Build a query string from a plain object, omitting undefined/null/empty values.
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}
