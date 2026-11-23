'use client';

import React from 'react';
import { PROFILE_INFO, SYSTEM_STATS } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { AppDock } from '@/components/os/AppDock';

export function BottomBar() {
  const { visibleWindows, openApp, settings } = useOs();
  const blurClass = settings.glassmorphism ? 'backdrop-blur-xl' : '';

  if (visibleWindows.length > 0) {
    return (
      <footer className="relative z-40 w-full flex flex-col items-center gap-gutter-sm shrink-0">
        <AppDock position="bottom" />
      </footer>
    );
  }

  return (
    <footer className="relative z-30 w-full flex flex-col xl:flex-row xl:items-end justify-between gap-gutter-md xl:gap-gutter-lg shrink-0">
      {/* Desktop Bottom-Left Column: Availability Card + STAT Card */}
      <div className="hidden sm:flex xl:flex-col items-end xl:items-start justify-between xl:justify-end gap-gutter-md shrink-0">
        <div className="flex flex-row xl:flex-col items-end xl:items-start gap-gutter-md">
          <article
            data-component-id="card-action"
            data-component-type="card"
            data-component-variant="action"
            className={`w-52 p-gutter-lg rounded-lg bg-dark-surface-container-low/75 ${blurClass} border border-dark-outline-variant/50 text-dark-on-surface shadow-lg flex flex-col items-center text-center gap-gutter-sm`}
          >
            <span
              data-component-id="badge-status"
              data-component-type="badge"
              data-component-variant="status"
              role="status"
              className="inline-flex items-center px-gutter-sm py-gutter-xs rounded-full bg-dark-tertiary-container/25 border border-dark-tertiary/40 text-dark-tertiary"
            >
              <span data-design-text-token="label-sm" className="font-label text-label-sm">
                {PROFILE_INFO.availabilityLabel}
              </span>
            </span>
            <div className="w-11 h-11 rounded-full bg-gradient-to-b from-dark-primary-container/25 to-dark-surface-container-high border border-dark-primary/50 overflow-hidden shrink-0 shadow-sm">
              <img
                src={PROFILE_INFO.avatarUrl}
                alt={`Foto profil ${PROFILE_INFO.name}`}
                className="w-full h-full object-cover object-[50%_62%]"
              />
            </div>
            <div>
              <h2 data-design-text-token="title-md" className="font-headline text-title-md text-dark-on-surface">
                {PROFILE_INFO.name}
              </h2>
              <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
                {PROFILE_INFO.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openApp('contact')}
              data-component-id="button-primary"
              data-component-type="button"
              data-component-variant="primary"
              className="w-full inline-flex items-center justify-center px-gutter-lg py-gutter-xs rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container transition-colors duration-state-change ease-state-change"
            >
              <span data-design-text-token="label-lg" className="font-label text-label-lg">
                Hubungi Saya
              </span>
            </button>
          </article>

          {settings.showDesktopStats && (
            <article
              data-component-id="card-elevated"
              data-component-type="card"
              data-component-variant="elevated"
              className={`w-auto p-gutter-lg rounded-lg bg-dark-surface-container-low/75 ${blurClass} border border-dark-outline-variant/50 text-dark-on-surface shadow-lg`}
            >
              <header className="mb-gutter-md">
                <h2
                  data-design-text-token="label-sm"
                  className="font-label text-label-sm uppercase tracking-wider text-dark-on-surface-variant"
                >
                  STATISTIK SISTEM
                </h2>
              </header>
              <div className="grid grid-cols-3 gap-gutter-md 2xl:gap-gutter-lg">
                {SYSTEM_STATS.map((stat) => (
                  <div key={stat.label}>
                    <p
                      data-design-text-token="mono-lg"
                      className={`font-mono text-mono-lg ${stat.colorClass} tabular-nums`}
                    >
                      {stat.value}
                    </p>
                    <p
                      data-design-text-token="body-sm"
                      className="font-body text-body-sm text-dark-on-surface-variant"
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>

        {/* Tablet/Small-Desktop Bottom-Right Card when stacked above Dock */}
        <article
          data-component-id="card-action"
          data-component-type="card"
          data-component-variant="action"
          className={`flex xl:hidden w-auto max-w-md rounded-lg bg-dark-surface-container-low/75 ${blurClass} border border-dark-outline-variant/50 text-dark-on-surface shadow-lg overflow-hidden`}
        >
          <div className="flex flex-col items-center justify-center gap-gutter-md px-gutter-md py-gutter-lg border-r border-dark-outline-variant/40 bg-dark-surface-container/40">
            <button
              type="button"
              aria-label="Buka Terminal"
              onClick={() => openApp('terminal')}
              className="text-dark-on-surface-variant hover:text-dark-primary transition-colors duration-state-change ease-state-change"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                terminal
              </span>
            </button>
            <button
              type="button"
              aria-label="Buka Proyek"
              onClick={() => openApp('projects')}
              className="text-dark-on-surface-variant hover:text-dark-tertiary transition-colors duration-state-change ease-state-change"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                folder_code
              </span>
            </button>
          </div>
          <div className="p-gutter-lg flex items-center gap-gutter-md flex-1">
            <div className="flex flex-col gap-gutter-xs flex-1">
              <header className="flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-[16px] text-dark-tertiary" aria-hidden="true">
                  bolt
                </span>
                <h2
                  data-design-text-token="label-sm"
                  className="font-label text-label-sm uppercase tracking-wider text-dark-on-surface"
                >
                  {PROFILE_INFO.osShortName}
                </h2>
              </header>
              <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                Web Modern &amp; Otomasi AI
              </p>
            </div>
            <button
              type="button"
              onClick={() => openApp('terminal')}
              className="inline-flex items-center justify-center px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high/90 border border-dark-outline-variant/60 text-dark-on-surface hover:bg-dark-surface-container-highest transition-colors duration-state-change shrink-0"
            >
              <span data-design-text-token="label-sm" className="font-label text-label-sm">
                Buka Terminal
              </span>
            </button>
          </div>
        </article>
      </div>

      {/* Mobile Compact Stats Card above Bottom Dock */}
      {settings.showDesktopStats && (
        <article
          data-component-id="card-elevated"
          data-component-type="card"
          data-component-variant="elevated"
          className={`sm:hidden w-full p-gutter-md rounded-lg bg-dark-surface-container-low/75 ${blurClass} border border-dark-outline-variant/50 text-dark-on-surface shadow-lg`}
        >
          <div className="grid grid-cols-3 gap-gutter-sm text-center">
            {SYSTEM_STATS.map((stat) => (
              <div key={stat.label}>
                <p
                  data-design-text-token="mono-lg"
                  className={`font-mono text-title-md ${stat.colorClass} tabular-nums`}
                >
                  {stat.value}
                </p>
                <p
                  data-design-text-token="body-sm"
                  className="font-body text-label-sm text-dark-on-surface-variant"
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </article>
      )}

      {/* Bottom-Center Dock */}
      <div className="flex justify-center min-w-0 xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:bottom-0 z-40">
        <AppDock position="bottom" />
      </div>

      {/* Desktop Bottom-Right OS Quick Launch / Capabilities Card */}
      <article
        data-component-id="card-action"
        data-component-type="card"
        data-component-variant="action"
        className={`hidden xl:flex w-auto max-w-sm 2xl:max-w-md rounded-lg bg-dark-surface-container-low/75 ${blurClass} border border-dark-outline-variant/50 text-dark-on-surface shadow-lg overflow-hidden shrink-0`}
      >
        <div className="flex flex-col items-center justify-center gap-gutter-md px-gutter-md py-gutter-lg border-r border-dark-outline-variant/40 bg-dark-surface-container/40">
          <button
            type="button"
            aria-label="Buka Terminal"
            onClick={() => openApp('terminal')}
            className="text-dark-on-surface-variant hover:text-dark-primary transition-colors duration-state-change ease-state-change"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              terminal
            </span>
          </button>
          <button
            type="button"
            aria-label="Buka Proyek"
            onClick={() => openApp('projects')}
            className="text-dark-on-surface-variant hover:text-dark-tertiary transition-colors duration-state-change ease-state-change"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              folder_code
            </span>
          </button>
        </div>

        <div className="p-gutter-lg flex items-center gap-gutter-md flex-1">
          <div className="flex flex-col gap-gutter-sm flex-1">
            <header className="flex items-center gap-gutter-xs">
              <span className="material-symbols-outlined text-[16px] text-dark-tertiary" aria-hidden="true">
                bolt
              </span>
              <h2
                data-design-text-token="label-sm"
                className="font-label text-label-sm uppercase tracking-wider text-dark-on-surface"
              >
                {PROFILE_INFO.osShortName}
              </h2>
            </header>
            <ul className="space-y-gutter-xs">
              <li className="flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-[15px] text-dark-primary" aria-hidden="true">
                  check
                </span>
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Pengembangan Web Modern &amp; API
                </span>
              </li>
              <li className="flex items-center gap-gutter-xs">
                <span className="material-symbols-outlined text-[15px] text-dark-primary" aria-hidden="true">
                  check
                </span>
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Otomasi Alur Kerja AI &amp; Agen
                </span>
              </li>
            </ul>
          </div>

          <footer className="flex flex-col items-center gap-gutter-xs shrink-0">
            <button
              type="button"
              onClick={() => openApp('terminal')}
              data-component-id="button-secondary"
              data-component-type="button"
              data-component-variant="secondary"
              className="inline-flex items-center justify-center px-gutter-md py-gutter-sm rounded-full bg-dark-surface-container-high/90 border border-dark-outline-variant/60 text-dark-on-surface hover:bg-dark-surface-container-highest transition-colors duration-state-change ease-state-change"
            >
              <span data-design-text-token="label-lg" className="font-label text-label-sm sm:text-label-lg">
                Buka Terminal
              </span>
            </button>
            <button
              type="button"
              onClick={() => openApp('projects')}
              className="font-body text-body-sm text-dark-on-surface-variant hover:text-dark-on-surface underline underline-offset-4 transition-colors duration-state-change ease-state-change"
            >
              <span data-design-text-token="body-sm">Lihat semua proyek</span>
            </button>
          </footer>
        </div>
      </article>
    </footer>
  );
}
