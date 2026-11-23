'use client';

import React from 'react';
import { EXPERIENCES } from '@/data/experience';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function AboutApp() {
  const { settings } = useOs();
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Tentang Baihaqi dan Riwayat Pengalaman"
      className={`w-full max-w-5xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="about"
        title="tentang.md — Profil & Pengalaman Kerja"
        badgeText={PROFILE_INFO.availabilityLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Profile Summary */}
        <aside className="lg:col-span-4 p-gutter-lg sm:p-gutter-xl bg-dark-surface-container/50 border-b lg:border-b-0 lg:border-r border-dark-outline-variant/40 flex flex-col justify-between gap-gutter-lg">
          <div className="flex flex-col gap-gutter-md">
            <div className="flex lg:flex-col items-center lg:items-start gap-gutter-md">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-dark-primary-container/30 to-dark-surface-container-high border border-dark-primary/50 overflow-hidden shrink-0 shadow-md">
                <img
                  src={PROFILE_INFO.avatarUrl}
                  alt={`Foto profil ${PROFILE_INFO.name}`}
                  className="w-full h-full object-cover object-[50%_62%]"
                />
              </div>
              <div>
                <h1 data-design-text-token="headline-md" className="font-headline text-title-md sm:text-headline-md text-dark-on-surface">
                  {PROFILE_INFO.name}
                </h1>
                <p data-design-text-token="body-md" className="font-body text-body-sm sm:text-body-md text-dark-tertiary sm:mt-gutter-xs">
                  {PROFILE_INFO.role}
                </p>
              </div>
            </div>

            <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
              {PROFILE_INFO.bioSummary}
            </p>
          </div>

          <div className="flex flex-col gap-gutter-sm pt-gutter-md border-t border-dark-outline-variant/40 font-mono text-mono-md">
            <div className="flex items-center justify-between">
              <span className="text-dark-outline">Pengalaman</span>
              <span className="text-dark-on-surface tabular-nums">4+ Tahun</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-outline">Proyek Selesai</span>
              <span className="text-dark-primary tabular-nums">42+ Web</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-outline">Otomasi AI</span>
              <span className="text-dark-tertiary tabular-nums">18 Alur</span>
            </div>
          </div>
        </aside>

        {/* Right Experience Timeline */}
        <div className="lg:col-span-8 p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-xl">
          <div className="flex flex-col gap-gutter-md">
            <h2
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-primary"
            >
              Pengalaman Kerja
            </h2>

            <div className="flex flex-col gap-gutter-md">
              {EXPERIENCES.map((exp) => (
                <article
                  key={exp.id}
                  className="p-gutter-md sm:p-gutter-lg rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 flex flex-col gap-gutter-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
                    <h3 data-design-text-token="title-md" className="font-headline text-body-md sm:text-title-md text-dark-on-surface font-semibold">
                      {exp.role}
                    </h3>
                    <span
                      data-design-text-token="mono-md"
                      className={`font-mono text-label-sm sm:text-mono-md ${exp.accentClass} tabular-nums`}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
                    {exp.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
