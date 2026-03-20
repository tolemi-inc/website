export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import config from 'virtual:keystatic-config';

export const ALL = makeHandler({
  config,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});
