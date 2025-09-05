/**
 * Clamp `x` between `left` and `right`.
 *
 * `left` is expected to be less then `right`.
 */
export function clamp (left: number, x: number, right: number): number {
  return Math.max(left, Math.min(x, right));
}

/**
 * Escape \\r, \\n, \\t characters in a string.
 */
export function escapeWhitespace (str: string): string {
  return str.replace(/(\t)|(\r)|(\n)/g, (m, t, r) => t ? '\\t' : r ? '\\r' : '\\n');
}
