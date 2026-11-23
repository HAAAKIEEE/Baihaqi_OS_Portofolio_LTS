'use client';

import React, { useEffect, useState } from 'react';
import { APP_PATHS, PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';

function formatLinuxDateTime(date: Date): string {
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = months[date.getMonth()] ?? 'Nov';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month}, ${hh}.${mm}`;
}

export function TopBar() {
  const {
    activeApp,
    openWindows,
    visibleWindows,
    showDesktop,
    toggleApp,
    openLauncher,
    lockSession,
    settings,
  } = useOs();

  const [dateTimeText, setDateTimeText] = useState('21 Nov, 12.28');

  useEffect(() => {
    const updateClock = () => setDateTimeText(formatLinuxDateTime(new Date()));
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  const pathInfo = APP_PATHS[activeApp];
  const hasMaximizedWindow = visibleWindows.some((w) => w.isMaximized);
  const blurXl = settings.glassmorphism ? 'backdrop-blur-xl' : '';

  const pathButton = (
    <div className="flex items-center gap-gutter-xs min-w-0">
      <button
        type="button"
        onClick={showDesktop}
        aria-label={activeApp === 'home' ? 'Baihaqi OS Home' : 'Tampilkan Desktop'}
        title={activeApp === 'home' ? pathInfo.desktop : 'Klik untuk menampilkan Desktop'}
        className="flex items-center gap-gutter-xs sm:gap-gutter-sm px-gutter-sm py-0.5 rounded-full hover:bg-white/10 transition-colors duration-state-change ease-state-change min-w-0"
      >
        <span
          data-component-id="badge-dot"
          data-component-type="badge"
          data-component-variant="dot"
          role="status"
          aria-label="Sistem aktif"
          className="inline-block w-2 h-2 rounded-full bg-dark-tertiary shrink-0"
        />
        <span
          data-design-text-token="mono-md"
          className="hidden sm:inline font-mono text-mono-md text-dark-on-surface truncate"
        >
          {pathInfo.desktop}
        </span>
        <span
          data-design-text-token="mono-md"
          className="sm:hidden font-mono text-mono-md text-dark-on-surface truncate"
        >
          {pathInfo.mobile}
        </span>
      </button>

      {visibleWindows.length > 0 && (
        <button
          type="button"
          onClick={showDesktop}
          aria-label="Tampilkan Desktop"
          className="sm:hidden inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/10 text-dark-on-surface-variant hover:text-dark-on-surface transition-colors duration-state-change"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            home
          </span>
        </button>
      )}
    </div>
  );

  const clockBadge = (
    <span
      data-design-text-token="mono-md"
      className="hidden md:inline-block font-mono text-mono-md text-dark-on-surface tabular-nums whitespace-nowrap select-none"
    >
      {dateTimeText}
    </span>
  );

  const rightControls = (
    <div className="flex items-center gap-gutter-xs sm:gap-gutter-sm shrink-0">
      {openWindows.length === 0 && (
        <span
          data-component-id="badge-status"
          data-component-type="badge"
          data-component-variant="status"
          role="status"
          className="sm:hidden inline-flex items-center px-gutter-sm py-0.5 rounded-full bg-dark-tertiary-container/25 border border-dark-tertiary/40 text-dark-tertiary"
        >
          <span data-design-text-token="label-sm" className="font-label text-label-sm">
            {PROFILE_INFO.availabilityMobileLabel}
          </span>
        </span>
      )}

      <button
        type="button"
        onClick={openLauncher}
        aria-label="Buka Command Launcher (Ctrl+K)"
        className="inline-flex items-center gap-gutter-xs px-gutter-sm py-1 rounded-full bg-black/20 border border-white/15 text-dark-on-surface hover:border-dark-primary/70 transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
      >
        <span className="material-symbols-outlined text-[15px] text-dark-primary" aria-hidden="true">
          search
        </span>
        <span data-design-text-token="mono-md" className="font-mono text-label-sm">
          Ctrl+K
        </span>
      </button>

      <button
        data-component-id="button-icon"
        data-component-type="button"
        data-component-variant="icon"
        type="button"
        onClick={lockSession}
        aria-label="Kunci Sesi (Alt+L)"
        title="Kunci Sesi (Alt+L)"
        className="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/15 text-dark-on-surface-variant hover:text-dark-on-surface transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
      >
        <span className="material-symbols-outlined text-[17px]" aria-hidden="true">
          lock
        </span>
      </button>

      <button
        data-component-id="button-icon"
        data-component-type="button"
        data-component-variant="icon"
        type="button"
        aria-label="Pengaturan Sistem"
        title="Pengaturan Sistem"
        onClick={() => toggleApp('settings')}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/15 transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary ${
          activeApp === 'settings'
            ? 'bg-white/15 text-dark-primary ring-1 ring-dark-primary/70'
            : 'text-dark-on-surface-variant hover:text-dark-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[17px]" aria-hidden="true">
          settings
        </span>
      </button>
    </div>
  );

  if (hasMaximizedWindow) {
    return (
      <div
        role="region"
        aria-label="Panel Atas Linux (Fullscreen)"
        className={`fixed top-0 inset-x-0 z-50 w-full h-10 bg-[#0a1222]/95 ${blurXl} border-b border-dark-outline-variant/50 px-gutter-lg flex items-center justify-between gap-gutter-md shadow-md overflow-x-auto overflow-y-hidden no-scrollbar transition-all duration-300`}
      >
        {pathButton}
        {clockBadge}
        {rightControls}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div
        role="region"
        aria-label="Panel Atas Linux Mengambang"
        className={`mx-auto w-fit max-w-full overflow-x-auto overflow-y-hidden no-scrollbar rounded-full bg-white/15 ${blurXl} border border-white/25 px-gutter-lg py-gutter-xs shadow-lg flex items-center gap-gutter-sm sm:gap-gutter-md transition-all duration-300`}
      >
        {pathButton}
        <span className="hidden md:inline-block w-px h-4 bg-white/20 shrink-0" aria-hidden="true" />
        {clockBadge}
        <span className="hidden md:inline-block w-px h-4 bg-white/20 shrink-0" aria-hidden="true" />
        {rightControls}
      </div>
    </div>
  );
}
