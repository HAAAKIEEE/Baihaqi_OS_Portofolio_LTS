interface KvNamespaceBinding {
  get(key: string, type?: 'text' | 'json'): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  ASSETS: AssetsBinding;
  PORTFOLIO_KV?: KvNamespaceBinding;
  ADMIN_PASSWORD?: string;
}

const KV_KEY = 'portfolio_data';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function getExpectedPassword(env: Env): string {
  return env.ADMIN_PASSWORD || 'Baihaqi123!@#';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/portfolio') {
      if (request.method === 'GET') {
        if (!env.PORTFOLIO_KV) {
          return jsonResponse({ ok: true, storage: 'local-only', data: null });
        }
        const stored = await env.PORTFOLIO_KV.get(KV_KEY, 'json');
        return jsonResponse({
          ok: true,
          storage: 'cloudflare-kv',
          data: stored ?? null,
        });
      }

      const providedPassword = request.headers.get('x-admin-password') ?? '';
      if (providedPassword !== getExpectedPassword(env)) {
        return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
      }

      if (!env.PORTFOLIO_KV) {
        return jsonResponse(
          { ok: false, error: 'PORTFOLIO_KV binding belum dikonfigurasi di wrangler.jsonc' },
          503
        );
      }

      if (request.method === 'PUT') {
        try {
          const payload = await request.json();
          await env.PORTFOLIO_KV.put(KV_KEY, JSON.stringify(payload));
          return jsonResponse({
            ok: true,
            storage: 'cloudflare-kv',
            savedAt: new Date().toISOString(),
          });
        } catch {
          return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
        }
      }

      if (request.method === 'DELETE') {
        await env.PORTFOLIO_KV.delete(KV_KEY);
        return jsonResponse({ ok: true, storage: 'cloudflare-kv' });
      }

      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }

    if (url.pathname === '/api/admin/auth' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { password?: string };
        if (body.password === getExpectedPassword(env)) {
          return jsonResponse({ ok: true });
        }
        return jsonResponse({ ok: false, error: 'Invalid password' }, 401);
      } catch {
        return jsonResponse({ ok: false, error: 'Bad request' }, 400);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
