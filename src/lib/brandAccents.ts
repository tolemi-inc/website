export type BrandAccent = "sky" | "yellow" | "red";

// The logo's three dot colors as gradient stops (pair with a
// `bg-gradient-to-*` direction). Each straddles the logo's flat fill so a dot
// reads as the same color: corner dots, tab dots, bullets, accent lines.
export const accentGradients: Record<BrandAccent, string> = {
  sky: "from-tolemi-sky-300 to-tolemi-sky-500",
  yellow: "from-tolemi-yellow-300 to-tolemi-yellow-500",
  red: "from-tolemi-red-300 to-tolemi-red-500",
};

// Dimmer twins for gradient text and thin icon strokes on light backgrounds,
// where the bright versions wash out. On navy, use accentGradients instead.
export const accentTextGradients: Record<BrandAccent, string> = {
  sky: "from-tolemi-sky-500 to-tolemi-sky-600",
  yellow: "from-tolemi-yellow-500 to-orange-500",
  red: "from-tolemi-red-400 to-tolemi-red-500",
};

// Solid stand-ins for strokes that can't take a gradient (arrows).
export const accentSolids: Record<BrandAccent, string> = {
  sky: "text-tolemi-sky-500",
  yellow: "text-orange-400",
  red: "text-tolemi-red-500",
};

export const dotFill = (accent: BrandAccent) => `bg-gradient-to-br ${accentGradients[accent]}`;

export const brandAccentCycle: BrandAccent[] = ["sky", "yellow", "red"];
