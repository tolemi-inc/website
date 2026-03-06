export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, organization, message } = data;

    if (!name || !email || !organization) {
      return new Response(JSON.stringify({ error: 'Name, email, and organization are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const webhookUrl = import.meta.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL is not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slackMessage = {
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🎯 New Demo Request', emoji: true },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Email:*\n${email}` },
            { type: 'mrkdwn', text: `*Organization:*\n${organization}` },
          ],
        },
        ...(message
          ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Message:*\n${message}` } }]
          : []),
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `Submitted from tolemi.com · ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET` },
          ],
        },
      ],
    };

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });

    if (!slackRes.ok) {
      console.error('Slack webhook failed:', slackRes.status, await slackRes.text());
      return new Response(JSON.stringify({ error: 'Failed to submit request.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Demo request error:', err);
    return new Response(JSON.stringify({ error: 'Unexpected error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
