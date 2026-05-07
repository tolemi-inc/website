export type UseCaseColor = "sky" | "indigo" | "green" | "coral" | "yellow";

export const useCaseColorClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky/10 text-tolemi-sky-700 border-tolemi-sky/30 hover:bg-tolemi-sky/20",
  indigo: "bg-tolemi-indigo/10 text-tolemi-indigo-600 border-tolemi-indigo/30 hover:bg-tolemi-indigo/20",
  green: "bg-tolemi-green/10 text-tolemi-green-700 border-tolemi-green/30 hover:bg-tolemi-green/20",
  coral: "bg-tolemi-coral/10 text-tolemi-coral-600 border-tolemi-coral/30 hover:bg-tolemi-coral/20",
  yellow: "bg-tolemi-yellow/15 text-tolemi-dark border-tolemi-yellow/40 hover:bg-tolemi-yellow/25",
};

export const useCaseActiveClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky-500 text-white border-tolemi-sky-500",
  indigo: "bg-tolemi-indigo-500 text-white border-tolemi-indigo-500",
  green: "bg-tolemi-green-500 text-white border-tolemi-green-500",
  coral: "bg-tolemi-coral-500 text-white border-tolemi-coral-500",
  yellow: "bg-tolemi-yellow text-tolemi-dark border-tolemi-yellow",
};

const explicitMap: Record<string, UseCaseColor> = {
  "code-enforcement": "indigo",
  "long-term-rental-registration": "green",
  "short-term-rental-registration": "sky",
};

const fallbackPalette: UseCaseColor[] = ["coral", "yellow", "sky", "indigo", "green"];

export function colorForUseCase(slug: string): UseCaseColor {
  if (slug in explicitMap) return explicitMap[slug];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return fallbackPalette[h % fallbackPalette.length];
}
