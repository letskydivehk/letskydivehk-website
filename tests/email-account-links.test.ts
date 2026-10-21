import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

// Run the real handlers without sending mail or accessing member data.
async function emailDestination(functionName: string, body: object, origin?: string) {
  let handler: ((req: Request) => Promise<Response>) | undefined;
  let sentHtml = '';
  const source = readFileSync(new URL(`../supabase/functions/${functionName}/index.ts`, import.meta.url), 'utf8');
  const code = new Bun.Transpiler({ loader: 'ts' }).transformSync(source.replace(/^import .*;\n/gm, ''));
  new Function('Deno', 'corsHeaders', 'createClient', 'z', 'fetch', code)(
    { env: { get: () => 'test-only' }, serve: (fn: typeof handler) => { handler = fn; } },
    {}, () => ({}), z,
    async (_url: string, options: RequestInit) => {
      sentHtml = JSON.parse(String(options.body)).html;
      return new Response('{}', { status: 200 });
    },
  );
  if (!handler) throw new Error('Email handler not registered');
  const response = await handler(new Request('https://example.test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(origin ? { origin } : {}) },
    body: JSON.stringify(body),
  }));
  expect(response.status).toBe(200);
  return [...sentHtml.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
}

describe('email account navigation', () => {
  it('credit expiry account button targets the personal profile', async () => {
    const destinations = await emailDestination('expire-credits', { preview_to: 'test@example.test' });
    expect(destinations).toContain('https://letskydivehk.com/member/profile');
    expect(destinations).not.toContain('https://letskydivehk.com/membership');
  });

  it('welcome account button targets the personal profile on each supported origin', async () => {
    for (const origin of ['https://letskydivehk.com', 'https://letskydivehk.lovable.app']) {
      const destinations = await emailDestination('send-welcome-email', {
        email: 'test@example.test', language: 'zh-TW',
      }, origin);
      expect(destinations).toContain(`${origin}/member/profile`);
      expect(destinations).not.toContain(`${origin}/membership`);
    }
  });
});