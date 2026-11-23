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
    message: 'feat(ai): integrasi otomasi LLM langsung di sistem Laravel & webhook n8n',
    mobileMessage: 'feat: Laravel AI & n8n',
    highlight: true,
  },
  {
    hash: '8b3e07d',
    message: 'perf(laravel): optimasi query MySQL & komponen Livewire dashboard',
    mobileMessage: 'perf: Laravel & MySQL',
  },
  {
    hash: 'e21d904',
    message: 'docs: perbarui konfigurasi deployment Linux VPS & n8n workflow',
    mobileMessage: 'docs: Linux VPS & n8n',
  },
];
