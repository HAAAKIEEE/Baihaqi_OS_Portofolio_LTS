'use client';

import React, { useState } from 'react';
import { PROJECTS, type ProjectCategory } from '@/data/projects';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

type FilterType = 'all' | ProjectCategory;

export function FileManagerApp() {
  const { selectedCaseStudyId, setSelectedCaseStudyId, settings } = useOs();
  const [filter, setFilter] = useState<FilterType>('all');

  const visibleProjects = PROJECTS.filter(
    (project) => filter === 'all' || project.category === filter
  );
  const selectedStudy =
    PROJECTS.find((p) => p.id === selectedCaseStudyId) || PROJECTS[0];

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
          <div className="flex items-center gap-gutter-xs" role="tablist" aria-label="Filter projects">
            {(
              [
                { id: 'all', label: 'All (4)' },
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

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Places Sidebar */}
        <aside className="hidden lg:flex lg:col-span-3 p-gutter-lg bg-dark-surface-container/50 border-r border-dark-outline-variant/40 flex-col justify-between gap-gutter-lg">
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
              onClick={() => setSelectedCaseStudyId('autoflow')}
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
            <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-primary tabular-nums">
              42+ Builds • 18 Flows
            </span>
          </div>
        </aside>

        {/* Right Content: Project Folders Grid & Case Study Preview */}
        <div className="lg:col-span-9 p-gutter-lg flex flex-col gap-gutter-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md items-stretch">
            {visibleProjects.map((project) => {
              const isSelected = project.id === selectedStudy.id;
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
                  <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                    {project.title}
                  </h2>
                  <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
                    {project.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Case Study README Inspector */}
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
              <span data-design-text-token="label-sm" className="font-label text-label-sm text-dark-tertiary tabular-nums">
                {selectedStudy.impact}
              </span>
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
        </div>
      </div>
    </section>
  );
}
