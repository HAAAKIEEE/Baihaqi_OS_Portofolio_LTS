export type ProjectCategory = 'ai' | 'web';

export interface ProjectCaseStudy {
  id: string;
  folderName: string;
  category: ProjectCategory;
  badge: string;
  title: string;
  shortDesc: string;
  mobileShortDesc: string;
  readmeTitle: string;
  impact: string;
  summary: string;
  stack: string;
  repoUrl?: string;
  source?: 'github' | 'manual';
  stars?: number;
}

export interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  fork: boolean;
}

export function mapGitHubRepoToProject(repo: GitHubApiRepo): ProjectCaseStudy {
  const haystack = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
  const isAi =
    haystack.includes('ai') ||
    haystack.includes('llm') ||
    haystack.includes('rag') ||
    haystack.includes('n8n') ||
    haystack.includes('agent') ||
    haystack.includes('bot') ||
    haystack.includes('automation');

  const desc =
    repo.description?.trim() ||
    `Repositori publik GitHub (${repo.language ?? 'Project'}) oleh HAAAKIEEE.`;

  const stackParts = [
    repo.language || 'Source Code',
    ...(repo.topics?.slice(0, 3) ?? []),
  ];

  const updatedDate = new Date(repo.updated_at).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  });

  return {
    id: `gh-${repo.id}`,
    folderName: `${repo.name}/`,
    category: isAi ? 'ai' : 'web',
    badge: isAi ? 'AI / Auto' : 'GitHub Repo',
    title: repo.name.replace(/[-_]+/g, ' '),
    shortDesc: desc,
    mobileShortDesc: desc,
    readmeTitle: `${repo.name}/README.md`,
    impact: `★ ${repo.stargazers_count} • Update ${updatedDate}`,
    summary: desc,
    stack: stackParts.join(' • '),
    repoUrl: repo.html_url,
    source: 'github',
    stars: repo.stargazers_count,
  };
}

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'autoflow',
    folderName: 'autoflow-ai-crm/',
    category: 'ai',
    badge: 'Case Study',
    title: 'AutoFlow AI Lead Router',
    shortDesc:
      'Autonomous CRM & WhatsApp qualification pipeline cutting lead response time from 4h to 12s.',
    mobileShortDesc:
      'Pipeline n8n & LLM memangkas respons lead dari 4 jam menjadi 12 detik.',
    readmeTitle: 'autoflow-ai-crm/README.md',
    impact: 'Impact: 12s avg response • +38% conversion',
    summary:
      'Replaced manual spreadsheet lead triage with an n8n + LLM classification pipeline that enriches contacts, scores intent, and triggers instant WhatsApp & Slack alerts.',
    stack: 'n8n • OpenAI API • Node.js • PostgreSQL • Webhooks',
  },
  {
    id: 'pulseboard',
    folderName: 'pulseboard-saas/',
    category: 'web',
    badge: 'Web App',
    title: 'PulseBoard SaaS Portal',
    shortDesc:
      'Real-time Laravel, Livewire & Tailwind CSS product telemetry dashboard serving 12k+ monthly active users.',
    mobileShortDesc:
      'Dashboard Laravel, Livewire & Tailwind CSS untuk 12k+ pengguna aktif.',
    readmeTitle: 'pulseboard-saas/README.md',
    impact: 'Impact: 12k+ MAU • 99.95% uptime',
    summary:
      'Built a multi-tenant analytics dashboard with role-based access control, reactive Livewire components, streaming SQL aggregations, and automated weekly PDF/CSV reporting.',
    stack: 'Laravel • Livewire • Tailwind CSS • PostgreSQL • Docker',
  },
  {
    id: 'docsmind',
    folderName: 'docsmind-rag/',
    category: 'ai',
    badge: 'AI Agent',
    title: 'DocsMind RAG Assistant',
    shortDesc:
      'Vector-indexed support agent that resolved 64% of tier-1 customer tickets automatically.',
    mobileShortDesc:
      'Agen support berbasis pgvector yang menekan 64% tiket manual.',
    readmeTitle: 'docsmind-rag/README.md',
    impact: 'Impact: -64% tier-1 support tickets',
    summary:
      'Engineered a retrieval-augmented generation assistant that indexes internal Notion docs and API specs to answer customer questions with cited sources.',
    stack: 'Python • Gemini API • pgvector • FastAPI • Redis',
  },
  {
    id: 'karyacommerce',
    folderName: 'karyacommerce-api/',
    category: 'web',
    badge: 'Web App',
    title: 'KaryaCommerce Headless',
    shortDesc:
      'High-throughput storefront and inventory sync engine with sub-100ms API response times.',
    mobileShortDesc:
      'Storefront headless & sinkronisasi inventaris dengan latensi <90ms.',
    readmeTitle: 'karyacommerce-api/README.md',
    impact: 'Impact: <90ms p95 API latency',
    summary:
      'Architected a headless commerce backend syncing inventory across 3 warehouses with automated payment webhook reconciliation.',
    stack: 'Laravel • PHP • Tailwind CSS • PostgreSQL • Nginx',
  },
];
