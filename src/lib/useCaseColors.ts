import { dotFill, type BrandAccent } from "./brandAccents";

export type UseCaseColor = BrandAccent;

// Filter pills are white with a hairline outline; the brand color lives only
// in the leading dot, and the active pill picks up a heavier matching ring.
// Ring shades are dark enough to hit 3:1 against white (WCAG 1.4.11).
export const useCaseActiveRingClasses: Record<UseCaseColor, string> = {
  sky: "ring-2 ring-tolemi-sky-700",
  red: "ring-2 ring-tolemi-red-500",
  yellow: "ring-2 ring-tolemi-yellow-700",
};

export const useCaseDotClasses: Record<UseCaseColor, string> = {
  sky: dotFill("sky"),
  red: dotFill("red"),
  yellow: dotFill("yellow"),
};

const explicitMap: Record<string, UseCaseColor> = {
  "code-enforcement": "red",
  "long-term-rental-registration": "yellow",
  "short-term-rental-registration": "sky",
};

const fallbackPalette: UseCaseColor[] = ["red", "yellow", "sky"];

export function colorForUseCase(slug: string): UseCaseColor {
  if (slug in explicitMap) return explicitMap[slug];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return fallbackPalette[h % fallbackPalette.length];
}
