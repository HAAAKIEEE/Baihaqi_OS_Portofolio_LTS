export interface GitHubRepo {
  name: string;
  stars: number;
  description: string;
  mobileDescription: string;
  meta: string;
  url: string;
}

export interface GitCommit {
  hash: string;
  message: string;
  mobileMessage: string;
  highlight?: boolean;
}

export const GITHUB_STATS = {
  contributions: '1,240+ Kontribusi',
  contributionsMobile: '1,240+ Commits',
  totalStars: '490+ Stars',
  publicRepos: '28 Public Repos',
};

export const PINNED_REPOS: GitHubRepo[] = [
  {
    name: 'n8n-ai-agent-starter',
    stars: 184,
    description:
      'Template produksi agen LLM dan router webhook untuk alur kerja otomasi n8n.',
    mobileDescription: 'Template agen LLM & webhook router n8n.',
    meta: 'TypeScript • MIT',
    url: 'https://github.com/baihaqi/n8n-ai-agent-starter',
  },
  {
    name: 'nextjs-linux-portfolio',
    stars: 142,
    description:
      'Antarmuka portofolio interaktif bergaya desktop Linux dengan sistem jendela kaca.',
    mobileDescription: 'Portofolio interaktif bergaya desktop Linux.',
    meta: 'TypeScript • Next.js',
    url: 'https://github.com/baihaqi/nextjs-linux-portfolio',
  },
  {
    name: 'pgvector-rag-kit',
    stars: 96,
    description:
      'Toolkit FastAPI & PostgreSQL pgvector untuk pencarian semantik dokumen perusahaan.',
    mobileDescription: 'Toolkit FastAPI & pgvector untuk pencarian dokumen.',
    meta: 'Python • FastAPI',
    url: 'https://github.com/baihaqi/pgvector-rag-kit',
  },
  {
    name: 'arch-hyprland-dotfiles',
    stars: 68,
    description:
      'Konfigurasi Wayland, Zsh, dan Neovim untuk lingkungan kerja Linux yang cepat dan rapi.',
    mobileDescription: 'Konfigurasi Wayland, Zsh, dan Neovim untuk Linux.',
    meta: 'Shell • Wayland',
    url: 'https://github.com/baihaqi/arch-hyprland-dotfiles',
  },
];

export const RECENT_COMMITS: GitCommit[] = [
  {
    hash: 'a4f9c12',
    message: 'feat(agent): tambah fallback router multi-model Gemini & OpenAI',
    mobileMessage: 'feat: multi-model router',
    highlight: true,
  },
  {
    hash: '8b3e07d',
    message: 'perf(api): optimasi query indeks pgvector di bawah 40ms',
    mobileMessage: 'perf: pgvector < 40ms',
  },
  {
    hash: 'e21d904',
    message: 'docs: perbarui panduan deploy Docker Compose untuk n8n',
    mobileMessage: 'docs: docker compose n8n',
  },
];
