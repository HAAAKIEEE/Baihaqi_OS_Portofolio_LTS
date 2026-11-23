'use client';

import React, { useState } from 'react';
import { PROFILE_INFO } from '@/data/profile';
import { useOs } from '@/context/OsContext';

export function HomeSearchBar() {
  const { openApp, askAi, settings } = useOs();
  const [query, setQuery] = useState('');
  const blurClass = settings.glassmorphism ? 'backdrop-blur-xl' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = query.trim();
    const val = raw.toLowerCase();

    if (!val) {
      openApp('ai-search');
      return;
    }

    if (val === 'terminal' || val === 'neofetch' || val === 'whoami' || val === 'zsh') {
      openApp('terminal');
      return;
    }
    if (val === 'proyek' || val === 'projects' || val === 'files') {
      openApp('projects');
      return;
    }
    if (val === 'ai lab' || val === 'ailab' || val === 'n8n') {
      openApp('ai-lab');
      return;
    }
    if (val === 'tentang' || val === 'about' || val === 'resume') {
      openApp('about');
      return;
    }
    if (val === 'keahlian' || val === 'skills' || val === 'htop') {
      openApp('skills');
      return;
    }
    if (val === 'github' || val === 'git') {
      openApp('github');
      return;
    }
    if (val === 'kontak' || val === 'contact') {
      openApp('contact');
      return;
    }
    if (val === 'settings' || val === 'pengaturan') {
      openApp('settings');
      return;
    }

    askAi(raw);
  };

  return (
    <div className="w-full max-w-lg mt-gutter-xs">
      <form
        onSubmit={handleSubmit}
        data-component-id="searchbar-standard"
        data-component-type="searchbar"
        data-component-variant="standard"
        role="search"
        className={`w-full rounded-lg bg-dark-surface-container-low/80 ${blurClass} border border-dark-outline-variant/60 p-gutter-md flex flex-col gap-gutter-sm sm:gap-gutter-md shadow-xl`}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Tanya atau cari di Baihaqi OS"
          placeholder="Tanya apa saja tentang Baihaqi, atau ketik perintah..."
          className="w-full bg-transparent border-0 p-0 font-body text-body-md text-dark-on-surface placeholder:text-dark-on-surface-variant focus:ring-0 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-gutter-sm">
          <div className="flex items-center gap-gutter-xs">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-dark-tertiary-container/30 text-dark-tertiary">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                terminal
              </span>
            </span>
            <span
              data-design-text-token="label-sm"
              className="font-label text-label-sm text-dark-on-surface-variant hidden sm:inline"
            >
              {PROFILE_INFO.tagline}
            </span>
          </div>
          <div className="flex items-center gap-gutter-sm">
            <button
              type="button"
              onClick={() => (query.trim() ? askAi(query) : openApp('ai-search'))}
              data-component-id="button-with-icon"
              data-component-type="button"
              data-component-variant="with-icon"
              className="hidden sm:inline-flex items-center gap-gutter-xs px-gutter-md py-gutter-xs rounded-full bg-dark-surface-container-high/80 border border-dark-outline-variant/50 text-dark-on-surface hover:bg-dark-surface-container-highest transition-colors duration-state-change ease-state-change"
            >
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                search
              </span>
              <span data-design-text-token="label-sm" className="font-label text-label-sm">
                Pencarian
              </span>
            </button>
            <button
              type="submit"
              aria-label="Jalankan perintah"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dark-surface-container-highest text-dark-on-surface hover:bg-dark-primary hover:text-dark-on-primary transition-colors duration-state-change ease-state-change"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
