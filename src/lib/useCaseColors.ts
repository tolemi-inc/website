export type UseCaseColor = "sky" | "red" | "yellow";

export const useCaseColorClasses: Record<UseCaseColor, string> = {
  sky: "bg-gradient-to-r from-tolemi-sky-100 to-tolemi-yellow-100 text-tolemi-sky-700 hover:from-tolemi-sky-200 hover:to-tolemi-yellow-200",
  red: "bg-gradient-to-r from-tolemi-red-100 to-tolemi-yellow-100 text-tolemi-dark hover:from-tolemi-red-200 hover:to-tolemi-yellow-200",
  yellow: "bg-gradient-to-r from-tolemi-yellow-100 to-tolemi-sky-100 text-tolemi-dark hover:from-tolemi-yellow-200 hover:to-tolemi-sky-200",
};

export const useCaseActiveClasses: Record<UseCaseColor, string> = {
  sky: "bg-gradient-to-r from-tolemi-sky-600 to-tolemi-sky text-white",
  red: "bg-gradient-to-r from-tolemi-red to-tolemi-yellow text-white",
  yellow: "bg-gradient-to-r from-tolemi-yellow to-tolemi-sky text-tolemi-dark",
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
