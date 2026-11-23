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

// Tambahkan proyek manual di sini jika diperlukan; saat ini dikosongkan agar murni dari GitHub.
export const PROJECTS: ProjectCaseStudy[] = [];
