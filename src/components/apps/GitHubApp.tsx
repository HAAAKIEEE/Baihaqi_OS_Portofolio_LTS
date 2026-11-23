'use client';

import React from 'react';
import { GITHUB_STATS, PINNED_REPOS, RECENT_COMMITS } from '@/data/github';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function GitHubApp() {
  const { settings } = useOs();
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Repositori GitHub dan Aktivitas Open Source"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="github"
        title={`git-client — ${PROFILE_INFO.githubHandle}`}
        badgeText={GITHUB_STATS.contributions}
      />

      <div className="p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg sm:gap-gutter-xl">
        {/* Pinned Repositories */}
        <div className="flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between gap-gutter-sm">
            <h1
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-primary"
            >
              Repositori Unggulan
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
            {PINNED_REPOS.map((repo) => (
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
            ))}
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
