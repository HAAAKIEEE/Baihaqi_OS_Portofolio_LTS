'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  mapGitHubRepoToProject,
  type GitHubApiRepo,
  type ProjectCaseStudy,
  type ProjectCategory,
} from '@/data/projects';
import { useOs } from '@/context/OsContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

type FilterType = 'all' | ProjectCategory | 'github';

export function FileManagerApp() {
  const { selectedCaseStudyId, setSelectedCaseStudyId, settings } = useOs();
  const { data } = usePortfolioData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [rawGithubRepos, setRawGithubRepos] = useState<GitHubApiRepo[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);

  const fetchGitHubRepos = useCallback(async () => {
    setGithubLoading(true);
    try {
      const res = await fetch(
        'https://api.github.com/users/HAAAKIEEE/repos?sort=updated&per_page=12',
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!res.ok) return;
      const repos = (await res.json()) as GitHubApiRepo[];
      setRawGithubRepos(repos);
    } catch {
      // Fallback gracefully to manual projects if offline/rate-limited
    } finally {
      setGithubLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubRepos();
  }, [fetchGitHubRepos]);

  const githubProjects = useMemo<ProjectCaseStudy[]>(
    () =>
      rawGithubRepos
        .filter((repo) => !data.hiddenGitHubIds.includes(repo.id))
        .map(mapGitHubRepoToProject),
    [rawGithubRepos, data.hiddenGitHubIds]
  );

  const combinedProjects = useMemo(
    () => [
      ...data.projects.map((p) => ({ ...p, source: 'manual' as const })),
      ...githubProjects,
    ],
    [data.projects, githubProjects]
  );

  const visibleProjects = useMemo(() => {
    if (filter === 'github') return githubProjects;
    if (filter === 'all') return combinedProjects;
    return combinedProjects.filter((project) => project.category === filter);
  }, [combinedProjects, filter, githubProjects]);

  const selectedStudy =
    visibleProjects.find((p) => p.id === selectedCaseStudyId) ||
    combinedProjects.find((p) => p.id === selectedCaseStudyId) ||
    visibleProjects[0] ||
    data.projects[0];

  const breadcrumbPath =
    filter === 'all' ? '/home/baihaqi/projects' : `/home/baihaqi/projects/${filter}`;

  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="File Manager — Projects and Case Studies"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="projects"
        title={breadcrumbPath}
        leftSlot={
          <div className="flex items-center gap-gutter-xs px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-low border border-dark-outline-variant/40">
            <span className="material-symbols-outlined text-[15px] text-dark-tertiary" aria-hidden="true">
              folder_open
            </span>
            <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface truncate">
              {breadcrumbPath}
            </span>
          </div>
        }
        rightSlot={
          <div className="flex items-center gap-gutter-xs flex-wrap" role="tablist" aria-label="Filter projects">
            {(
              [
                { id: 'all', label: `All (${combinedProjects.length})` },
                { id: 'web', label: 'Web Apps' },
                { id: 'ai', label: 'AI Automation' },
                { id: 'github', label: `GitHub (${githubProjects.length})` },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`px-gutter-md py-gutter-xs rounded-full font-label text-label-sm transition-colors duration-state-change ease-state-change ${
                    active
                      ? 'bg-dark-primary text-dark-on-primary'
                      : 'bg-dark-surface-container-high text-dark-on-surface-variant hover:text-dark-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Left Places Sidebar */}
        <aside className="hidden lg:flex lg:col-span-3 p-gutter-lg bg-dark-surface-container/50 border-r border-dark-outline-variant/40 flex-col justify-between gap-gutter-lg lg:overflow-y-auto os-scroll">
          <div className="flex flex-col gap-gutter-xs">
            <p
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-outline mb-gutter-xs px-gutter-sm"
            >
              Places
            </p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex items-center gap-gutter-sm px-gutter-sm py-gutter-sm rounded font-body text-body-md text-left transition-colors duration-state-change ${
                filter === 'all'
                  ? 'bg-dark-surface-container-high text-dark-on-surface'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container-high/60 hover:text-dark-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-dark-tertiary" aria-hidden="true">
                folder
              </span>
              <span>projects/</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('ai')}
              className={`flex items-center gap-gutter-sm px-gutter-sm py-gutter-sm rounded font-body text-body-md text-left transition-colors duration-state-change ${
                filter === 'ai'
                  ? 'bg-dark-surface-container-high text-dark-on-surface'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container-high/60 hover:text-dark-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-dark-primary" aria-hidden="true">
                smart_toy
              </span>
              <span>ai-automation/</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('web')}
              className={`flex items-center gap-gutter-sm px-gutter-sm py-gutter-sm rounded font-body text-body-md text-left transition-colors duration-state-change ${
                filter === 'web'
                  ? 'bg-dark-surface-container-high text-dark-on-surface'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container-high/60 hover:text-dark-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-dark-on-surface-variant" aria-hidden="true">
                language
              </span>
              <span>web-apps/</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('github')}
              className={`flex items-center gap-gutter-sm px-gutter-sm py-gutter-sm rounded font-body text-body-md text-left transition-colors duration-state-change ${
                filter === 'github'
                  ? 'bg-dark-surface-container-high text-dark-on-surface'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container-high/60 hover:text-dark-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-dark-tertiary" aria-hidden="true">
                code_blocks
              </span>
              <span>github/</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                if (combinedProjects[0]) {
                  setSelectedCaseStudyId(combinedProjects[0].id);
                }
              }}
              className="flex items-center gap-gutter-sm px-gutter-sm py-gutter-sm rounded text-dark-on-surface-variant hover:bg-dark-surface-container-high/60 hover:text-dark-on-surface font-body text-body-md text-left transition-colors duration-state-change"
            >
              <span className="material-symbols-outlined text-[18px] text-dark-tertiary" aria-hidden="true">
                description
              </span>
              <span>case-studies.md</span>
            </button>
          </div>

          <div className="p-gutter-md rounded-md bg-dark-surface-container-low/70 border border-dark-outline-variant/40 flex flex-col gap-gutter-xs">
            <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
              Workspace Volume
            </span>
            <span data-design-text-token="mono-md" className="font-mono text-label-sm text-dark-primary tabular-nums">
              {githubLoading ? 'Syncing GitHub...' : `${githubProjects.length} Repo GitHub`}
            </span>
            <a
              href={data.profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-dark-outline hover:text-dark-tertiary truncate transition-colors"
            >
              {data.profile.githubHandle}
            </a>
          </div>
        </aside>

        {/* Right Content: Project Folders Grid & Case Study Preview */}
        <div className="lg:col-span-9 p-gutter-lg flex flex-col gap-gutter-lg lg:overflow-y-auto os-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md items-stretch">
            {visibleProjects.length === 0 ? (
              <div className="sm:col-span-2 p-gutter-xl rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/50 text-center font-mono text-mono-md text-dark-on-surface-variant">
                {githubLoading
                  ? 'Menarik repositori dari github.com/HAAAKIEEE...'
                  : 'Belum ada proyek pada kategori ini.'}
              </div>
            ) : (
              visibleProjects.map((project) => {
              const isSelected = project.id === selectedStudy?.id;
              const isAi = project.category === 'ai';
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedCaseStudyId(project.id)}
                  className={`h-full text-left p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border transition-colors duration-state-change ease-state-change flex flex-col gap-gutter-sm ${
                    isSelected
                      ? 'border-dark-primary/80'
                      : 'border-dark-outline-variant/50 hover:border-dark-primary'
                  }`}
                >
                  <div className="flex items-center justify-between gap-gutter-sm w-full">
                    <div className="flex items-center gap-gutter-sm min-w-0">
                      <span
                        className={`material-symbols-outlined text-[24px] ${
                          isAi ? 'text-dark-tertiary' : 'text-dark-primary'
                        }`}
                        aria-hidden="true"
                      >
                        {isAi ? 'folder_special' : 'folder_code'}
                      </span>
                      <span
                        data-design-text-token="mono-md"
                        className="font-mono text-mono-md text-dark-on-surface truncate"
                      >
                        {project.folderName}
                      </span>
                    </div>
                    <span
                      className={`px-gutter-sm py-gutter-xs rounded-full font-label text-label-sm shrink-0 ${
                        isAi
                          ? 'bg-dark-tertiary-container/25 text-dark-tertiary'
                          : 'bg-dark-primary-container/25 text-dark-primary'
                      }`}
                    >
                      {project.badge}
                    </span>
                  </div>
                  <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface capitalize">
                    {project.title}
                  </h2>
                  <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty line-clamp-2">
                    {project.shortDesc}
                  </p>
                </button>
              );
            })
            )}
          </div>

          {/* Selected Case Study README Inspector */}
          {selectedStudy && (
            <article
              aria-live="polite"
              className="p-gutter-lg rounded-lg bg-dark-surface-container/80 border border-dark-outline-variant/50 flex flex-col gap-gutter-md"
            >
              <header className="flex flex-wrap items-center justify-between gap-gutter-sm border-b border-dark-outline-variant/40 pb-gutter-sm">
                <div className="flex items-center gap-gutter-sm">
                  <span className="material-symbols-outlined text-[18px] text-dark-tertiary" aria-hidden="true">
                    article
                  </span>
                  <h3 data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
                    {selectedStudy.readmeTitle}
                  </h3>
                </div>
                <div className="flex items-center gap-gutter-sm">
                  <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-tertiary tabular-nums">
                    {selectedStudy.impact}
                  </span>
                  {selectedStudy.repoUrl && (
                    <a
                      href={selectedStudy.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dark-primary/15 border border-dark-primary/40 text-dark-primary hover:bg-dark-primary/25 font-label text-label-sm transition-colors"
                    >
                      <span>Buka Repo</span>
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                        open_in_new
                      </span>
                    </a>
                  )}
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
                <div>
                  <p data-design-text-token="label-sm" className="font-label text-label-sm text-dark-primary mb-gutter-xs">
                    Challenge &amp; Solution
                  </p>
                  <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
                    {selectedStudy.summary}
                  </p>
                </div>
                <div>
                  <p data-design-text-token="label-sm" className="font-label text-label-sm text-dark-primary mb-gutter-xs">
                    Architecture Stack
                  </p>
                  <p data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface">
                    {selectedStudy.stack}
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
