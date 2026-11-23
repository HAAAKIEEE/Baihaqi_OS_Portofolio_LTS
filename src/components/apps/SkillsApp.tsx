'use client';

import React, { useState } from 'react';
import { SKILL_METRICS, SKILL_PILLARS, type SkillCategory } from '@/data/skills';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

type SkillFilter = 'all' | SkillCategory;

export function SkillsApp() {
  const { settings } = useOs();
  const [filter, setFilter] = useState<SkillFilter>('all');

  const visibleSkills = SKILL_METRICS.filter(
    (skill) => filter === 'all' || skill.category === filter
  );
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Monitor Keahlian dan Stack Teknologi"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="skills"
        title="htop — Monitor Keahlian & Stack Teknologi"
        rightSlot={
          <div className="flex flex-wrap items-center gap-gutter-xs" role="tablist" aria-label="Filter Keahlian">
            {(
              [
                { id: 'all', label: 'Semua (8)' },
                { id: 'web', label: 'Web Full-Stack' },
                { id: 'ai', label: 'AI & Otomasi' },
                { id: 'devops', label: 'Linux & DevOps' },
              ] as const
            ).map((pill) => {
              const active = filter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(pill.id)}
                  className={`px-gutter-md py-gutter-xs rounded-full font-label text-label-sm transition-colors duration-state-change ease-state-change ${
                    active
                      ? 'bg-dark-primary text-dark-on-primary'
                      : 'bg-dark-surface-container-high text-dark-on-surface-variant hover:text-dark-on-surface'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg sm:gap-gutter-xl">
        {/* Top 3 Summary Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md items-stretch">
          {SKILL_PILLARS.map((pillar, idx) => (
            <article
              key={pillar.id}
              className="h-full p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex flex-col gap-gutter-xs"
            >
              <div className="flex items-center gap-gutter-sm">
                <span className={`material-symbols-outlined text-[18px] ${pillar.accentClass}`} aria-hidden="true">
                  {pillar.icon}
                </span>
                {idx === 0 ? (
                  <h1 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                    {pillar.title}
                  </h1>
                ) : (
                  <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                    {pillar.title}
                  </h2>
                )}
              </div>
              <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                {pillar.summary}
              </p>
            </article>
          ))}
        </div>

        {/* htop-Style Proficiency Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
          {visibleSkills.map((skill) => (
            <div
              key={skill.name}
              className="p-gutter-md rounded-md bg-dark-surface-container/70 border border-dark-outline-variant/40 flex flex-col gap-gutter-xs"
            >
              <div className="flex items-center justify-between font-mono text-mono-md">
                <span className="text-dark-on-surface">{skill.name}</span>
                <span
                  className={`tabular-nums ${
                    skill.tone === 'tertiary' ? 'text-dark-tertiary' : 'text-dark-primary'
                  }`}
                >
                  {skill.level}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-dark-surface-container-highest overflow-hidden">
                <div
                  style={{ width: `${skill.level}%` }}
                  className={`h-full rounded-full transition-all duration-surface-enter ${
                    skill.tone === 'tertiary' ? 'bg-dark-tertiary' : 'bg-dark-primary'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
