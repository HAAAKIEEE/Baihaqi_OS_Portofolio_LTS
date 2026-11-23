'use client';

import React from 'react';
import { DOCK_APPS } from '@/data/profile';
import { useOs, type WindowAppId } from '@/context/OsContext';

interface AppDockProps {
  position?: 'top' | 'bottom';
}

const EXTRA_DOCK_META: Partial<Record<WindowAppId, { label: string; icon: string; accentClass: string }>> = {
  settings: { label: 'Pengaturan', icon: 'settings', accentClass: 'text-dark-on-surface' },
  'ai-search': { label: 'Cari AI', icon: 'auto_awesome', accentClass: 'text-dark-primary' },
};

export function AppDock({ position }: AppDockProps) {
  const {
    activeApp,
    windows,
    openWindows,
    visibleWindows,
    toggleApp,
    openApp,
    showDesktop,
    closeAllWindows,
    settings,
  } = useOs();

  const resolvedPosition = position ?? 'bottom';
  const hasMaximizedWindow = visibleWindows.some((w) => w.isMaximized);
  const blurClass = settings.glassmorphism ? 'backdrop-blur-xl' : '';

  if (resolvedPosition === 'bottom') {
    const extraOpenApps = (['ai-search', 'settings'] as const).filter(
      (id) => windows[id].isOpen
    );

    const showDesktopButton = (
      <button
        type="button"
        onClick={() => {
          if (visibleWindows.length > 0) {
            showDesktop();
          } else if (openWindows.length > 0) {
            openApp(openWindows[openWindows.length - 1].id);
          }
        }}
        aria-label={visibleWindows.length > 0 ? 'Tampilkan Desktop' : 'Pulihkan Jendela'}
        title={visibleWindows.length > 0 ? 'Tampilkan Desktop' : 'Pulihkan Jendela'}
        className="group flex flex-col items-center gap-gutter-xs shrink-0 px-gutter-xs focus-visible:outline-none"
      >
        <div
          className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all duration-state-change group-hover:-translate-y-0.5 ${
            visibleWindows.length === 0
              ? 'bg-dark-surface-container-high border-dark-primary text-dark-primary'
              : 'bg-dark-surface-container/80 border-dark-outline-variant/60 text-dark-on-surface-variant group-hover:text-dark-on-surface group-hover:border-dark-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            desktop_windows
          </span>
        </div>
        <span className="hidden sm:block font-body text-[11px] leading-[14px] text-dark-on-surface drop-shadow-sm">
          Desktop
        </span>
      </button>
    );

    const appIconsStrip = (
      <div className="flex items-start gap-1.5 sm:gap-2 2xl:gap-gutter-md">
        {DOCK_APPS.map((app) => {
          const win = windows[app.id];
          const isFocused = activeApp === app.id;
          const isOpen = win.isOpen;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => toggleApp(app.id)}
              aria-label={app.label}
              aria-pressed={isFocused}
              title={`${app.label}${isOpen ? (win.isMinimized ? ' (Minimized)' : ' (Aktif)') : ''}`}
              className="group flex flex-col items-center gap-gutter-xs w-10 sm:w-11 2xl:w-12 shrink-0 focus-visible:outline-none"
            >
              <div
                className={`w-10 h-10 rounded-md ${blurClass} border flex items-center justify-center ${app.accentClass} transition-all duration-state-change ease-state-change group-hover:-translate-y-1 ${
                  isFocused
                    ? 'bg-dark-surface-container-high/95 border-dark-primary shadow-lg -translate-y-0.5'
                    : isOpen
                      ? 'bg-dark-surface-container/90 border-dark-tertiary/60 shadow-md'
                      : 'bg-dark-surface-container-low/80 border-dark-outline-variant/50 group-hover:border-dark-primary'
                } ${win.isMinimized ? 'opacity-75' : ''}`}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  {app.icon}
                </span>
              </div>
              <span
                className={`hidden sm:block font-body text-[11px] leading-[14px] text-center truncate w-full drop-shadow-sm ${
                  isFocused ? 'text-dark-on-surface font-medium' : 'text-dark-on-surface/90'
                }`}
              >
                {app.label}
              </span>
              {isFocused ? (
                <span className="w-3 h-1 rounded-full bg-dark-primary" />
              ) : isOpen ? (
                <span className="w-1.5 h-1.5 rounded-full bg-dark-tertiary" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
              )}
            </button>
          );
        })}

        {extraOpenApps.map((extraId) => {
          const meta = EXTRA_DOCK_META[extraId];
          if (!meta) return null;
          const win = windows[extraId];
          const isFocused = activeApp === extraId;

          return (
            <button
              key={extraId}
              type="button"
              onClick={() => toggleApp(extraId)}
              aria-label={meta.label}
              aria-pressed={isFocused}
              title={meta.label}
              className="group flex flex-col items-center gap-gutter-xs w-11 sm:w-12 shrink-0 focus-visible:outline-none"
            >
              <div
                className={`w-10 h-10 rounded-md ${blurClass} border flex items-center justify-center ${meta.accentClass} transition-all duration-state-change ease-state-change group-hover:-translate-y-1 ${
                  isFocused
                    ? 'bg-dark-surface-container-high/95 border-dark-primary shadow-lg -translate-y-0.5'
                    : 'bg-dark-surface-container/90 border-dark-tertiary/60 shadow-md'
                } ${win.isMinimized ? 'opacity-75' : ''}`}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  {meta.icon}
                </span>
              </div>
              <span
                className={`hidden sm:block font-body text-[11px] leading-[14px] text-center truncate w-full drop-shadow-sm ${
                  isFocused ? 'text-dark-on-surface font-medium' : 'text-dark-on-surface/90'
                }`}
              >
                {meta.label}
              </span>
              <span
                className={
                  isFocused
                    ? 'w-3 h-1 rounded-full bg-dark-primary'
                    : 'w-1.5 h-1.5 rounded-full bg-dark-tertiary'
                }
              />
            </button>
          );
        })}
      </div>
    );

    const rightWindowActions = (
      <div className="flex items-center gap-gutter-xs shrink-0">
        <span className="hidden md:inline-flex items-center px-gutter-sm py-gutter-xs rounded-full bg-dark-surface-container-high/80 border border-dark-outline-variant/40 font-mono text-label-sm text-dark-tertiary tabular-nums">
          {openWindows.length} Jendela
        </span>
        <button
          type="button"
          onClick={closeAllWindows}
          aria-label="Tutup semua jendela"
          title="Tutup semua jendela"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-dark-surface-container-high/70 border border-dark-outline-variant/40 text-dark-on-surface-variant hover:bg-dark-error hover:text-dark-on-error hover:border-dark-error transition-colors duration-state-change"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            layers_clear
          </span>
        </button>
      </div>
    );

    if (hasMaximizedWindow) {
      return (
        <nav
          aria-label="Dok Aplikasi Bawah Linux (Fullscreen)"
          className={`fixed bottom-0 inset-x-0 z-50 w-full h-20 bg-[#0a1222]/95 ${blurClass} border-t border-dark-outline-variant/50 px-gutter-md sm:px-gutter-lg py-2.5 flex items-center justify-between gap-gutter-md shadow-2xl overflow-x-auto overflow-y-hidden no-scrollbar transition-all duration-300`}
        >
          <div className="flex-1 flex items-center justify-start gap-gutter-sm shrink-0">
            {showDesktopButton}
          </div>
          <div className="flex items-center justify-center shrink-0">{appIconsStrip}</div>
          <div className="flex-1 flex items-center justify-end shrink-0">{rightWindowActions}</div>
        </nav>
      );
    }

    return (
      <nav
        aria-label="Dok Aplikasi Bawah Linux Mengambang"
        className="relative z-40 w-full flex justify-center pt-gutter-xs"
      >
        <div
          className={`mx-auto w-fit max-w-full overflow-x-auto overflow-y-hidden no-scrollbar flex items-center gap-gutter-xs sm:gap-gutter-sm px-gutter-md pt-3 pb-2 rounded-2xl bg-white/15 ${blurClass} border border-white/25 shadow-2xl transition-all duration-300`}
        >
          {showDesktopButton}
          <span className="w-px h-8 bg-white/20 shrink-0" aria-hidden="true" />
          {appIconsStrip}
          {openWindows.length > 0 && (
            <>
              <span className="w-px h-8 bg-white/20 shrink-0" aria-hidden="true" />
              {rightWindowActions}
            </>
          )}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Top-Center App Dock Strip (when no popup is open) */}
      <nav aria-label="Dok Aplikasi Linux" className="hidden sm:flex flex-col items-center gap-gutter-sm">
        <div className="flex flex-wrap items-start justify-center gap-gutter-sm sm:gap-gutter-md md:gap-gutter-lg">
          {DOCK_APPS.map((app) => {
            const isActive = activeApp === app.id;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => toggleApp(app.id)}
                data-component-id="card-interactive-2"
                data-component-type="card"
                data-component-variant="interactive"
                aria-pressed={isActive}
                className="group flex flex-col items-center gap-gutter-xs w-12 sm:w-14 focus-visible:outline-none"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-md ${blurClass} border flex items-center justify-center ${app.accentClass} transition-all duration-state-change ease-state-change group-hover:-translate-y-0.5 ${
                    isActive
                      ? 'bg-dark-surface-container-high/90 border-dark-primary shadow-lg'
                      : 'bg-dark-surface-container-low/80 border-dark-outline-variant/60 shadow-md group-hover:border-dark-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] sm:text-[24px]" aria-hidden="true">
                    {app.icon}
                  </span>
                </div>
                <span
                  data-design-text-token="body-sm"
                  className="font-body text-body-sm text-center text-dark-on-surface"
                >
                  {app.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-gutter-xs" aria-label="Halaman dok">
          <span className="w-2.5 h-1.5 rounded-full bg-dark-on-surface" />
          <span className="w-1.5 h-1.5 rounded-full bg-dark-outline" />
        </div>
      </nav>

      {/* Mobile 4-Column Home Launcher Grid */}
      <nav aria-label="Dok Aplikasi Mobile" className="sm:hidden flex flex-col items-center gap-gutter-md w-full">
        <div className="w-full grid grid-cols-4 gap-gutter-md">
          {DOCK_APPS.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-gutter-xs"
            >
              <div
                className={`w-12 h-12 rounded-md bg-dark-surface-container-low/80 ${blurClass} border border-dark-outline-variant/60 flex items-center justify-center ${app.accentClass} shadow-md active:scale-95 transition-transform duration-state-change`}
              >
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                  {app.icon}
                </span>
              </div>
              <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface">
                {app.label}
              </span>
            </button>
          ))}

          {/* 8th Mobile Launcher Slot: Resume */}
          <button
            type="button"
            onClick={() => openApp('about')}
            className="flex flex-col items-center gap-gutter-xs"
          >
            <div
              className={`w-12 h-12 rounded-md bg-dark-surface-container-low/80 ${blurClass} border border-dark-outline-variant/60 flex items-center justify-center text-dark-tertiary shadow-md active:scale-95 transition-transform duration-state-change`}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                description
              </span>
            </div>
            <span data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface">
              Resume
            </span>
          </button>
        </div>

        <div className="flex items-center gap-gutter-xs" aria-label="Halaman dok">
          <span className="w-2.5 h-1.5 rounded-full bg-dark-on-surface" />
          <span className="w-1.5 h-1.5 rounded-full bg-dark-outline" />
        </div>
      </nav>
    </>
  );
}
