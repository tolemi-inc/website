export type UseCaseColor = "sky" | "red" | "yellow";

// Single-hue pills: soft tint + ring when inactive, solid fill when active.
// Pair with `ring-1 ring-inset` on the element so the ring color can swap.
export const useCaseColorClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky-50 text-tolemi-sky-700 ring-tolemi-sky-200 hover:bg-tolemi-sky-100",
  red: "bg-tolemi-red-50 text-tolemi-red-600 ring-tolemi-red-200 hover:bg-tolemi-red-100",
  yellow: "bg-tolemi-yellow-50 text-tolemi-dark ring-tolemi-yellow-300 hover:bg-tolemi-yellow-100",
};

export const useCaseActiveClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky-600 text-white ring-tolemi-sky-600",
  red: "bg-tolemi-red-500 text-white ring-tolemi-red-500",
  yellow: "bg-tolemi-yellow-400 text-tolemi-dark ring-tolemi-yellow-400",
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
