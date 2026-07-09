/**
 * Merge class names, filtering out falsy values.
 * Minimal replacement for clsx/tailwind-merge — no dependency needed.
 */
export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
