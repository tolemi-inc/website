export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  const secret = process.env.KEYSTATIC_SECRET;

  const info: Record<string, unknown> = {
    KEYSTATIC_GITHUB_CLIENT_ID: clientId ? `set (${clientId.length} chars, starts with ${clientId.slice(0, 4)}...)` : 'NOT SET',
    KEYSTATIC_GITHUB_CLIENT_SECRET: clientSecret ? `set (${clientSecret.length} chars)` : 'NOT SET',
    KEYSTATIC_SECRET: secret ? `set (${secret.length} chars)` : 'NOT SET',
  };

  // Test the token endpoint with a dummy code to see what error GitHub returns
  if (clientId && clientSecret) {
    const url = new URL('https://github.com/login/oauth/access_token');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('client_secret', clientSecret);
    url.searchParams.set('code', 'test_invalid_code');

    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    info.github_token_endpoint_status = res.status;
    info.github_token_endpoint_body = await res.json();
  }

  return new Response(JSON.stringify(info, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
