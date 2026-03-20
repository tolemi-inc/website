export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import config from 'virtual:keystatic-config';
import type { APIContext } from 'astro';

const keystatic = makeHandler({
  config,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});

export const ALL = async (context: APIContext) => {
  const url = new URL(context.request.url);

  // Temporarily intercept the OAuth callback to see the raw GitHub response
  if (url.pathname === '/api/keystatic/github/oauth/callback' && url.searchParams.has('code')) {
    const code = url.searchParams.get('code')!;
    const tokenUrl = new URL('https://github.com/login/oauth/access_token');
    tokenUrl.searchParams.set('client_id', process.env.KEYSTATIC_GITHUB_CLIENT_ID || '');
    tokenUrl.searchParams.set('client_secret', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || '');
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    const body = await tokenRes.json();
    return new Response(JSON.stringify({
      tokenEndpointStatus: tokenRes.status,
      tokenEndpointBody: body,
      clientIdPrefix: (process.env.KEYSTATIC_GITHUB_CLIENT_ID || '').slice(0, 6) + '...',
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return keystatic(context);
};
