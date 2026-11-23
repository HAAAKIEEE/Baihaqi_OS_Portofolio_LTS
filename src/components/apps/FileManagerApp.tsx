'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PROJECTS,
  mapGitHubRepoToProject,
  type GitHubApiRepo,
  type ProjectCaseStudy,
  type ProjectCategory,
} from '@/data/projects';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

type FilterType = 'all' | ProjectCategory;
type SourceMode = 'all' | 'github' | 'manual';

const MANUAL_STORAGE_KEY = 'baihaqi_os_manual_projects_v1';

export function FileManagerApp() {
  const { selectedCaseStudyId, setSelectedCaseStudyId, settings } = useOs();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sourceMode, setSourceMode] = useState<SourceMode>('all');
  const [githubProjects, setGithubProjects] = useState<ProjectCaseStudy[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [customManualProjects, setCustomManualProjects] = useState<ProjectCaseStudy[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('web');
  const [newDesc, setNewDesc] = useState('');
  const [newStack, setNewStack] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MANUAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ProjectCaseStudy[];
        if (Array.isArray(parsed)) {
          setCustomManualProjects(parsed);
        }
      }
    } catch {
      // Ignore storage read error
    }
  }, []);

  const fetchGitHubRepos = useCallback(async () => {
    setGithubLoading(true);
    setGithubError(null);
    try {
      const res = await fetch(
        'https://api.github.com/users/HAAAKIEEE/repos?sort=updated&per_page=12',
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const repos = (await res.json()) as GitHubApiRepo[];
      const mapped = repos.map(mapGitHubRepoToProject);
      setGithubProjects(mapped);
    } catch {
      setGithubError('Gagal memuat repo GitHub otomatis; menampilkan proyek manual.');
    } finally {
      setGithubLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubRepos();
  }, [fetchGitHubRepos]);

  const manualProjects = useMemo(
    () => [
      ...customManualProjects.map((p) => ({ ...p, source: 'manual' as const })),
      ...PROJECTS.map((p) => ({ ...p, source: 'manual' as const })),
    ],
    [customManualProjects]
  );

  const combinedProjects = useMemo(() => {
    if (sourceMode === 'github') return githubProjects;
    if (sourceMode === 'manual') return manualProjects;
    return [...githubProjects, ...manualProjects];
  }, [githubProjects, manualProjects, sourceMode]);

  const visibleProjects = useMemo(
    () =>
      combinedProjects.filter(
        (project) => filter === 'all' || project.category === filter
      ),
    [combinedProjects, filter]
  );

  const selectedStudy =
    visibleProjects.find((p) => p.id === selectedCaseStudyId) ||
    combinedProjects.find((p) => p.id === selectedCaseStudyId) ||
    visibleProjects[0] ||
    manualProjects[0];

  const handleAddManualProject = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    const desc = newDesc.trim();
    if (!title || !desc) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const created: ProjectCaseStudy = {
      id: `manual-${Date.now()}`,
      folderName: `${slug || 'project'}/`,
      category: newCategory,
      badge: 'Manual',
      title,
      shortDesc: desc,
      mobileShortDesc: desc,
      readmeTitle: `${slug || 'project'}/README.md`,
      impact: 'Ditambahkan Manual',
      summary: desc,
      stack: newStack.trim() || 'Laravel • Tailwind CSS',
      repoUrl: newUrl.trim() || undefined,
      source: 'manual',
    };

    const next = [created, ...customManualProjects];
    setCustomManualProjects(next);
    try {
      window.localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write error
    }

    setSelectedCaseStudyId(created.id);
    setSourceMode((prev) => (prev === 'github' ? 'all' : prev));
    setNewTitle('');
    setNewDesc('');
    setNewStack('');
    setNewUrl('');
    setShowAddForm(false);
  };

  const handleDeleteCustomProject = (id: string) => {
    const next = customManualProjects.filter((item) => item.id !== id);
    setCustomManualProjects(next);
    try {
      window.localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write error
    }
  };

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
          <div className="flex flex-col gap-gutter-md">
            <div className="flex flex-col gap-gutter-xs">
              <p
                data-design-text-token="label-sm"
                className="font-label text-label-sm uppercase tracking-wider text-dark-outline mb-gutter-xs px-gutter-sm"
              >
                Sumber Proyek
              </p>
              {(
                [
                  { id: 'all', label: 'GitHub + Manual', icon: 'layers' },
                  { id: 'github', label: 'GitHub Otomatis', icon: 'cloud_sync' },
                  { id: 'manual', label: 'Manual Saja', icon: 'edit_note' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSourceMode(mode.id)}
                  className={`flex items-center gap-gutter-sm px-gutter-sm py-gutter-sm rounded font-body text-body-sm text-left transition-colors duration-state-change ${
                    sourceMode === mode.id
                      ? 'bg-dark-surface-container-high text-dark-on-surface'
                      : 'text-dark-on-surface-variant hover:bg-dark-surface-container-high/60 hover:text-dark-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-dark-primary" aria-hidden="true">
                    {mode.icon}
                  </span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-gutter-xs pt-gutter-sm border-t border-dark-outline-variant/40">
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
            </div>
          </div>

          <div className="flex flex-col gap-gutter-sm">
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="w-full inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-gutter-sm rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container transition-colors duration-state-change font-label text-label-sm"
            >
              <span className="material-symbols-outlined text-[17px]" aria-hidden="true">
                {showAddForm ? 'close' : 'add'}
              </span>
              <span>{showAddForm ? 'Tutup Form' : 'Tambah Manual'}</span>
            </button>

            <div className="p-gutter-md rounded-md bg-dark-surface-container-low/70 border border-dark-outline-variant/40 flex flex-col gap-gutter-xs">
              <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-on-surface-variant">
                GitHub Sync ({PROFILE_INFO.githubHandle})
              </span>
              <span data-design-text-token="mono-md" className="font-mono text-label-sm text-dark-primary tabular-nums">
                {githubLoading ? 'Menarik repo...' : `${githubProjects.length} Repo • ${manualProjects.length} Manual`}
              </span>
            </div>
          </div>
        </aside>

        {/* Right Content: Project Folders Grid & Case Study Preview */}
        <div className="lg:col-span-9 p-gutter-lg flex flex-col gap-gutter-lg lg:overflow-y-auto os-scroll">
          {/* Top Action Bar (Mobile source switcher + Add Manual + Refresh) */}
          <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
            <div className="flex flex-wrap items-center gap-gutter-xs">
              {(
                [
                  { id: 'all', label: 'GitHub + Manual' },
                  { id: 'github', label: 'GitHub Otomatis' },
                  { id: 'manual', label: 'Manual Saja' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSourceMode(mode.id)}
                  className={`lg:hidden px-3 py-1 rounded-full font-label text-label-sm border transition-colors ${
                    sourceMode === mode.id
                      ? 'bg-dark-primary/20 border-dark-primary text-dark-primary'
                      : 'bg-dark-surface-container-low border-dark-outline-variant/40 text-dark-on-surface-variant'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
              {githubError ? (
                <span className="font-mono text-label-sm text-dark-error">{githubError}</span>
              ) : (
                <span className="hidden lg:inline font-mono text-label-sm text-dark-outline">
                  {githubLoading
                    ? 'Menarik repositori dari github.com/HAAAKIEEE...'
                    : `Terhubung otomatis ke ${PROFILE_INFO.githubHandle}`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-gutter-xs">
              <button
                type="button"
                onClick={fetchGitHubRepos}
                disabled={githubLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-dark-surface-container-high border border-dark-outline-variant/50 text-dark-on-surface-variant hover:text-dark-on-surface font-label text-label-sm transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                  refresh
                </span>
                <span>Sync GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
                className="lg:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-dark-primary text-dark-on-primary font-label text-label-sm"
              >
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                  {showAddForm ? 'close' : 'add'}
                </span>
                <span>{showAddForm ? 'Tutup' : 'Tambah Manual'}</span>
              </button>
            </div>
          </div>

          {/* Inline Add Manual Project Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddManualProject}
              className="p-gutter-lg rounded-lg bg-dark-surface-container/90 border border-dark-primary/50 flex flex-col gap-gutter-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-title-md text-dark-on-surface">
                  Tambah Proyek Manual (Tanpa Repo Otomatis)
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-dark-outline hover:text-dark-on-surface"
                  aria-label="Tutup form"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nama Proyek (cth. Sistem HRIS Laravel)"
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 font-body text-body-sm text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProjectCategory)}
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 font-body text-body-sm text-dark-on-surface focus:border-dark-primary focus:outline-none"
                >
                  <option value="web">Web App</option>
                  <option value="ai">AI Automation</option>
                </select>
                <input
                  type="text"
                  value={newStack}
                  onChange={(e) => setNewStack(e.target.value)}
                  placeholder="Stack (cth. Laravel • Livewire • Tailwind)"
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 font-body text-body-sm text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:outline-none"
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="URL Demo / Repo (opsional)"
                  className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 font-body text-body-sm text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:outline-none"
                />
              </div>
              <textarea
                rows={2}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Deskripsi singkat proyek..."
                className="rounded bg-dark-surface-container-low border border-dark-outline-variant/60 px-3 py-2 font-body text-body-sm text-dark-on-surface placeholder:text-dark-outline focus:border-dark-primary focus:outline-none resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-gutter-lg py-gutter-xs rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container font-label text-label-md transition-colors"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md items-stretch">
            {visibleProjects.map((project) => {
              const isSelected = project.id === selectedStudy?.id;
              const isAi = project.category === 'ai';
              const isCustom = project.id.startsWith('manual-');
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
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-gutter-sm py-gutter-xs rounded-full font-label text-label-sm ${
                          isAi
                            ? 'bg-dark-tertiary-container/25 text-dark-tertiary'
                            : 'bg-dark-primary-container/25 text-dark-primary'
                        }`}
                      >
                        {project.badge}
                      </span>
                      {isCustom && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomProject(project.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              handleDeleteCustomProject(project.id);
                            }
                          }}
                          title="Hapus proyek manual"
                          className="text-dark-outline hover:text-dark-error p-0.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface capitalize">
                    {project.title}
                  </h2>
                  <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty line-clamp-2">
                    {project.shortDesc}
                  </p>
                </button>
              );
            })}
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
