'use client';

import React, { useEffect, useState } from 'react';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';

export function LockScreen() {
  const { unlockSession, settings } = useOs();
  const [password, setPassword] = useState('');
  const [unlockedMsg, setUnlockedMsg] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const timeText = now
    ? now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace('.', ':')
    : '18:52';

  const dateText = now
    ? new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now)
    : 'Sabtu, 21 November 2026';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockedMsg(true);
    setTimeout(() => {
      setPassword('');
      setUnlockedMsg(false);
      unlockSession();
    }, 350);
  };

  const blurMd = settings.glassmorphism ? 'backdrop-blur-md' : '';
  const blurXl = settings.glassmorphism ? 'backdrop-blur-xl' : '';
  const blur2xl = settings.glassmorphism ? 'backdrop-blur-2xl' : '';

  return (
    <div className="relative z-20 flex-1 flex flex-col justify-between w-full animate-surface-enter">
      {/* Top Bar: Kernel & Lock Status */}
      <header className="relative z-10 w-full flex items-center justify-between gap-gutter-md">
        <div
          className={`flex items-center gap-gutter-sm px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-low/75 ${blurMd} border border-dark-outline-variant/40`}
        >
          <span
            data-component-id="badge-dot"
            data-component-type="badge"
            data-component-variant="dot"
            role="status"
            aria-label="Sistem terkunci"
            className="inline-block w-2 h-2 rounded-full bg-dark-tertiary"
          />
          <span data-design-text-token="mono-md" className="hidden sm:inline font-mono text-mono-md text-dark-on-surface-variant">
            {PROFILE_INFO.osName} (Wayland)
          </span>
          <span data-design-text-token="mono-md" className="sm:hidden font-mono text-mono-md text-dark-on-surface-variant">
            Baihaqi OS 2.4
          </span>
        </div>

        <div
          className={`flex items-center gap-gutter-sm px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-low/75 ${blurMd} border border-dark-outline-variant/40`}
        >
          <span className="material-symbols-outlined text-[16px] text-dark-primary" aria-hidden="true">
            lock
          </span>
          <span data-design-text-token="label-sm" className="hidden sm:inline font-label text-label-sm text-dark-on-surface-variant">
            Sesi Terkunci
          </span>
        </div>
      </header>

      {/* Center Main: Digital Clock + Frosted Glass Login Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-gutter-xl py-gutter-xl">
        <div className="flex flex-col items-center text-center gap-gutter-xs">
          <p
            data-design-text-token="display-lg"
            className="font-display text-display-lg-mobile md:text-display-lg text-dark-on-surface tabular-nums"
          >
            {timeText}
          </p>
          <p data-design-text-token="body-md" className="font-body text-body-sm sm:text-body-md text-dark-on-surface-variant">
            {dateText}
          </p>
        </div>

        <section
          aria-label="Masuk ke Sesi Baihaqi OS"
          className={`w-full max-w-sm p-gutter-xl rounded-xl bg-dark-surface-container-low/80 ${blur2xl} border border-dark-outline-variant/60 shadow-2xl flex flex-col items-center text-center gap-gutter-lg`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-dark-primary-container/25 to-dark-surface-container-high border-2 border-dark-primary/60 overflow-hidden shadow-lg">
            <img
              src={PROFILE_INFO.avatarUrl}
              alt={`Foto profil ${PROFILE_INFO.name}`}
              className="w-full h-full object-cover object-[50%_62%]"
            />
          </div>

          <div className="flex flex-col gap-gutter-xs">
            <h1 data-design-text-token="headline-md" className="font-headline text-headline-md text-dark-on-surface">
              {PROFILE_INFO.name}
            </h1>
            <p data-design-text-token="body-sm" className="font-body text-body-sm text-dark-on-surface-variant">
              {PROFILE_INFO.role}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-gutter-md">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Kata sandi atau tekan masuk"
              placeholder="Ketik sandi tamu atau langsung masuk..."
              className="w-full rounded-full bg-dark-surface-container/80 border border-dark-outline-variant/60 px-gutter-lg py-gutter-sm font-mono text-mono-md text-dark-on-surface placeholder:text-dark-outline text-center focus:border-dark-primary focus:ring-0 focus:outline-none"
            />

            <button
              type="submit"
              data-component-id="button-primary"
              data-component-type="button"
              data-component-variant="primary"
              className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-xl py-gutter-sm rounded-full bg-dark-primary text-dark-on-primary hover:bg-dark-primary-container hover:text-dark-on-primary-container transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-primary"
            >
              <span data-design-text-token="label-lg" className="font-label text-label-lg">
                Masuk ke Baihaqi OS
              </span>
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </form>

          {unlockedMsg && (
            <p className="font-mono text-mono-md text-dark-tertiary" role="status">
              [OK] Autentikasi berhasil — memuat desktop...
            </p>
          )}
        </section>
      </main>

      {/* Bottom Bar: Session & Power Controls */}
      <footer className="relative z-10 w-full flex flex-wrap items-center justify-between gap-gutter-md">
        <div
          className={`flex items-center gap-gutter-sm px-gutter-lg py-gutter-sm rounded-full bg-dark-surface-container-low/75 ${blurXl} border border-dark-outline-variant/50`}
        >
          <span data-design-text-token="mono-md" className="font-mono text-mono-md text-dark-on-surface-variant">
            user: {PROFILE_INFO.username}
          </span>
        </div>

        <div className="flex items-center gap-gutter-sm">
          <button
            data-component-id="button-icon"
            data-component-type="button"
            data-component-variant="icon"
            type="button"
            onClick={() => setPassword('')}
            aria-label="Mulai ulang sesi"
            title="Reset input"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-dark-surface-container-low/75 ${blurMd} border border-dark-outline-variant/50 text-dark-on-surface-variant hover:text-dark-on-surface transition-colors duration-state-change ease-state-change`}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              refresh
            </span>
          </button>
          <button
            data-component-id="button-icon"
            data-component-type="button"
            data-component-variant="icon"
            type="button"
            onClick={unlockSession}
            aria-label="Masuk cepat"
            title="Masuk ke sesi tamu"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-dark-surface-container-low/75 ${blurMd} border border-dark-outline-variant/50 text-dark-on-surface-variant hover:text-dark-primary transition-colors duration-state-change ease-state-change`}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              power_settings_new
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
