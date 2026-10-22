export type UseCaseColor = "sky" | "red" | "yellow";

// Bold tinted pills with consistent dark text; active state is a solid dark fill
// (matching the "All" pill) and the brand color lives on in the leading dot.
export const useCaseColorClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky-200 text-tolemi-dark hover:bg-tolemi-sky-300",
  red: "bg-tolemi-red-100 text-tolemi-dark hover:bg-tolemi-red-200",
  yellow: "bg-tolemi-yellow-200 text-tolemi-dark hover:bg-tolemi-yellow-300",
};

export const useCaseActiveClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-dark text-white",
  red: "bg-tolemi-dark text-white",
  yellow: "bg-tolemi-dark text-white",
};

export const useCaseDotClasses: Record<UseCaseColor, string> = {
  sky: "bg-tolemi-sky-500",
  red: "bg-tolemi-red-400",
  yellow: "bg-tolemi-yellow-400",
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
