export type UseCaseColor = "sky" | "red" | "green" | "yellow";

export const useCaseColorClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky/10 text-tolemi-sky-700 border-tolemi-sky/30 hover:bg-tolemi-sky/20",
  red: "bg-tolemi-red/10 text-tolemi-red border-tolemi-red/30 hover:bg-tolemi-red/20",
  green: "bg-tolemi-green/10 text-tolemi-green-700 border-tolemi-green/30 hover:bg-tolemi-green/20",
  yellow: "bg-tolemi-yellow/15 text-tolemi-dark border-tolemi-yellow/40 hover:bg-tolemi-yellow/25",
};

export const useCaseActiveClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky-500 text-white border-tolemi-sky-500",
  red: "bg-tolemi-red text-white border-tolemi-red",
  green: "bg-tolemi-green-500 text-white border-tolemi-green-500",
  yellow: "bg-tolemi-yellow text-tolemi-dark border-tolemi-yellow",
};

const explicitMap: Record<string, UseCaseColor> = {
  "code-enforcement": "red",
  "long-term-rental-registration": "green",
  "short-term-rental-registration": "sky",
};

const fallbackPalette: UseCaseColor[] = ["red", "yellow", "sky", "green"];

export function colorForUseCase(slug: string): UseCaseColor {
  if (slug in explicitMap) return explicitMap[slug];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return fallbackPalette[h % fallbackPalette.length];
}
