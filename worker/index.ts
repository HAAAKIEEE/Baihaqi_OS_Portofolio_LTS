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
  HELIPOD_AI_KEY?: string;
}

const KV_KEY = 'portfolio_data';
const HELIPOD_API_URL = 'https://ai.helipod.io/v1/chat/completions';
const HELIPOD_MODEL = 'qwen3.7-flash';

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

    if (url.pathname === '/api/ask' && request.method === 'POST') {
      return handleRagAsk(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

interface KnowledgeChunk {
  id: string;
  appId: string;
  file: string;
  stack: string;
  icon: string;
  accent: 'primary' | 'tertiary';
  content: string;
}

interface StoredPortfolio {
  profile?: {
    name?: string;
    role?: string;
    location?: string;
    email?: string;
    whatsappNumber?: string;
    githubUrl?: string;
    availabilityLabel?: string;
    bioSummary?: string;
  };
  projects?: Array<{ title?: string; summary?: string; stack?: string; category?: string }>;
  hiddenGitHubIds?: number[];
  experiences?: Array<{ role?: string; company?: string; period?: string; description?: string; highlights?: string[] }>;
  education?: { institution?: string; program?: string; period?: string; gpa?: string; honor?: string };
  competencies?: string[];
  skills?: Array<{ name?: string; category?: string; level?: number }>;
  workflows?: Array<{ tabLabel?: string; latency?: string }>;
}

interface GitHubRepoLite {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
}

async function fetchGitHubReposSafe(): Promise<GitHubRepoLite[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://api.github.com/users/HAAAKIEEE/repos?sort=updated&per_page=10', {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'baihaqi-os-portfolio-worker',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as GitHubRepoLite[]) : [];
  } catch {
    return [];
  }
}

function buildKnowledgeChunks(kv: StoredPortfolio | null, ghRepos: GitHubRepoLite[]): KnowledgeChunk[] {
  const p = kv?.profile;
  const edu = kv?.education;
  const exps = kv?.experiences;
  const skills = kv?.skills;
  const comps = kv?.competencies;
  const manualProjects = kv?.projects ?? [];
  const hiddenIds = new Set(kv?.hiddenGitHubIds ?? []);
  const visibleGh = ghRepos.filter((r) => !hiddenIds.has(r.id));

  const profileText = [
    `Nama: ${p?.name ?? 'Baihaqi'}`,
    `Role: ${p?.role ?? 'Web Developer & AI Automation Specialist'}`,
    `Lokasi: ${p?.location ?? 'Kalimantan Selatan, Indonesia (UTC+7)'}`,
    `Status: ${p?.availabilityLabel ?? 'Tersedia Proyek'}`,
    `Bio: ${p?.bioSummary ?? 'Profesional IT Support, Administrasi IT, Quality Assurance, dan Web Developer (D3 Teknik Informatika, IPK 3.87). Berpengalaman membangun aplikasi Laravel & MySQL sekaligus mengembangkan otomasi alur kerja AI (n8n, Agen LLM & integrasi langsung di sistem).'}`,
    `Pendidikan: ${edu?.institution ?? 'Politeknik Hasnur'} — ${edu?.program ?? 'D3 Teknik Informatika'} (${edu?.period ?? '2022–2025'}), ${edu?.gpa ?? 'IPK: 3.87 / 4.00'}, ${edu?.honor ?? 'Mahasiswa Berprestasi'}.`,
    `Bahasa: Bahasa Indonesia & Bahasa Inggris (Kemampuan Profesional).`,
  ].join('\n');

  const expText =
    exps && exps.length > 0
      ? exps
          .map(
            (e) =>
              `- ${e.role} di ${e.company} (${e.period}): ${e.description ?? ''} ${(e.highlights ?? []).join(' ')}`
          )
          .join('\n')
      : [
          '- Kepala Divisi IT | IT Support | Administrasi di PT Gadai Intira Nusantara (September 2025 – Sekarang): Memimpin tim IT (2 orang), mengelola administrasi digital, IT Support kantor pusat & cabang, Quality Assurance, serta mengembangkan aplikasi internal Laravel & MySQL (HRIS, Payroll, Absensi Online, KPI Dashboard, POS) di 2 server Linux VPS dan 2 shared hosting untuk 101 cabang & 20+ pengguna kantor pusat.',
          '- Freelance Web, AI Automation & Document Specialist (2024 – Sekarang): Membangun aplikasi web Laravel/Livewire untuk klien, merancang otomasi AI (n8n & integrasi langsung di sistem), deployment, maintenance, troubleshooting, serta pengolahan data & dokumen (Word, Excel, PowerPoint).',
        ].join('\n');

  const skillsText = [
    'Tech Stack Andalan: Laravel, Livewire, Tailwind CSS, PHP, MySQL, n8n Workflow Automation, dan Integrasi AI/LLM langsung di dalam sistem (OpenAI / Gemini / Qwen API).',
    skills && skills.length > 0
      ? `Detail Keahlian: ${skills.map((s) => `${s.name} (${s.level}%)`).join(', ')}`
      : '',
    comps && comps.length > 0 ? `Kompetensi Utama: ${comps.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const projectsLines: string[] = [];
  for (const mp of manualProjects) {
    projectsLines.push(`- [Manual] ${mp.title} (${mp.category}): ${mp.summary} | Stack: ${mp.stack}`);
  }
  for (const gh of visibleGh) {
    projectsLines.push(
      `- [GitHub] ${gh.name} (${gh.language ?? 'Code'}, ★${gh.stargazers_count}): ${gh.description ?? 'Repositori publik oleh HAAAKIEEE'} | URL: ${gh.html_url}`
    );
  }
  const projectsText =
    projectsLines.length > 0
      ? projectsLines.join('\n')
      : 'Repositori publik tersedia di https://github.com/HAAAKIEEE/';

  const contactText = [
    `Email: ${p?.email ?? 'haqi20082004@gmail.com'}`,
    `WhatsApp: ${p?.whatsappNumber ?? '089530203497'} (https://wa.me/6289530203497)`,
    `GitHub: ${p?.githubUrl ?? 'https://github.com/HAAAKIEEE/'}`,
    `CV: File PDF dapat diunduh di jendela tentang.md (/cv-baihaqi.pdf).`,
  ].join('\n');

  return [
    {
      id: 'about',
      appId: 'about',
      file: 'tentang.md',
      stack: 'Profil • Pendidikan • Bahasa',
      icon: 'person',
      accent: 'primary',
      content: profileText,
    },
    {
      id: 'experience',
      appId: 'about',
      file: 'pengalaman-kerja.md',
      stack: 'PT Gadai Intira Nusantara • Freelance',
      icon: 'work',
      accent: 'tertiary',
      content: expText,
    },
    {
      id: 'skills',
      appId: 'skills',
      file: 'keahlian (htop)',
      stack: 'Laravel • Livewire • n8n • AI Sistem',
      icon: 'layers',
      accent: 'primary',
      content: skillsText,
    },
    {
      id: 'projects',
      appId: 'projects',
      file: 'proyek & github/',
      stack: `${visibleGh.length} GitHub • ${manualProjects.length} Manual`,
      icon: 'folder_code',
      accent: 'tertiary',
      content: projectsText,
    },
    {
      id: 'contact',
      appId: 'contact',
      file: 'kontak.sh',
      stack: 'WhatsApp • Email • GitHub',
      icon: 'mail',
      accent: 'primary',
      content: contactText,
    },
  ];
}

function retrieveRelevantChunks(query: string, chunks: KnowledgeChunk[]): KnowledgeChunk[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const scored = chunks.map((chunk) => {
    const text = `${chunk.file} ${chunk.stack} ${chunk.content}`.toLowerCase();
    let score = chunk.id === 'about' ? 1 : 0;
    for (const token of tokens) {
      if (text.includes(token)) score += 3;
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((item) => item.chunk);
}

async function handleRagAsk(request: Request, env: Env): Promise<Response> {
  const startedAt = Date.now();
  try {
    const body = (await request.json()) as { query?: string };
    const query = (body.query ?? '').trim();
    if (!query) {
      return jsonResponse({ ok: false, error: 'Query is required' }, 400);
    }

    if (!env.HELIPOD_AI_KEY) {
      return jsonResponse({ ok: false, error: 'HELIPOD_AI_KEY secret is not configured' }, 503);
    }

    const [kvData, ghRepos] = await Promise.all([
      env.PORTFOLIO_KV ? (env.PORTFOLIO_KV.get(KV_KEY, 'json') as Promise<StoredPortfolio | null>) : Promise.resolve(null),
      fetchGitHubReposSafe(),
    ]);

    const allChunks = buildKnowledgeChunks(kvData, ghRepos);
    const retrieved = retrieveRelevantChunks(query, allChunks);
    const contextBlock = retrieved
      .map((c) => `### Sumber: ${c.file}\n${c.content}`)
      .join('\n\n');

    const systemPrompt = [
      'Kamu adalah Asisten AI resmi di portofolio Baihaqi OS.',
      'Jawab pertanyaan pengunjung secara akurat, ringkas, dan profesional dalam Bahasa Indonesia HANYA berdasarkan konteks portofolio berikut.',
      'Jika informasi tidak ada di konteks, katakan dengan jujur dan arahkan ke kontak WhatsApp (089530203497) atau email (haqi20082004@gmail.com).',
      'Kembalikan jawaban WAJIB dalam format JSON valid tanpa teks tambahan di luar JSON:',
      '{"summary":"Ringkasan jawaban 1-2 kalimat.","bullets":[{"title":"Poin singkat","detail":"Penjelasan ringkas"}],"followUps":[{"label":"Pertanyaan lanjutan singkat","question":"Kalimat pertanyaan lanjutan"}]}',
      '',
      'KONTEKS PORTOFOLIO:',
      contextBlock,
    ].join('\n');

    const llmRes = await fetch(HELIPOD_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.HELIPOD_AI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HELIPOD_MODEL,
        temperature: 0.3,
        max_tokens: 700,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      return jsonResponse(
        { ok: false, error: `LLM upstream HTTP ${llmRes.status}: ${errText.slice(0, 200)}` },
        502
      );
    }

    const llmJson = (await llmRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = llmJson.choices?.[0]?.message?.content?.trim() ?? '';
    const cleanedJson = rawContent.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    let parsed: {
      summary?: string;
      bullets?: Array<{ title?: string; detail?: string }>;
      followUps?: Array<{ label?: string; question?: string }>;
    } | null = null;

    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      parsed = {
        summary: rawContent || 'Berikut informasi dari portofolio Baihaqi.',
        bullets: [],
        followUps: [],
      };
    }

    const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

    return jsonResponse({
      ok: true,
      rag: true,
      model: HELIPOD_MODEL,
      answer: {
        key: 'ai_projects',
        question: query,
        badge: `${elapsedSec}s • RAG (${HELIPOD_MODEL})`,
        summary: parsed?.summary || rawContent,
        bullets: Array.isArray(parsed?.bullets)
          ? parsed.bullets
              .filter((b) => b?.title && b?.detail)
              .slice(0, 4)
              .map((b) => ({ title: String(b.title), detail: String(b.detail) }))
          : [],
        sources: retrieved.slice(0, 2).map((c) => ({
          projectId: c.appId,
          file: c.file,
          stack: c.stack,
          icon: c.icon,
          accent: c.accent,
        })),
        followUps:
          Array.isArray(parsed?.followUps) && parsed.followUps.length > 0
            ? parsed.followUps
                .filter((f) => f?.label && f?.question)
                .slice(0, 2)
                .map((f, idx) => ({
                  key: idx === 0 ? 'stack' : 'availability',
                  label: String(f.label),
                  question: String(f.question),
                }))
            : [
                {
                  key: 'stack',
                  label: 'Apa stack teknologi andalan Baihaqi?',
                  question: 'Apa stack teknologi andalan Baihaqi?',
                },
                {
                  key: 'availability',
                  label: 'Bagaimana cara menghubungi Baihaqi?',
                  question: 'Bagaimana cara menghubungi Baihaqi?',
                },
              ],
      },
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'RAG error' },
      500
    );
  }
}
