'use client';

import React, { useEffect, useState } from 'react';
import { GITHUB_STATS, PINNED_REPOS, RECENT_COMMITS, type GitHubRepo } from '@/data/github';
import { type GitHubApiRepo } from '@/data/projects';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function GitHubApp() {
  const { settings } = useOs();
  const [repos, setRepos] = useState<GitHubRepo[]>(PINNED_REPOS);
  const [publicReposLabel, setPublicReposLabel] = useState(GITHUB_STATS.contributions);
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  useEffect(() => {
    let active = true;
    const loadGitHub = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/HAAAKIEEE'),
          fetch('https://api.github.com/users/HAAAKIEEE/repos?sort=updated&per_page=6'),
        ]);

        if (!active) return;

        if (userRes.ok) {
          const userData = (await userRes.json()) as { public_repos?: number };
          if (typeof userData.public_repos === 'number') {
            setPublicReposLabel(`${userData.public_repos} Public Repos`);
          }
        }

        if (reposRes.ok) {
          const apiRepos = (await reposRes.json()) as GitHubApiRepo[];
          if (Array.isArray(apiRepos) && apiRepos.length > 0) {
            setRepos(
              apiRepos.map((repo) => ({
                name: repo.name,
                stars: repo.stargazers_count,
                description:
                  repo.description?.trim() ||
                  `Repositori publik (${repo.language ?? 'Project'}) oleh HAAAKIEEE.`,
                mobileDescription:
                  repo.description?.trim() || `Repo ${repo.language ?? 'GitHub'}.`,
                meta: `${repo.language ?? 'Code'} • ${repo.forks_count} Forks`,
                url: repo.html_url,
              }))
            );
          }
        }
      } catch {
        // Keep static fallback silently if rate-limited or offline
      }
    };

    loadGitHub();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      aria-label="Repositori GitHub dan Aktivitas Open Source"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="github"
        title={`git-client — ${PROFILE_INFO.githubHandle}`}
        badgeText={publicReposLabel}
      />

      <div className="p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg sm:gap-gutter-xl">
        {/* Pinned Repositories */}
        <div className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-sm">
            <h1
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-primary"
            >
              Repositori Terbaru (Live GitHub)
            </h1>
            <a
              href={PROFILE_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-gutter-xs font-mono text-label-sm text-dark-tertiary hover:text-dark-primary transition-colors duration-state-change"
            >
              <span>{PROFILE_INFO.githubHandle}</span>
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                open_in_new
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md items-stretch">
            {repos.length === 0 ? (
              <div className="sm:col-span-2 p-gutter-xl rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/50 text-center font-mono text-mono-md text-dark-on-surface-variant">
                Memuat repositori dari github.com/HAAAKIEEE...
              </div>
            ) : (
              repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/50 hover:border-dark-primary transition-colors duration-state-change ease-state-change flex flex-col justify-between gap-gutter-sm"
              >
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-primary">
                    {repo.name}
                  </span>
                  <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-tertiary tabular-nums">
                    ★ {repo.stars}
                  </span>
                </div>
                <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
                  {repo.description}
                </p>
                <span data-design-text-token="label-sm" className="font-mono text-label-sm text-dark-outline">
                  {repo.meta}
                </span>
              </a>
            ))
            )}
          </div>
        </div>

        {/* Recent Commit Log */}
        <article className="p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-sm">
          <header className="flex items-center justify-between border-b border-dark-outline-variant/40 pb-gutter-sm">
            <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
              $ git log --oneline -n 3
            </span>
            <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-tertiary">
              branch: main
            </span>
          </header>
          <div className="font-mono text-mono-md space-y-gutter-xs">
            {RECENT_COMMITS.map((commit) => (
              <p key={commit.hash}>
                <span className="text-dark-tertiary">{commit.hash}</span>{' '}
                <span className={commit.highlight ? 'text-dark-on-surface' : 'text-dark-on-surface-variant'}>
                  {commit.message}
                </span>
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
