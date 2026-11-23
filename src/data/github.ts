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
  contributions: 'GitHub Live',
  contributionsMobile: 'GitHub Live',
  totalStars: '0 Stars',
  publicRepos: '0 Public Repos',
};

export const PINNED_REPOS: GitHubRepo[] = [];

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
