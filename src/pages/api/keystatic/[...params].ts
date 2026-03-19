// This file intentionally re-exports Keystatic's API handler.
// The @keystatic/astro integration injects this route automatically,
// but this explicit file is kept for clarity.
export { ALL, prerender } from '@keystatic/astro/internal/keystatic-api.js';
