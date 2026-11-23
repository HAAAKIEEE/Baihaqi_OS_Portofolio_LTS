'use client';

import React from 'react';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';
import { WindowTitleBar } from '@/components/os/WindowTitleBar';

export function SettingsApp() {
  const { settings, updateSettings, openLauncher, openApp } = useOs();
  const blurClass = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <section
      aria-label="Pengaturan Sistem Baihaqi OS"
      className={`w-full max-w-4xl mx-auto rounded-xl bg-dark-surface-container-lowest/90 ${blurClass} border border-dark-outline-variant/70 shadow-2xl overflow-hidden flex flex-col animate-surface-enter`}
    >
      <WindowTitleBar
        appId="settings"
        title="settings.conf — Preferensi Sistem & Pintasan"
        badgeText="v2.4 LTS"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left System Info */}
        <aside className="lg:col-span-5 p-gutter-lg sm:p-gutter-xl bg-dark-surface-container/50 border-b lg:border-b-0 lg:border-r border-dark-outline-variant/40 flex flex-col justify-between gap-gutter-lg">
          <div className="flex flex-col gap-gutter-md">
            <h1 data-design-text-token="headline-md" className="font-headline text-title-md sm:text-headline-md text-dark-on-surface">
              Tentang Sistem
            </h1>
            <dl className="space-y-gutter-sm font-mono text-mono-md">
              <div className="flex items-center justify-between gap-gutter-sm">
                <dt className="text-dark-outline">OS</dt>
                <dd className="text-dark-on-surface">{PROFILE_INFO.osName}</dd>
              </div>
              <div className="flex items-center justify-between gap-gutter-sm">
                <dt className="text-dark-outline">Pemilik</dt>
                <dd className="text-dark-primary">{PROFILE_INFO.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-gutter-sm">
                <dt className="text-dark-outline">Compositor</dt>
                <dd className="text-dark-on-surface">{PROFILE_INFO.compositor}</dd>
              </div>
              <div className="flex items-center justify-between gap-gutter-sm">
                <dt className="text-dark-outline">Kernel</dt>
                <dd className="text-dark-tertiary tabular-nums">{PROFILE_INFO.kernel}</dd>
              </div>
            </dl>
          </div>

          <div className="p-gutter-md rounded-md bg-dark-surface-container-low/80 border border-dark-outline-variant/40">
            <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant text-pretty">
              Tema kosmik gelap aktif secara bawaan untuk menjaga kontras dan keterbacaan di setiap jendela.
            </p>
          </div>
        </aside>

        {/* Right Toggles & Shortcuts */}
        <div className="lg:col-span-7 p-gutter-lg sm:p-gutter-xl flex flex-col gap-gutter-xl">
          <div className="flex flex-col gap-gutter-md">
            <h2
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-primary"
            >
              Tampilan &amp; Efek
            </h2>

            <div className="flex flex-col gap-gutter-sm">
              <label className="flex items-center justify-between gap-gutter-md p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 cursor-pointer hover:border-dark-primary/50 transition-colors duration-state-change">
                <span data-design-text-token="body-md" className="font-body text-body-sm sm:text-body-md text-dark-on-surface">
                  Efek Blur Kaca (Glassmorphism)
                </span>
                <input
                  type="checkbox"
                  checked={settings.glassmorphism}
                  onChange={(e) => updateSettings({ glassmorphism: e.target.checked })}
                  className="rounded bg-dark-surface-container-high border-dark-outline-variant text-dark-primary focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between gap-gutter-md p-gutter-md rounded-lg bg-dark-surface-container-low/80 border border-dark-outline-variant/40 cursor-pointer hover:border-dark-primary/50 transition-colors duration-state-change">
                <span data-design-text-token="body-md" className="font-body text-body-sm sm:text-body-md text-dark-on-surface">
                  Tampilkan Widget Statistik Desktop
                </span>
                <input
                  type="checkbox"
                  checked={settings.showDesktopStats}
                  onChange={(e) => updateSettings({ showDesktopStats: e.target.checked })}
                  className="rounded bg-dark-surface-container-high border-dark-outline-variant text-dark-primary focus:ring-0"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-gutter-md">
            <h2
              data-design-text-token="label-sm"
              className="font-label text-label-sm uppercase tracking-wider text-dark-tertiary"
            >
              Pintasan Keyboard
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
              <button
                type="button"
                onClick={openLauncher}
                className="flex items-center justify-between p-gutter-md rounded-md bg-dark-surface-container/80 border border-dark-outline-variant/40 hover:border-dark-primary transition-colors duration-state-change text-left"
              >
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Bilah Perintah
                </span>
                <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-primary">
                  Ctrl + K
                </span>
              </button>
              <button
                type="button"
                onClick={() => openApp('terminal')}
                className="flex items-center justify-between p-gutter-md rounded-md bg-dark-surface-container/80 border border-dark-outline-variant/40 hover:border-dark-primary transition-colors duration-state-change text-left"
              >
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Buka Terminal
                </span>
                <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-primary">
                  Alt + T
                </span>
              </button>
              <button
                type="button"
                onClick={() => openApp('projects')}
                className="flex items-center justify-between p-gutter-md rounded-md bg-dark-surface-container/80 border border-dark-outline-variant/40 hover:border-dark-primary transition-colors duration-state-change text-left"
              >
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  File Manager
                </span>
                <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-primary">
                  Alt + P
                </span>
              </button>
              <button
                type="button"
                onClick={() => openApp('ai-lab')}
                className="flex items-center justify-between p-gutter-md rounded-md bg-dark-surface-container/80 border border-dark-outline-variant/40 hover:border-dark-primary transition-colors duration-state-change text-left"
              >
                <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
                  Studio AI Lab
                </span>
                <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-primary">
                  Alt + A
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
