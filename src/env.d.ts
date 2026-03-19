/// <reference types="astro/client" />

declare module 'virtual:keystatic-config' {
  const config: import('@keystatic/core').Config;
  export default config;
}
