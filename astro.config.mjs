// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  // Netlify sets URL to the site's primary domain at build time; used for
  // canonical and Open Graph URLs, which must be absolute.
  site: process.env.URL || 'https://tolemi-mkting.netlify.app',
  output: 'server',
  adapter: netlify(),
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
    cacheDir: '/tmp/vite-cache',
    optimizeDeps: {
      exclude: ['@keystatic/astro']
    }
  }
});
