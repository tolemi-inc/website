export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import config from 'virtual:keystatic-config';

export const ALL = makeHandler({ config });
