'use client';

import React from 'react';
import { useOs } from '@/context/OsContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function AboutApp() {
  const { settings } = useOs();
  const { data } = usePortfolioData();
  const { profile, experiences, education, competencies } = data;
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Tentang Baihaqi dan Riwayat Pengalaman"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="about"
        title="tentang.md — Profil, Pengalaman & CV"
        badgeText={profile.availabilityLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Left Profile Summary */}
        <aside className="lg:col-span-4 p-gutter-lg sm:p-gutter-xl bg-dark-surface-container/50 border-b lg:border-b-0 lg:border-r border-dark-outline-variant/40 flex flex-col justify-start gap-gutter-lg lg:overflow-y-auto os-scroll">
          <div className="flex flex-col gap-gutter-md">
            <div className="flex lg:flex-col items-center lg:items-start gap-gutter-md">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-dark-primary-container/30 to-dark-surface-container-high border border-dark-primary/50 overflow-hidden shrink-0 shadow-md">
                <img
                  src={profile.avatarUrl}
                  alt={`Foto profil ${profile.name}`}
                  className="w-full h-full object-cover object-[50%_62%]"
                />
              </div>
              <div>
                <h1 data-design-text-token="headline-md" className="font-headline text-title-md sm:text-headline-md text-dark-on-surface">
                  {profile.name}
                </h1>
                <p data-design-text-token="body-md" className="font-body text-body-sm sm:text-body-md text-dark-tertiary sm:mt-gutter-xs">
                  Web Dev, AI Automation &amp; IT Support
                </p>
              </div>
            </div>

            <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
              {profile.bioSummary}
            </p>

            <a
              href={profile.cvUrl}
              download="CV-Baihaqi.pdf"
              className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-gutter-sm rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                download
              </span>
              <span data-design-text-token="label-lg" className="font-label text-label-md">
                Download CV (PDF)
              </span>
            </a>
          </div>

          <div className="flex flex-col gap-gutter-sm pt-gutter-md border-t border-dark-outline-variant/40 font-mono text-mono-md">
            <div className="flex items-center justify-between gap-2">
              <span className="text-dark-outline">Domisili</span>
              <span className="text-dark-on-surface text-right">Kalimantan Selatan</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-dark-outline">Pendidikan</span>
              <span className="text-dark-primary tabular-nums text-right">D3 TI (IPK 3.87)</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-dark-outline">Proyek &amp; AI</span>
              <span className="text-dark-tertiary tabular-nums text-right">42+ Web • 18 Alur AI</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-dark-outline">Skala Sistem</span>
              <span className="text-dark-on-surface tabular-nums text-right">101 Cabang</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-dark-outline">Bahasa</span>
              <span className="text-dark-on-surface-variant text-right">ID &amp; EN (Prof.)</span>
            </div>
          </div>
        </aside>

        {/* Right Experience, Education & Competencies */}
        <div className="lg:col-span-8 p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-lg lg:overflow-y-auto os-scroll">
          <div className="flex flex-col gap-gutter-md">
            <h2
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-primary"
            >
              Pengalaman Kerja
            </h2>

            <div className="flex flex-col gap-gutter-md">
              {experiences.map((exp) => (
                <article
                  key={exp.id}
                  className="p-gutter-md sm:p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex flex-col gap-gutter-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
                    <div>
                      <h3 data-design-text-token="title-md" className="font-headline text-body-md sm:text-title-md text-dark-on-surface font-semibold">
                        {exp.role}
                      </h3>
                      <span className="font-label text-label-sm text-dark-tertiary">
                        {exp.company}
                      </span>
                    </div>
                    <span
                      data-design-text-token="mono-md"
                      className={`font-mono text-label-sm sm:text-mono-md ${exp.accentClass} tabular-nums`}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty mt-gutter-xs">
                    {exp.description}
                  </p>
                  <ul className="space-y-1 mt-gutter-xs list-disc list-inside">
                    {exp.highlights.map((item) => (
                      <li key={item} className="font-body text-body-sm text-dark-on-surface-variant/90 text-pretty">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-md pt-gutter-sm border-t border-dark-outline-variant/40">
            <div className="md:col-span-5 flex flex-col gap-gutter-xs">
              <h2
                data-design-text-token="label-sm"
                className="font-label text-label-sm uppercase tracking-wider text-dark-tertiary"
              >
                Pendidikan
              </h2>
              <div className="p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex flex-col gap-1">
                <span className="font-headline text-body-md text-dark-on-surface font-semibold">
                  {education.institution}
                </span>
                <span className="font-body text-body-sm text-dark-on-surface-variant">
                  {education.program} ({education.period})
                </span>
                <span className="font-mono text-label-sm text-dark-primary mt-1">
                  {education.gpa} • {education.honor}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col gap-gutter-xs">
              <h2
                data-design-text-token="label-sm"
                className="font-label text-label-sm uppercase tracking-wider text-dark-primary"
              >
                Kompetensi Utama
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {competencies.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-dark-surface-container-high/90 border border-dark-outline-variant/40 font-mono text-[11px] text-dark-on-surface-variant"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
